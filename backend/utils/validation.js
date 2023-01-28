// backend/utils/validation.js
const { check, validationResult } = require('express-validator');

// middleware for formatting errors from express-validator middleware
// (to customize, see express-validator's documentation)
const handleValidationErrors = (req, _res, next) => {
  const validationErrors = validationResult(req);

  if (!validationErrors.isEmpty()) {
    const errors = validationErrors
      .array()
      .map((error) => `${error.msg}`);

    const err = Error('Bad request.');
    err.errors = errors;
    err.status = 400;
    err.title = 'Bad request.';
    next(err);
  }
  next();
};

const queryCheckValidator = [
  check("maxLat")
    .optional({ nullable: true })
    .isFloat({ min: -90, max: 90 })
    .withMessage("Must enter a latitude value between -90 and 90"),
  check("minLat")
    .optional({ nullable: true })
    .isFloat({ min: -90, max: 90 })
    .withMessage("Must enter a latitude value between -90 and 90"),
  check("maxLng")
    .optional({ nullable: true })
    .isFloat({ min: -180, max: 180 })
    .withMessage("Must enter a longtitude value between -180 and 180"),
  check("minLng")
    .optional({ nullable: true })
    .isFloat({ min: -180, max: 180 })
    .withMessage("Must enter a longtitude value between -180 and 180"),
  check("maxPrice")
    .optional()
    .isFloat({ min: 0 })
    .withMessage("Maximum price must be greater or equal to 0"),
  check("minPrice")
    .optional()
    .isFloat({ min: 0 })
    .withMessage("Minimum price must be greater or equal to 0"),
  check("page")
    .optional({ nullable: true })
    .isInt({ min: 1 })
    .withMessage("Page must be greater than or equal to 1"),
  check("size")
    .optional({ nullable: true })
    .isInt({ min: 1 })
    .withMessage("Size must be greater than or equal to 1"),
  handleValidationErrors
];

const spotCheckValidator = [
  check("address")
      .notEmpty()
      .withMessage("Street address is required"),
  check("city")
      .notEmpty()
      .withMessage("City is required"),
  check("state")
      .notEmpty()
      .withMessage("State is required"),
  check("country")
      .notEmpty()
      .withMessage("Country is required"),
  check("lat", "Must enter a latitude")
      .notEmpty()
      .bail()
      .isFloat({ min: -90, max: 90 })
      .withMessage("Must enter a latitude value between -90 and 90"),
  check("lng", "Must enter a longtitude")
      .notEmpty()
      .bail()
      .isFloat({ min: -180, max: 180 })
      .withMessage("Must enter a longtitude value between -180 and 180"),
  check("name", "Name is required")
      .notEmpty()
      .bail()
      .isLength({ max: 50 })
      .withMessage("Name must be less than 50 characters"),
  check("description")
      .notEmpty()
      .withMessage("Description is required"),
  check("price", "Price per day is required")
      .notEmpty()
      .bail()
      .isFloat({min: 0})
      .withMessage("Price cannot be less than 0"),
  handleValidationErrors
];

const spotImageValidator = [
  check('url')
      .notEmpty()
      .withMessage('url must be defined'),
  check('preview')
      .notEmpty()
      .isBoolean()
      .withMessage('preview must be a boolean value'),
  handleValidationErrors
];

const reviewCheckValidator = [
  check('review')
      .notEmpty()
      .withMessage('Review text is required'),
  check('stars', "Must provide stars rating")
      .notEmpty()
      .bail()
      .isInt({ min: 1, max: 5 })
      .withMessage('Stars must be an integer from 1 to 5'),
  handleValidationErrors
];

const reviewImageCheckValidator = [
  check('url')
      .notEmpty()
      .withMessage('Must provide image url'),
  handleValidationErrors
];

const checkBookingValidator = [
  check('startDate', "Must include start date")
      .notEmpty()
      .bail()
      .isDate()
      .withMessage("Start date must be a valid date in the format of YYYY-MM-DD"),
  check('endDate', "Must include end date")
      .notEmpty()
      .bail()
      .isDate()
      .withMessage("End date must be a valid date in the format YYYY-MM-DD"),
  handleValidationErrors
];

module.exports = {
  handleValidationErrors,
  queryCheckValidator,
  spotCheckValidator,
  spotImageValidator,
  reviewCheckValidator,
  reviewImageCheckValidator,
  checkBookingValidator
};
