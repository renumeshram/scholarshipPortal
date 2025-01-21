const mongoose = require('mongoose');

const bankSchema = new mongoose.Schema({
    // bankId

    accountNo: {
        type: String,
        required: true,
        unique: true,
    },
    ifscCode: {
        type: String,
        required: true,
    },
    bankName: {
        type: String,
        required: true,
    },
    bankBranch: {
        type: String,
        required: true,
    },
    appId: {
        type: String,
        required: true,
        unique: true,
        index:true
    }
})

const Bank = mongoose.model('bank', bankSchema);

module.exports = Bank;