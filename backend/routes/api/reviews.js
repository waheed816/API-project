const express = require('express');
const router = express.Router();

const { requireAuth } = require('../../utils/auth');
const { SpotImage, Spot, User, Review, ReviewImage, } = require('../../db/models');

const sequelize = require('sequelize');

const { reviewImageCheckValidator, reviewCheckValidator } = require('../../utils/validation');

// Get all reviews by current user - URL: /api/reviews/current
router.get('/current', requireAuth, async (req, res, next) => {
    const userId = req.user.id;

    const reviews = await Review.findAll({
        where: {
            userId
        },
        include: [
            {
                model: User,
                attributes: ['id', 'firstName', 'lastName']
            },
            {
                model: Spot,
                attributes: ['id', 'ownerId', 'address', 'city', 'state', 'country', 'lat', 'lng', 'name', 'price'],
                include: [{
                    model: SpotImage,
                    attributes: ['url', 'preview']
                }]
            },
            {
                model: ReviewImage,
                attributes: ['id', 'url']
            }
        ]
    });

    if (!reviews.length) {
        return res.json("There are no reviews by the current user")
    };

    let reviewsResults = [];
    reviews.forEach(review => {
        let matchedReview = review.toJSON();
        if (matchedReview.Spot.SpotImages.length > 0) {
            for (let i = 0; i < matchedReview.Spot.SpotImages.length; i++) {
                if (matchedReview.Spot.SpotImages[i].preview) {
                    matchedReview.Spot.previewImage = matchedReview.Spot.SpotImages[i].url;
                };
            };
        };

        if (!matchedReview.Spot.previewImage) {
            matchedReview.Spot.previewImage = "There are no preview images for this spot";
        };

        if (!matchedReview.ReviewImages.length > 0) {
            matchedReview.ReviewImages = "There are no review images provided with this review"
        };

        delete matchedReview.Spot.SpotImages
        reviewsResults.push(matchedReview);
    });



    res.json({
        Reviews: reviewsResults
    });
});

// CHECK IF REVIEW EXISTS
const checkIfReviewExists = async (req, res, next) => {
    const { reviewId } = req.params;
    const review = await Review.findByPk(reviewId)

    if (!review) {
        const err = {}
        err.status = 404;
        err.title = "This review does not exist";
        err.message = "There is no review with the specified review id";
        return next(err)
    };
    return next();
}

//CHECK IF REVIEW BELONGS TO CURRENT USER
const checkIfReviewBelongsToUser = async (req, res, next) => {
    const { reviewId } = req.params;
    const user = req.user
    const review = await Review.findByPk(reviewId);

    if (user.id !== review.userId) {
        const err = {};
        err.status = 403;
        err.title = "Authorization error";
        err.message = "Current user is not authorized to delete or make changes to this review";
        return next(err);
    }
    return next();
};

// Add an Image to a Review based on the Review's id - URL: /api/reviews/:reviewId/images
router.post("/:reviewId/images", requireAuth, checkIfReviewExists, checkIfReviewBelongsToUser, reviewImageCheckValidator, async (req, res, next) => {

    const { reviewId } = req.params;
    const { url } = req.body;

    const review = await Review.findByPk(reviewId);

    let allImagesFromCurrentUserReview = await review.getReviewImages();

    const err = {}

    if (allImagesFromCurrentUserReview.length >= 10) {
        err.title = "Maximum number of images for this resource was reached";
        err.message = "Users are not allowed to add more than 10 images per review";
        err.status = 403;
        return next(err)
    };

    const newReviewImageFromCurrentUser = await review.createReviewImage({
        url
    });

    res.json({
        id: newReviewImageFromCurrentUser.id,
        url: newReviewImageFromCurrentUser.url
    });
});


//Edit an existing review based on review id - URL: /api/reviews/:reviewId
router.put('/:reviewId', requireAuth, checkIfReviewExists, checkIfReviewBelongsToUser, reviewCheckValidator, async (req, res, next) => {

    const { reviewId } = req.params;
    const { stars, review } = req.body;

    let changeReview = await Review.findByPk(reviewId);

    changeReview.stars = stars;
    changeReview.review = review;

    await changeReview.save();

    return res.json(changeReview);
});


//Delete review based on review id - URL: /api/reviews/:reviewId
router.delete('/:reviewId', requireAuth, checkIfReviewExists, checkIfReviewBelongsToUser, async (req, res, next) => {
    const { reviewId } = req.params;

    let review = await Review.findByPk(reviewId);

    await review.destroy();

    return res.json({
        "message": "Successfully deleted",
        "statusCode": 200
    });
});

module.exports = router;
