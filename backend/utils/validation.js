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

const queryCheck = [
  check("maxLat")
    .optional({ nullable: true })
    .isDecimal()
    .withMessage("Maximum latitude is invalid"),
  check("minLat")
    .optional({ nullable: true })
    .isDecimal()
    .withMessage("Minimum latitude is invalid"),
  check("maxLng")
    .optional({ nullable: true })
    .isDecimal()
    .withMessage("Maximum longitude is invalid"),
  check("minLng")
    .optional({ nullable: true })
    .isDecimal()
    .withMessage("Minimum longitude is invalid"),
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

module.exports = {
  handleValidationErrors,
  queryCheck,
};
