const mongoose = require('mongoose');

// Saved at Registration time
const applicationSchema = new mongoose.Schema({
    appId: {
        type: String,
        required: true,
        unique: true
    },
    studId: {
        type: String,
        required: true,
    },
   
})

const Application = mongoose.model('application', applicationSchema);

module.exports = Application;