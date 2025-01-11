const express = require('express');
const router = express.Router();

const validateRegistration = require('../middleware/validation')
const validateAcadDetails = require('../middleware/acadValidation')
const isLoggedIn = require('../middleware/isLoggedIn')

const {
    registerStudent,
    loginHandler,
} = require('../controller/user')

const academicDetailsHandler = require('../controller/acadDetails')

router.get("/", (req, res)=>{
    // if(err) return console.log(err);
    console.log("Welcome here");
    res.send("Welcome")    
})

router.post("/Register",validateRegistration, registerStudent)

router.post("/Login", loginHandler)


router.post("/Academic-details",isLoggedIn,validateAcadDetails ,academicDetailsHandler)


module.exports = router

