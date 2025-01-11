const mongoose = require('mongoose');

const educationSchema = new mongoose.Schema({
    academicYear: {
        type: String,
        required: true,
    },
    enrollNo: {
        type: String,
        required: true,
        unique: true,
    },
    eduLevel: {
        type: String,
        required: true,
    },
    currentClass: {
        type: String,
        required: true,
    },
   
    school: {
        type: String,
        required: true,
    },
    
    appId: {
        type: String,
        required: true,
        unique: true,
    }

    
})

const Education = mongoose.model('education', educationSchema);

module.exports = Education;
