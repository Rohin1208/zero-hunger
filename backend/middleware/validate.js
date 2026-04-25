const { body, validationResult } = require("express-validator");

// Rules for adding food
const validateFood = [
  body("food_name")
    .trim()
    .notEmpty()
    .withMessage("Food name cannot be empty"),

  body("quantity")
    .isInt({ min: 1 })
    .withMessage("Quantity must be a positive number"),

  body("expiry")
    .isISO8601()
    .withMessage("Expiry must be a valid date")
    .custom((value) => {
      if (new Date(value) <= new Date()) {
        throw new Error("Expiry must be a future date");
      }
      return true;
    }),
];

// Middleware to check results
const checkValidation = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

module.exports = { validateFood, checkValidation };