const express = require('express');
const router = express.Router();

const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { User, Spot, Review, SpotImage, ReviewImage, Booking } = require('../../db/models');

const { check } = require('express-validator');

const {
    handleValidationErrors,
    queryCheck,
    // validateSpot,
    // validateReview,
    // validateBooking,
    // validateSpotImage,
} = require('../../utils/validation');

//const { ifSpotExists, ifUsersSpot, convertDate } = require('../../utils/error-handlers')

const sequelize = require('sequelize');
const { Op } = require('sequelize');


// GET all spots - URL: /api/spots
router.get('/', queryCheck, async (req, res, next) => {

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

    let allSpotsArray = [];

    allSpots.forEach(spot => {
        let matchedSpot = spot.toJSON();

        let count = spot.Reviews.length;
        let sum = 0;
        spot.Reviews.forEach((review) => sum += review.stars)
        let avg = sum / count;
        if (!avg) {
            avg = "There are no current ratings for this spot"
        };

        matchedSpot.avgRating = avg;

        if (matchedSpot.SpotImages.length > 0) {
            for (let i = 0; i < matchedSpot.SpotImages.length; i++) {
                if (matchedSpot.SpotImages[i].preview === true) {
                    matchedSpot.previewImage = matchedSpot.SpotImages[i].url;
                }
            }
        }

        if (!matchedSpot.previewImage) {
            matchedSpot.previewImage = "There are no preview images for this spot";
        }

        delete matchedSpot.SpotImages
        delete matchedSpot.Reviews;
        allSpotsArray.push(matchedSpot);
    })

    if (allSpotsArray.length === 0) {
        res.json("There are no spots matching your query")
    }


    res.json({
        Spots: allSpotsArray,
        page: page,
        size: size
    });

});



module.exports = router;
