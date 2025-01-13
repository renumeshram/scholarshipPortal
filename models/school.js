const mongoose = require('mongoose');

const schoolSchema = new mongoose.Schema({
    schoolId: {
        type: String,
        required: true,
        unique: true,
    },
    schoolName: {
        type: String
    },
    schoolDistt: {
        type: String
    },
    schoolAddr: {
        type: String,
    },
    schoolCity: {
        type: String,
    }

})

const School = mongoose.model('school', schoolSchema);

module.exports = School;