const Education = require('../models/education');

const validateAcadDetails = async (req, res, next)=>{

    const {academicYear, enrollNo, eduLevel, currentClass,  schoolName, schoolAddr, schoolDistt} = req.body;

    if([academicYear, enrollNo, eduLevel, currentClass, schoolName, schoolAddr, schoolDistt].some((field)=> field?.trim() === "")){
        return res.status(400).json({
            success: false,
            message: "All fields are required...",
            statusCode:400
        })

    }
    // check = await Education.findOne({enrollNo});

    // if(check){
    //     return res.status(400).json("This Enrollment number has already been registered. Enter valid Enrollment No.")
    // }
    
    next()
    

}

module.exports = validateAcadDetails;