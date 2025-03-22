
const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema({
    appId : {
        type : String,
        required : true,
        unique : true,
    },
    amount : {
        type : Number,
        required: true,
    },
    transactionId : {
        type : String,
        required : true,
    },
    status:{
        type: String,
        enum: ['PENDING', 'PROCESSED', 'FAILED'],
        default: 'PENDING', 
        set: (value)=> value.toUpperCase(),
    },
    processedBy:{
        type : mongoose.SchemaTypes.ObjectId,
        ref : 'User'
    },
    processedAt: {
        type : Date
    }
}, {timestamps: true})

const Payment = mongoose.model('payment', paymentSchema);

module.exports = Payment;