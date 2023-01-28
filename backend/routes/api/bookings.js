const express = require('express');
const router = express.Router();

const { requireAuth } = require('../../utils/auth');
const { User, Spot, Review, SpotImage, ReviewImage, Booking } = require('../../db/models');

const { check } = require('express-validator');

const sequelize = require('sequelize');


// Get bookings for current user
router.get("/current", requireAuth, async (req, res, next) => {
    const user = req.user;

    const userBookings = await user.getBookings({
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

        if (matchedBooking.Spot.SpotImages.length > 0) {
            for (let i = 0; i < matchedBooking.Spot.SpotImages.length; i++) {
                if (matchedBooking.Spot.SpotImages[i].preview === true) {
                    matchedBooking.Spot.previewImage = matchedBooking.Spot.SpotImages[i].url;
                }
            }
        }

        if (!matchedBooking.Spot.previewImage) {
            matchedBooking.Spot.previewImage = "There is no preview image for this spot";
        }


        delete matchedBooking.Spot.SpotImages;
        const eachMatchedBooking = {
            id: booking.id,
            spotId: booking.spotId,
            Spot: matchedBooking.Spot,
            userId: booking.userId,
            startDate: booking.startDate.split(" ")[0],
            endDate: booking.endDate.split(" ")[0],
            createdAt: booking.createdAt,
            updatedAt: booking.updatedAt
        }
        //console.log(eachBooking)
        userBookingsResults.push(eachMatchedBooking);
    })

    res.json({
        Bookings: userBookingsResults
    })
})



module.exports = router;
