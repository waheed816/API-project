const express = require('express');
const router = express.Router();

const { requireAuth } = require('../../utils/auth');
const { SpotImage, User, Spot, Review, ReviewImage } = require('../../db/models');

const {
    queryCheckValidator,
    spotCheckValidator,
    spotImageValidator,
    reviewCheckValidator,
    checkBookingValidator
} = require('../../utils/validation');

const sequelize = require('sequelize');
const { Op } = require('sequelize');


// GET all spots - URL: /api/spots
router.get('/', queryCheckValidator, async (req, res, next) => {

    //deconstruct all query parameters from request, if any
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


    //create query with default OR user's custom pagination and to add where clauses based on query parameters user input, if any
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


    //============ FIND ALL SPOTS THAT MATCH QUERIES ======================

    let allSpots = await Spot.findAll(query);

    let spotsResults = [];

    allSpots.forEach(spot => {
        let matchedSpot = spot.toJSON();

        let totalReviews = spot.Reviews.length;
        let totalStars = 0;

        spot.Reviews.forEach((review) => {
            totalStars += review.stars
        })

        let avg = totalStars / totalReviews;

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
        };

        if (!matchedSpot.previewImage) {
            matchedSpot.previewImage = "There are no preview images for this spot";
        };

        delete matchedSpot.SpotImages
        delete matchedSpot.Reviews;
        spotsResults.push(matchedSpot);
    });

    if (!spotsResults.length) {
        res.json("There are no spots matching your query")
    };


    res.json({
        Spots: spotsResults,
        page,
        size
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
        spot.Reviews.forEach((review) => {
            totalStars += review.stars
        });

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

//CHECK IF SPOT EXISTS HELPER FUNCTION
const checkSpot = async (req, res, next) => {
    let { spotId } = req.params;
    let spotInfo = await Spot.findByPk(spotId);
    if (!spotInfo) {
        let err = {};
        err.status = 404;
        err.title = "Spot not found"
        err.message = "Spot with specified spotId does not exist";
        return next(err);
    };
    return next();
}

//Get details of a Spot by spotId - URL: /api/spots/:spotId
router.get('/:spotId', checkSpot, async (req, res, next) => {

    let { spotId } = req.params;

    let spotInfo = await Spot.findByPk(spotId);

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
        spotInfo.SpotImages = "There are no images for this spot"
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

//CHECK IF SPOT BELONGS TO LOGGED IN USER HELPER FUNCTION
const checkSpotBelongsToUser = async (req, res, next) => {
    let { spotId } = req.params;
    const spotInfo = await Spot.findByPk(spotId);

    const user = req.user;
    if (user.id !== spotInfo.ownerId) {
        let err = {};
        err.title = "Authorization error";
        err.status = 403;
        err.message = "You are not the authorized owner for this spot";
        return next(err);
    };
    return next();
};

//Add an Image to a Spot based on the Spot's id - URL: /api/spots/:spotId/images
router.post('/:spotId/images', requireAuth, checkSpot, checkSpotBelongsToUser, spotImageValidator, async (req, res, next) => {
    let { spotId } = req.params;
    let { url, preview } = req.body;

    const spotInfo = await Spot.findByPk(spotId);

    let spotImage = await spotInfo.createSpotImage({
        url: url,
        preview: preview
    });

    res.json({
        id: spotImage.id,
        url: spotImage.url,
        preview: spotImage.preview
    });
})

//Edit a Spot based on spotId - URL: /api/spots/:spotId
router.put('/:spotId', requireAuth, checkSpot, checkSpotBelongsToUser, spotCheckValidator, async (req, res, next) => {

    const { spotId } = req.params;
    const { address, city, state, country, lat, lng, name, description, price } = req.body;

    const spotInfo = await Spot.findByPk(spotId);

    spotInfo.address = address;
    spotInfo.city = city;
    spotInfo.state = state;
    spotInfo.country = country;
    spotInfo.lat = lat;
    spotInfo.lng = lng;
    spotInfo.name = name;
    spotInfo.description = description;
    spotInfo.price = price;

    await spotInfo.save();

    res.json(spotInfo);
});

//Delete a spot - URL: /api/spots/:spotId
router.delete('/:spotId', requireAuth, checkSpot, checkSpotBelongsToUser, async (req, res, next) => {
    const { spotId } = req.params;

    const spotInfo = await Spot.findByPk(spotId);

    await spotInfo.destroy();
    res.json({
        message: "Successfully deleted",
        statusCode: 200
    })
});

//Get all Reviews by a Spot's id - URL: /api/spots/:spotId/reviews
router.get('/:spotId/reviews', checkSpot, async (req, res, next) => {
    const { spotId } = req.params;

    const spotInfo = await Spot.findByPk(spotId);

    const reviews = await spotInfo.getReviews({
        include: [
            {
                model: User,
                attributes: ['id', 'firstName', 'lastName']
            },
            {
                model: ReviewImage,
                attributes: ['id', 'url']
            }
        ]
    });

    if (!reviews.length) {
        return res.json("There are no reviews for this specified spot")
    };

    let reviewsResults = [];
    reviews.forEach(review => {
        let matchedReview = review.toJSON();

        if (!matchedReview.ReviewImages.length > 0) {
            matchedReview.ReviewImages = "No review images were included for this review"
        }

        reviewsResults.push(matchedReview);
    });


    res.json({
        Reviews: reviewsResults
    });
});

//CHECK IF USER ALREADY HAS EXISTING REVIEW FOR SPOT (HELPER FUNCTION)
const checkForExistingReview = async (req, res, next) => {
    const user = req.user;

    let { spotId } = req.params;

    let existingReview = await Review.findOne({
        where: {
            spotId: spotId,
            userId: user.id
        }
    })

    const err = {};

    if (existingReview) {
        err.status = 403;
        err.title = "Current user already has an existing review for this spot";
        err.message = "User already has a review for this spot";
        return next(err)
    }
    return next();
};

//SPOT OWNER CANNOT LEAVE A REVIEW FOR THEIR OWN SPOT CHECKER
const reviewerCannotBeSpotOwner = async (req, res, next) => {
    let { spotId } = req.params;
    const spotInfo = await Spot.findByPk(spotId);

    const user = req.user;
    if (user.id == spotInfo.ownerId) {
        let err = {};
        err.title = "Authorization error";
        err.status = 403;
        err.message = "Spot owners cannot create reviews for their own spot";
        return next(err);
    };
    return next();
};

//Create a Review for a Spot based on the Spot's id - URL: /api/spots/:spotId/reviews
router.post('/:spotId/reviews', requireAuth, checkSpot, reviewerCannotBeSpotOwner, checkForExistingReview, reviewCheckValidator, async (req, res, next) => {
    const { spotId } = req.params;
    const { review, stars } = req.body

    const user = req.user;
    const spotInfo = await Spot.findByPk(spotId);

    const createNewReview = await spotInfo.createReview({
        userId: user.id,
        review: review,
        stars: stars
    })

    res.status = 201;
    res.json(createNewReview)
})

//Get all Bookings for a Spot based on the Spot's id - URL: /api/spots/:spotId/bookings
router.get('/:spotId/bookings', requireAuth, checkSpot, async (req, res, next) => {
    const { spotId } = req.params;
    const userInfo = req.user;

    const spotInfo = await Spot.findByPk(spotId);

    let spotBookings = await spotInfo.getBookings({
        include: {
            model: User,
            attributes: ["id", "firstName", "lastName"]
        }
    });

    if (!spotBookings.length > 0) {
        return res.json({
            message: "There are no bookings for this spot"
        })
    };

    const bookingsResults = [];
    spotBookings.forEach(booking => {

        let matchedBooking = booking.toJSON();

        matchedBooking.startDate = matchedBooking.startDate.split(" ")[0];
        matchedBooking.endDate = matchedBooking.endDate.split(" ")[0];

        if (userInfo.id !== spotInfo.ownerId) {

            let eachMatchedBooking = {
                spotId: matchedBooking.spotId,
                startDate: matchedBooking.startDate,
                endDate: matchedBooking.endDate
            };

            bookingsResults.push(eachMatchedBooking);

        } else {
            let eachMatchedBooking = {
                User: matchedBooking.User,
                spotId: matchedBooking.spotId,
                userId: matchedBooking.userId,
                startDate: matchedBooking.startDate,
                endDate: matchedBooking.endDate,
                createdAt: matchedBooking.createdAt,
                updatedAt: matchedBooking.updatedAt
            };
            bookingsResults.push(eachMatchedBooking);
        }
    })

    res.json({
        Bookings: bookingsResults
    })
})

//SPOT OWNER CANNOT CREATE BOOKING FOR THEIR OWN SPOT CHECK
const checkIfBookingBySpotOwner = async (req, res, next) => {
    let { spotId } = req.params;
    const spotInfo = await Spot.findByPk(spotId);

    const user = req.user;
    if (user.id == spotInfo.ownerId) {
        let err = {};
        err.title = "Authorization error";
        err.status = 403;
        err.message = "Spot owners cannot create bookings for their own spot";
        return next(err);
    };
    return next();
};

//Create a Booking for a Spot based on the Spot's id - URL: /api/spots/:spotId/bookings
router.post('/:spotId/bookings', requireAuth, checkSpot, checkIfBookingBySpotOwner, checkBookingValidator, async (req, res, next) => {
    const { spotId } = req.params;
    const user = req.user;
    const spot = await Spot.findByPk(spotId);

    const err = {};

    //GRAB THE TIME ENTERED BY USER
    let { startDate, endDate } = req.body;

    const convertToDateObject = (date) => {
        const [year, month, day] = date.split("-");
        const newDateObject = new Date(year, month-1, day)
        return newDateObject;
    }

    //CONVERT TIME TO AN INSTANCE OF THE DATE OBJECT
    startDate = convertToDateObject(startDate)
    endDate = convertToDateObject(endDate)

    //CHECK IF START DATE IS VALID
    if (startDate <= new Date()) {
        err.statusCode = 400;
        err.title = "INVALID START DATE VALUE";
        err.message = "The start date value cannot be before the current date";
        return next(err)
    }

    //CHECK IF END DATE IS VALID
    if (endDate <= startDate) {
        err.statusCode = 400;
        err.title = "INVALID END DATE VALUE";
        err.message = "The end date value cannot be on or before the start date";
        return next(err);
    };

    //CHECK FOR BOOKING CONFLICTS
    const spotBookings = await spot.getBookings();

    spotBookings.forEach(booking => {
        let spotBooking = booking.toJSON();
        err.status = 403;
        err.title = "Booking Conflict";
        err.message = "Sorry, this spot is already booked for the specified dates";

        let reservedStartDate = convertToDateObject(spotBooking.startDate);
        let reservedEndDate = convertToDateObject(spotBooking.endDate);

        //SCENARIO 1:
        //DESIRED START DATE-------RESERVED START DATE-------RESERVED END DATE-------DESIRED START DATE
        if ((reservedStartDate > startDate) && (reservedEndDate < endDate)) {

                err.errors = { datesConflict: "There is an existing booking in between your start and end dates" };

                return next(err);

        //SCENARIO 2:
        //RESERVED START DATE-------DESIRED START DATE-------DESIRED END DATE-------RESERVED END DATE
        }else if (((reservedStartDate <= startDate) && (reservedEndDate >= startDate)) &&
                    ((reservedStartDate <= endDate) && (reservedEndDate >= endDate))){

                        err.errors = {

                            startDate: "Start date conflicts with an existing booking",
                            endDate: "End date conflicts with an existing booking"

                        };

                        return next(err);

        //SCENARIO 3:
        //RESERVED START DATE-------DESIRED START DATE-------RESERVED END DATE
        }else if ((reservedStartDate <= startDate) && (reservedEndDate >= startDate)) {

            err.errors = { startDate: "Start date conflicts with an existing booking" };

            return next(err);

        //SCENARIO 4:
        //RESERVED START DATE-------DESIRED END DATE-------RESERVED END DATE
        }else if ((reservedStartDate <= endDate) && (reservedEndDate >= endDate)) {

            err.errors = { endDate: "End date conflicts with an existing booking" };

            return next(err);
        }

    });

    if (!err.errors) {
        let newBooking = await spot.createBooking({
            userId: user.id,
            startDate,
            endDate
        })
        return res.json(newBooking)
    };
})


module.exports = router;
