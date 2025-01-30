const mongoose = require('mongoose');

// Saved at Registration time
const applicationSchema = new mongoose.Schema({
    appId: {
        type: String,
        required: true,
        unique: true
    },
    studId: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: 'Student',
        required: true,
    },
    
   
})

const Application = mongoose.model('application', applicationSchema);

module.exports = Application;