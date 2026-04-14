"use strict";

const mongoose = require("mongoose");

const routeSchema = new mongoose.Schema(
  {
    source: {
      type: String,
      required: [true, "Source is required"],
      trim: true,
      maxlength: [200, "Source cannot exceed 200 characters"],
    },
    destination: {
      type: String,
      required: [true, "Destination is required"],
      trim: true,
      maxlength: [200, "Destination cannot exceed 200 characters"],
    },
    distanceInKm: {
      type: Number,
      required: [true, "Distance in km is required"],
      min: [0, "Distance cannot be negative"],
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

module.exports = mongoose.model("Route", routeSchema);
