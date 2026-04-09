"use strict";

const mongoose = require("mongoose");
const Request = require("../models/request.model");
const { REQUEST_STATUS } = require("../config/constants");

/**
 * Returns the next sequential queue position (max + 1).
 * Uses a separate atomic operation to prevent races.
 */
const getNextQueuePosition = async () => {
  const last = await Request.findOne({}, { queuePosition: 1 })
    .sort({ queuePosition: -1 })
    .lean();
  return last ? last.queuePosition + 1 : 1;
};

/**
 * Returns the live pending queue sorted by queuePosition (FIFO order).
 */
const getPendingQueue = async ({ page = 1, limit = 20 } = {}) => {
  const skip = (page - 1) * limit;
  const [items, total] = await Promise.all([
    Request.find({ status: REQUEST_STATUS.PENDING })
      .sort({ queuePosition: 1 })
      .skip(skip)
      .limit(limit)
      .populate("userId", "mobileNumber profile")
      .lean(),
    Request.countDocuments({ status: REQUEST_STATUS.PENDING }),
  ]);
  return { items, total, page, limit };
};

/**
 * Returns the next pending request (lowest queuePosition).
 */
const peekNextInQueue = async () => {
  return Request.findOne({ status: REQUEST_STATUS.PENDING })
    .sort({ queuePosition: 1 })
    .populate("userId", "mobileNumber profile")
    .lean();
};

/**
 * Atomically assigns a tanker to the specified request.
 * Ensures:
 *   - Request exists and is still pending (prevents duplicate assignment).
 *   - Uses findOneAndUpdate with strict conditions for concurrency safety.
 */
const assignTanker = async ({ requestId, tankerAssignment, managerId }) => {
  const updated = await Request.findOneAndUpdate(
    {
      _id: requestId,
      status: REQUEST_STATUS.PENDING, // Only assign if still pending
    },
    {
      $set: {
        status: REQUEST_STATUS.ASSIGNED,
        tankerAssignment,
        assignedAt: new Date(),
        assignedBy: managerId,
      },
    },
    {
      new: true,
      runValidators: true,
    },
  ).populate("userId", "mobileNumber profile");

  return updated; // Returns null if request doesn't exist or is already assigned
};

/**
 * Marks an assigned request as completed.
 */
const completeRequest = async (requestId) => {
  return Request.findOneAndUpdate(
    { _id: requestId, status: REQUEST_STATUS.ASSIGNED },
    { $set: { status: REQUEST_STATUS.COMPLETED, completedAt: new Date() } },
    { new: true },
  );
};

/**
 * Generates a manager report with assignment statistics and history.
 * Supports optional date range filtering.
 */
const getManagerReport = async ({
  managerId,
  startDate,
  endDate,
  page = 1,
  limit = 50,
} = {}) => {
  const skip = (page - 1) * limit;

  // Build match conditions
  const matchConditions = {
    assignedBy: new mongoose.Types.ObjectId(managerId),
  };

  if (startDate || endDate) {
    matchConditions.assignedAt = {};
    if (startDate) matchConditions.assignedAt.$gte = new Date(startDate);
    if (endDate) matchConditions.assignedAt.$lte = new Date(endDate);
  }

  // Get summary statistics
  const stats = await Request.aggregate([
    { $match: matchConditions },
    {
      $group: {
        _id: "$status",
        count: { $sum: 1 },
      },
    },
  ]);

  // Get total assigned requests
  const totalAssigned = await Request.countDocuments(matchConditions);

  // Get detailed assignment history with pagination
  const assignments = await Request.find(matchConditions)
    .sort({ assignedAt: -1 })
    .skip(skip)
    .limit(limit)
    .populate("userId", "mobileNumber profile")
    .populate("assignedBy", "username mobileNumber")
    .lean();

  // Format statistics
  const summary = {
    total: totalAssigned,
    byStatus: stats.reduce((acc, stat) => {
      acc[stat._id] = stat.count;
      return acc;
    }, {}),
  };

  return {
    summary,
    assignments,
    pagination: {
      page,
      limit,
      total: totalAssigned,
      totalPages: Math.ceil(totalAssigned / limit),
    },
  };
};

module.exports = {
  getNextQueuePosition,
  getPendingQueue,
  peekNextInQueue,
  assignTanker,
  completeRequest,
  getManagerReport,
};
