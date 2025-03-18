const express = require('express');
const router = express.Router();

const isLoggedIn = require('../middleware/isLoggedIn')
const isAuthorized = require('../middleware/roleMiddleware');
const {getApplications, applicationAction} = require('../controller/adminController')

//ADMIN, FINANCE ROUTES
router.get("/dashboard", isLoggedIn, isAuthorized(["ADMIN", "FINANCE"]), (req, res)=>{
    res.json({ msg: "Welcome to the Dashboard!"})
}); //Dashboard route only accessed by admin and finance

router.get("/report", isLoggedIn, isAuthorized(["ADMIN", "FINANCE"]), (req, res)=>{
    res.json({ msg: "Here is the report." });
});//Report containing all user application details

router.get("/applications/submitted", isLoggedIn, isAuthorized(["ADMIN"]), getApplications) //Route to get all the submitted applications

router.patch("/applications/approval/:id", isLoggedIn, isAuthorized(["ADMIN"]), applicationAction); //Route to approve or reject the user application & Patch request is to update the application status

module.exports = router