const express = require('express');
const router = express.Router();

const { requireAuth } = require('../../utils/auth');
const { User, Spot, Review, SpotImage, ReviewImage, Booking } = require('../../db/models');

const { check } = require('express-validator');

const sequelize = require('sequelize');


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



module.exports = router;
