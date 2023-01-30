const express = require('express');
const router = express.Router();

const { requireAuth } = require('../../utils/auth');
const { SpotImage } = require('../../db/models');

const sequelize = require('sequelize');


//Delete an existing image for a Spot by imageId - URL: /api/spot-images/:imageId

router.delete("/:imageId", requireAuth, async (req, res, next) => {
    const { imageId } = req.params;
    const user = req.user

    const err = {};

    const image = await SpotImage.findByPk(imageId);

    //CHECK IF SPOT IMAGE EXISTS
    if (!image) {
        err.status = 404;
        err.title = "There is no spot image with the specified image id";
        err.message = "Spot Image couldn't be found"
        return next(err)
    };

    const spot = await image.getSpot();

    //CHECK IF CURRENT USER OWNS SPOT
    if (user.id !== spot.ownerId) {
        err.status = 403;
        err.title = "AUTHORIZATION ERROR";
        err.message = "Current user does not own the spot that this image belongs to"
        return next(err)
    };

    await image.destroy();
    res.json({
        "message": "Successfully deleted",
        "statusCode": 200
    })
})



module.exports = router;
