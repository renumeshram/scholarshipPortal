const mongoose = require('mongoose');

const docSchema = new mongoose.Schema({

    appId: {
        type: String,
        required: true,
        unique: true,
        index:true
    },
   
    birthUrl: {
        type: String,
        required: true,
    },
    casteUrl: {
        type: String,
        // required: true,
    },
    domicileUrl: {
        type: String,
        required: true,
    },
    incomeUrl: {
        type: String,
        required: true,
    },
    passbookUrl: {
        type: String,
        required: true,
    },
    prevMarksheetUrl: {
        type: String,
        required: true,
    },
    bplUrl: {
        type: String,
       
    },
    gapUrl: {
        type: String,
    },
    instituteAckUrl: {
        type: String,
        required: true,
    }
})


const Document = mongoose.model('document', docSchema);

module.exports = Document;