const express = require('express');
const router = express.Router();

const isLoggedIn = require('../middleware/isLoggedIn');
const isAuthorized = require('../middleware/roleMiddleware');
const { getApprovedApplications, paymentStatusUpdate } = require('../controller/financeController');

router.get("/approved-applications",isLoggedIn, isAuthorized(["ADMIN","FINANCE"]), getApprovedApplications);

router.post("/applications/payment-update/:id", isLoggedIn, isAuthorized(["ADMIN", "FINANCE"]), paymentStatusUpdate);

module.exports = router