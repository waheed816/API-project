const express = require('express');
const router = express.Router();

const { requireAuth } = require('../../utils/auth');
const { User, Spot, Review, SpotImage, ReviewImage, Booking } = require('../../db/models');

const { check } = require('express-validator');
const sequelize = require('sequelize');


// Get reviews of current user - URL: /api/reviews/current
router.get('/current', requireAuth, async (req, res, next) => {
    const userId = req.user.id;

    const reviews = await Review.findAll({
        where: {
            userId: userId
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
                if (matchedReview.Spot.SpotImages[i].preview === true) {
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

module.exports = router;
