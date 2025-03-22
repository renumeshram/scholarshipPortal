const mongoose = require('mongoose');

const educationSchema = new mongoose.Schema({
    enrollNo: {
        type: String,
        required: true,
        unique: true,
    },
    currentClass: {
        type: String,
        required: true,
    },
   
    schoolId: {
        // type: mongoose.SchemaTypes.ObjectId, //referring to schoolId
        // ref:'School',
        type: String,
        required: true, //need some logic
    },

    otherSchool: {
        type: String
    },
    
    appId: {
        type: String,
        required: true,
        unique: true,
    },
    
    eduLevel :{
        type: String,
        required: true,
    },

    
})

const Education = mongoose.model('education', educationSchema);

module.exports = Education;
