const mongoose = require('mongoose');

const schoolSchema = new mongoose.Schema({
    schoolName: {
        type: String
    },
    schoolDistrict: {
        type: String
    },

})

const School = mongoose.model('school', schoolSchema);

module.exports = School;