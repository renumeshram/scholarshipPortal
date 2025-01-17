const express = require('express');
const router = express.Router();

const validateRegistration = require('../middleware/validation')
const validateAcadDetails = require('../middleware/acadValidation')
const validateBankDetails = require('../middleware/bankValidation')
const isLoggedIn = require('../middleware/isLoggedIn')

const {
    registerStudent,
    loginHandler,
} = require('../controller/user')

const academicDetailsHandler = require('../controller/acadDetails')
const bankDetailsHandler = require('../controller/bankDetails')

router.get("/", (req, res)=>{
    // if(err) return console.log(err);
    console.log("Welcome here");
    res.send("Welcome")    
})

router.post("/register",validateRegistration, registerStudent)

router.post("/login", loginHandler)


router.post("/academic-details",isLoggedIn,validateAcadDetails ,academicDetailsHandler)

router.post("/bank-details", isLoggedIn, validateBankDetails,bankDetailsHandler)


module.exports = router

