const express = require('express');
const router = express.Router();

const validateRegistration = require('../middleware/validateRegistration')
const validateAcadDetails = require('../middleware/validateAcadDetails')
const validateBankDetails = require('../middleware/validateBankDetails')
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

// const {userRole } = require('../constants/index')

router.get("/", (req, res)=>{ //HOME PAGE
    // if(err) return console.log(err);
    console.log("Welcome here");
    res.send("Welcome")    
})

router.post("/register",validateRegistration, registerHandler) //Registration route: POST request to pass the user data 

router.post("/login", loginHandler) //Login Route (using aadharNo and password)

router.post("/forgot-password", forgotPw); //Forgot PW route (using aadharNo & otp)
router.post("/verify-forgotpw-otp", verifyOTPForPw); //Route to verify otp of forgot password 
router.post("/reset-password", validateResetPw, resetPw); //Route to reset password after otp verification
router.post("/change-password", isLoggedIn, changePw); //Route to Change PW (verifying oldPW and setting new)


router.post("/verify-otp", verifyOTPHandler) //2FA (OTP verification)for User Registration
router.post("/verify-login-otp", verifyLoginOTPHandler) //2FA for User Login

router.post("/logout", logoutHandler) //Route for User Logout

//STUDENT ROUTES
router.post("/academic-details",isLoggedIn, isAuthorized(["STUDENT"]),validateAcadDetails ,academicDetailsHandler) //Route for adding Academic Details, only accessed by Student

router.post("/bank-details", isLoggedIn, isAuthorized(["STUDENT"]), validateBankDetails,bankDetailsHandler) //For adding Bank Details

router.post("/uploads", isLoggedIn, isAuthorized(["STUDENT"]), uploadMiddleware, docUploads) //For uploading Student Documents

module.exports = router

