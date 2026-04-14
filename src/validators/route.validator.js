"use strict";

const { body, param } = require("express-validator");

const createRouteValidator = [
  body("source")
    .trim()
    .notEmpty()
    .withMessage("Source is required.")
    .isLength({ max: 200 })
    .withMessage("Source cannot exceed 200 characters."),

  body("destination")
    .trim()
    .notEmpty()
    .withMessage("Destination is required.")
    .isLength({ max: 200 })
    .withMessage("Destination cannot exceed 200 characters."),

  body("distanceInKm")
    .notEmpty()
    .withMessage("Distance in km is required.")
    .isFloat({ min: 0 })
    .withMessage("Distance must be a non-negative number."),
];

const updateRouteValidator = [
  param("id").isMongoId().withMessage("Invalid route ID."),

  body("source")
    .optional()
    .trim()
    .isLength({ max: 200 })
    .withMessage("Source cannot exceed 200 characters."),

  body("destination")
    .optional()
    .trim()
    .isLength({ max: 200 })
    .withMessage("Destination cannot exceed 200 characters."),

  body("distanceInKm")
    .optional()
    .isFloat({ min: 0 })
    .withMessage("Distance must be a non-negative number."),
];

const routeIdValidator = [
  param("id").isMongoId().withMessage("Invalid route ID."),
];

module.exports = { createRouteValidator, updateRouteValidator, routeIdValidator };
