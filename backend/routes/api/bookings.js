const express = require('express');
const router = express.Router();

const { requireAuth } = require('../../utils/auth');
const { User, Spot, Review, SpotImage, ReviewImage, Booking } = require('../../db/models');

const { check } = require('express-validator');

const sequelize = require('sequelize');

const { checkBookingValidator } = require('../../utils/validation');



// Get bookings for current user
router.get("/current", requireAuth, async (req, res, next) => {
    const userInfo = req.user;

    const userBookings = await userInfo.getBookings({
        include: [{
            model: Spot,
            attributes: ['id', 'ownerId', 'address', 'city', 'state', 'country', 'lat', 'lng', 'name', 'price'],
            include: [{
                model: SpotImage,
                attributes: ['url', 'preview']
            }]
        }]
    });

    if (!userBookings.length > 0) {
        return res.json({
            message: "There are no bookings by current user"
        })
    }

    const userBookingsResults = [];

    userBookings.forEach(booking => {

        let matchedBooking = booking.toJSON();

        if(matchedBooking.Spot.SpotImages[0].preview === false){
            matchedBooking.Spot.previewImage = "There is no preview image for this spot";
        }else{
            matchedBooking.Spot.previewImage = matchedBooking.Spot.SpotImages[0].url
        }

        delete matchedBooking.Spot.SpotImages;
        const eachMatchedBooking = {
            id: matchedBooking.id,
            spotId: matchedBooking.spotId,
            Spot: matchedBooking.Spot,
            userId: matchedBooking.userId,
            startDate: matchedBooking.startDate.split(" ")[0],
            endDate: matchedBooking.endDate.split(" ")[0],
            createdAt: matchedBooking.createdAt,
            updatedAt: matchedBooking.updatedAt
        }

        userBookingsResults.push(eachMatchedBooking);
    })

    res.json({
        Bookings: userBookingsResults
    })
})

//CHECK IF BOOKING EXISTS
const checkIfBookingExists = async (req, res, next) => {
    const { bookingId } = req.params;
    let booking = await Booking.findByPk(bookingId);

    if (!booking) {
        const err = {};
        err.title = "Booking couldn't be found"
        err.status = 404;
        err.message = "Couldn't find a booking with that specified booking id";
        return next(err)
    }
    return next();
};

//CONVERT DATES TO DATE OBJECT
const convertToDateObject = (date) => {
    const [year, month, day] = date.split("-");
    const newDateObject = new Date(year, month-1, day)
    return newDateObject;
}

//Edit a Booking based on bookingId - URL: /api/bookings/:bookingId
router.put('/:bookingId', requireAuth, checkIfBookingExists,  checkBookingValidator, async (req, res, next) => {
    const { bookingId } = req.params;
    const currentUser = req.user;
    let { startDate, endDate } = req.body;

    let changeBookingInfo = await Booking.findByPk(bookingId);

    let err = {};

    // FIRST, CHECK IF BOOKING BELONGS TO CURRENT USER
    if (currentUser.id !== changeBookingInfo.userId) {
        err.status = 403;
        err.title = "AUTHORIZATION ERROR";
        err.message = "This booking does not belong to current user";
        return next(err);
    }

    startDate = convertToDateObject(startDate);
    endDate = convertToDateObject(endDate);

    const originalBookingStartDate = convertToDateObject(changeBookingInfo.startDate);
    const originalBookingEndDate = convertToDateObject(changeBookingInfo.endDate);


    //CHECK IF ORIGINAL BOOKING END DATE IS PAST THE CURRENT DATE
    if (originalBookingEndDate < new Date()) {
        err.status = 403;
        err.title = "Can't edit a booking that's past the end date";
        err.message = "Past bookings can't be modified";
        return next(err);
    };


    //CHECK IF USER IS ATTEMPTING TO MAKE AN EDIT THAT RESULTS IN A DUPLICATE BOOKING
    if ((startDate.getTime() === originalBookingStartDate.getTime()) &&
        (endDate.getTime() === originalBookingEndDate.getTime())){
        err.status = 403;
        err.title = "DUPLICATE BOOKING ATTEMPT"
        err.errors = [
            {startDate: "You have entered the same start date as your own original booking that you're trying to edit"},
            {endDate: "You have entered the same end date as your own original booking that you're trying to edit"}
        ];
        return next(err);
    }


    if (startDate <= new Date()) {
        err.status = 403;
        err.title = "INVALID START DATE VALUE";
        err.message = "The start date value cannot be before the current date";
        return next(err)
    }

    if (endDate <= startDate) {
        err.statusCode = 400;
        err.title = "INVALID END DATE VALUE";
        err.message = "The end date value cannot be on or before the start date";
        return next(err);
    };

    //GET SPOT ID OF BOOKING
    const spotId = changeBookingInfo.spotId;

    //GET SPOT FOR BOOKING
    const spot = await Spot.findByPk(spotId);
    //GET ALL BOOKING FOR SPOT
    const spotBookings = await spot.getBookings();

    //GO THROUGH ALL BOOKINGS FOR SPOT !!!EXCEPT FOR CURRENT BOOKING!!! TO CHECK FOR START DATE & END DATE CONFLICTS
    spotBookings.forEach(booking => {
        if (booking.id !== changeBookingInfo.id) {
            let spotBooking = booking.toJSON();
            err.status = 403;
            err.title = "Booking Conflict";
            err.message = "Sorry, this spot is already booked for the specified dates";

            let reservedStartDate = convertToDateObject(spotBooking.startDate);
            let reservedEndDate = convertToDateObject(spotBooking.endDate);

            //DESIRED START DATE-------RESERVED START DATE-------RESERVED END DATE-------DESIRED START DATE SCENARIO
            //======================================OOOOOOOOOORRRRRRRR==============================================
            //RESERVED START DATE-------DESIRED START DATE-------DESIRED END DATE-------RESERVED START DATE SCENARIO
            if (((reservedStartDate >= startDate) && (reservedEndDate <= endDate)) ||
                ((reservedStartDate <= startDate) && (reservedEndDate >= endDate))) {

                    err.errors = [
                        { startDate: "Start date conflicts with an existing booking" },
                        { endDate: "End date conflicts with an existing booking" }
                    ]
                    return next(err);

            //RESERVED START DATE-------DESIRED START DATE-------RESERVED END DATE SCENARIO
            } else if ((reservedStartDate <= startDate) && (reservedEndDate >= startDate)) {

                err.errors = [{ startDate: "Start date conflicts with an existing booking" }]

                return next(err);

            //RESERVED START DATE-------DESIRED END DATE-------RESERVED END DATE SCENARIO
            } else if ((reservedStartDate <= endDate) && (reservedEndDate >= endDate)) {

                err.errors = [{ endDate: "End date conflicts with an existing booking" }];

                return next(err);
            }
        }
    });

    if (!err.errors) {
        changeBookingInfo.startDate = startDate;
        changeBookingInfo.endDate = endDate;
        await changeBookingInfo.save();
        res.json(changeBookingInfo)
    }
})


module.exports = router;
