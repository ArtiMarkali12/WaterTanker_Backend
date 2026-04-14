"use strict";

const attendanceService = require("../services/attendance.service");
const { sendSuccess } = require("../utils/response.util");

/**
 * GET /api/v1/attendance/drives/:driverName
 * Get all trip records for a specific driver
 */
const getDriverAttendance = async (req, res, next) => {
  try {
    const { driverName } = req.params;
    const result = await attendanceService.getDriverAttendance(driverName);
    return sendSuccess(res, {
      message: "Driver attendance retrieved successfully",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { getDriverAttendance };
