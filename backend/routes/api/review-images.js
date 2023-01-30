const express = require('express');
const router = express.Router();

const { requireAuth } = require('../../utils/auth');
const { ReviewImage } = require('../../db/models');

const sequelize = require('sequelize');


// Delete an existing image from a review by imageId - URL: /api/review-images/:imageId

router.delete('/:imageId', requireAuth, async (req, res, next) => {
    const { imageId } = req.params;
    const user = req.user

    const err = {};

    const image = await ReviewImage.findByPk(imageId);

    /// CHECK IF REVIEW IMAGE EXISTS
    if (!image) {
        err.status = 404;
        err.title = "There is no review image with the specified image id";
        err.message = "Review Image couldn't be found"
        return next(err)
    };

    const review = await image.getReview();

    /// CHECK IF REVIEW BELONGS TO CURRENT USER
    if (user.id !== review.userId) {
        err.status = 403;
        err.title = "AUTHORIZATION ERROR";
        err.message = "Current user did not create the review that this image belongs to"
        return next(err)
    };

    await image.destroy();
    res.json({
        "message": "Successfully deleted",
        "statusCode": 200
    })
})




module.exports = router;
