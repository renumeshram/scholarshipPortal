const express = require('express');
const router = express.Router();

const validateRegistration = require('../middleware/validation')
const validateAcadDetails = require('../middleware/acadValidation')
const validateBankDetails = require('../middleware/bankValidation')
const uploadMiddleware = require('../middleware/uploadMiddleware')
const isLoggedIn = require('../middleware/isLoggedIn')
const validateResetPw = require('../middleware/validateResetPw')

const {
    registerHandler,
    loginHandler,
    verifyOTPHandler,
    verifyLoginOTPHandler,
} = require('../controller/studentRegLogin')
const logoutHandler = require("../controller/logout")
const {
    forgotPw,
    verifyOTPForPw,
    resetPw,
} = require('../controller/forgotPassword')
const changePw = require('../controller/changePassword')

const academicDetailsHandler = require('../controller/acadDetails')
const bankDetailsHandler = require('../controller/bankDetails')
const docUploads = require('../controller/docUploads')

const isAuthorized = require('../middleware/roleMiddleware');

router.get("/", (req, res)=>{
    // if(err) return console.log(err);
    console.log("Welcome here");
    res.send("Welcome")    
})

router.post("/register",validateRegistration, registerHandler)

router.post("/login", loginHandler)

router.post("/forgot-password", forgotPw);
router.post("/verify-forgotpw-otp", verifyOTPForPw);
router.post("/reset-password", validateResetPw, resetPw);
router.post("/change-password", isLoggedIn, changePw);


router.post("/verify-otp", verifyOTPHandler)
router.post("/verify-login-otp", verifyLoginOTPHandler)

router.post("/academic-details",isLoggedIn,validateAcadDetails ,academicDetailsHandler)

router.post("/bank-details", isLoggedIn, validateBankDetails,bankDetailsHandler)

router.post("/uploads", isLoggedIn, uploadMiddleware, docUploads)

router.get("/dashboard", isLoggedIn, isAuthorized(["admin", "finance"]), (req, res)=>{
    res.json({ msg: "WELCOME to the DASHBOARD!"})
});

router.get("/report", isLoggedIn, isAuthorized(["admin", "finance"]), (req, res)=>{
    res.json({ msg: "Here is the report." });
});

router.post("/logout", logoutHandler)

module.exports = router

