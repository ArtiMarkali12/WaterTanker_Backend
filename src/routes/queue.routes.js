"use strict";

const express = require("express");
const router = express.Router();
const { protect } = require("../middlewares/auth.middleware");
const { authorize } = require("../middlewares/role.middleware");
const { validate } = require("../middlewares/validate.middleware");
const { ROLES } = require("../config/constants");
const {
  getQueue,
  peekNext,
  assignTanker,
  completeRequest,
  getManagerReport,
  assignSourceDestination,
} = require("../controllers/queue.controller");
const {
  assignTankerValidator,
  completeRequestValidator,
  paginationValidator,
  managerReportValidator,
  assignSourceDestinationValidator,
} = require("../validators/request.validator");

// All queue routes are manager and superAdmin-only
router.use(protect, authorize(ROLES.MANAGER, ROLES.SUPER_ADMIN));

router.get("/", paginationValidator, validate, getQueue);
router.get("/next", peekNext);
router.patch("/:id/assign", assignTankerValidator, validate, assignTanker);
router.patch(
  "/:id/assign-source-destination",
  assignSourceDestinationValidator,
  validate,
  assignSourceDestination,
);
router.patch(
  "/:id/complete",
  completeRequestValidator,
  validate,
  completeRequest,
);
router.get("/report", managerReportValidator, validate, getManagerReport);

module.exports = router;
