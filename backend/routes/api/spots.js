const express = require('express');
const router = express.Router();

const { requireAuth } = require('../../utils/auth');
const { User, Spot, Review, SpotImage, ReviewImage, Booking } = require('../../db/models');

const { check } = require('express-validator');

const {
    //handleValidationErrors,
    queryCheckValidator,
    spotCheckValidator,
    spotImageValidator
    // validateReview,
    // validateBooking,
    // validateSpotImage,
} = require('../../utils/validation');

const sequelize = require('sequelize');
const { Op } = require('sequelize');


// GET all spots - URL: /api/spots
router.get('/', queryCheckValidator, async (req, res, next) => {

    //deconstruct all query parameters from request body first
    let { maxLat, minLat, maxLng, minLng, maxPrice, minPrice, page, size } = req.query

    // ========== page/size PAGINATION QUERY check ==========

    page = Number(page);
    size = Number(size);

    if (!page) page = 1
    if (page > 10) page = 10;
    if (!size) size = 20
    if (size > 20) size = 20;

    let pagination = {}
    if (parseInt(page) >= 1 && parseInt(size) >= 1) {
        pagination.limit = size
        pagination.offset = (page - 1) * size
    }

    const query = {
        where: {},
        include: [
            {
                model: Review,
                attributes: ['stars']
            },
            {
                model: SpotImage,
                attributes: ['url', 'preview']
            }
        ],
        ...pagination,
    };

    // ========== maxLat/minLat LOCATION QUERY check ==========


    if (maxLat && minLat) {
        query.where.lat = {
            [Op.and]: {
                [Op.lte]: maxLat,
                [Op.gte]: minLat
            }
        }
    };

    if (!maxLat && minLat) {
        query.where.lat = {
            [Op.gte]: minLat
        }
    };

    if (maxLat && !minLat) {
        query.where.lat = {
            [Op.lte]: maxLat
        }
    };

    // ========== maxLng/minLng LOCATION QUERY check ==========

    if (maxLng && minLng) {
        query.where.lng = {
            [Op.and]: {
                [Op.lte]: maxLng,
                [Op.gte]: minLng
            }
        }
    };

    if (!maxLng && minLng) {
        query.where.lng = {
            [Op.gte]: minLng
        }
    };

    if (maxLng && !minLng) {
        query.where.lng = {
            [Op.lte]: maxLng
        }
    };

    // ========== maxPrice/minPrice PRICING QUERY check ==========

    if (!maxPrice && minPrice) {
        query.where.price = {
            [Op.gte]: minPrice
        }
    };

    if (maxPrice && minPrice) {
        query.where.price = {
            [Op.and]: {
                [Op.lte]: maxPrice,
                [Op.gte]: minPrice
            }
        }
    };

    if (maxPrice && !minPrice) {
        query.where.price = {
            [Op.lte]: maxPrice
        }
    };


    //=========++++ FIND ALL SPOTS THAT MATCH QUERIES ======================

    let allSpots = await Spot.findAll(query);

    let spotsResults = [];

    allSpots.forEach(spot => {
        let matchedSpots = spot.toJSON();

        let totalReviews = spot.Reviews.length;
        let totalStars = 0;
        spot.Reviews.forEach((review) => totalStars += review.stars)
        let avg = totalStars / totalReviews;
        if (!avg) {
            avg = "There are no current ratings for this spot"
        };

        matchedSpots.avgRating = avg;

        if (matchedSpots.SpotImages.length > 0) {
            for (let i = 0; i < matchedSpots.SpotImages.length; i++) {
                if (matchedSpots.SpotImages[i].preview === true) {
                    matchedSpots.previewImage = matchedSpots.SpotImages[i].url;
                }
            }
        };

        if (!matchedSpots.previewImage) {
            matchedSpots.previewImage = "There are no preview images for this spot";
        };

        delete matchedSpots.SpotImages
        delete matchedSpots.Reviews;
        spotsResults.push(matchedSpots);
    });

    if (spotsResults.length === 0) {
        res.json("There are no spots matching your query")
    };


    res.json({
        Spots: spotsResults,
        page: page,
        size: size
    });

});

// GET all spots owned by Current User - URL: /api/spots/current
router.get('/current', requireAuth, async (req, res, next) => {

    let user = req.user;

    let allSpots = await user.getSpots({
        include: [
            {
                model: Review,
                attributes: ['stars']
            },
            {
                model: SpotImage,
                attributes: ['url', 'preview']
            }
        ]
    });

    let spotsResults = [];

    allSpots.forEach(spot => {
        let matchedSpots = spot.toJSON();

        let totalReviews = spot.Reviews.length;
        let totalStars = 0;
        spot.Reviews.forEach((review) => totalStars += review.stars)
        let avg = totalStars / totalReviews;
        if (!avg) {
            avg = "There are no current ratings for this spot"
        };

        matchedSpots.avgRating = avg;

        if (matchedSpots.SpotImages.length > 0) {
            for (let i = 0; i < matchedSpots.SpotImages.length; i++) {
                if (matchedSpots.SpotImages[i].preview === true) {
                    matchedSpots.previewImage = matchedSpots.SpotImages[i].url;
                }
            }
        };

        if (!matchedSpots.Reviews.length > 0) {
            matchedSpots.Reviews = "There are currently no reviews for this spot"
        };

        if (!matchedSpots.SpotImages.length > 0) {
            matchedSpots.SpotImages = "There are no current images for this spot"
        };

        if (!matchedSpots.previewImage) {
            matchedSpots.previewImage = "There are no preview images for this spot";
        };

        delete matchedSpots.SpotImages;
        delete matchedSpots.Reviews;
        spotsResults.push(matchedSpots);
    });


    if (spotsResults.length === 0) {
        res.json("You currently do not own any spots")
    };

    res.json({
        Spots: spotsResults
    });
});

//Get details of a Spot from an id - URL: /api/spots/:spotId

router.get('/:spotId', async (req, res, next) => {

    let { spotId } = req.params;

    let spotInfo = await Spot.findByPk(spotId);

    //CHECK IF SPOT EXISTS
    if (!spotInfo) {
        let err = {};
        err.status = 404;
        err.title = "Spot not found"
        err.message = "No spot found matching specified spot id";
        return next(err);
    };

    spotInfo = spotInfo.toJSON();

    let count = await Review.count({
        where: {
            spotId: spotId
        }
    });
    spotInfo.numReviews = count;

    let sum = await Review.sum('stars', {
        where: {
            spotId: spotId
        }
    });

    if (sum / count) {
        spotInfo.avgStarRating = sum / count;
    } else {
        spotInfo.avgStarRating = "No current ratings";
    };

    let spotImages = await SpotImage.findAll({
        where: {
            spotId: spotId
        },
        attributes: ['id', 'url', 'preview']
    });

    if (spotImages.length > 0) {
        spotInfo.SpotImages = spotImages;
    } else {
        spotInfo.SpotImages = "No images listed"
    };


    spotInfo.Owner = await User.findByPk(spotInfo.ownerId, {
        attributes: ['id', 'firstName', 'lastName']
    });

    return res.json(spotInfo);
})

// Create a spot - URL: /api/spots
router.post('/', requireAuth, spotCheckValidator, async (req, res, next) => {

    let user = req.user;

    const newSpotInfo = req.body;

    newSpotInfo.ownerId = user.id;

    const newSpotCreated = await Spot.create(newSpotInfo);

    return res.json(newSpotCreated);
});

//Add an Image to a Spot based on the Spot's id - URL: /api/spots/:spotId/images

router.post('/:spotId/images', requireAuth, spotImageValidator, async (req, res, next) => {
    let { spotId } = req.params;
    let { url, preview } = req.body;
    const spotInfo = await Spot.findByPk(spotId);

    const user = req.user;

    //CHECK IF SPOT EXISTS
    if (!spotInfo) {
        let err = {};
        err.status = 404;
        err.title = "Spot not found"
        err.message = "Spot with specified spotId does not exist";
        return next(err);
    };

    //CHECK IF SPOT BELONGS TO LOGGED IN USER
    if (user.id !== spotInfo.ownerId) {
        const err = {};
        err.title = "Authorization error";
        err.status = 403;
        err.message = "You are not the authorized owner for this spot";
        return next(err);
    }


    let spotImage = await spotInfo.createSpotImage({
        url: url,
        preview: preview
    })

    res.json({
        id: spotImage.id,
        url: spotImage.url,
        preview: spotImage.preview
    });
})


module.exports = router;
