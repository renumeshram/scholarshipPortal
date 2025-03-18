const mongoose = require('mongoose');

// Saved at Registration time
const applicationSchema = new mongoose.Schema({
    appId: {
        type: String,
        required: true,
        unique: true
    },
    userId: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: 'User',
        required: true,
    },
    status: {
        type: String,
        enum: ["DRAFT", "SUBMITTED", "APPROVED", "REJECTED"],
        set: (value)=> value.toUpperCase(),
    },
    reviewedBy: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: 'User',
    },
    reviewedAt: {
        type: Date,
    }
    
}, { timestamps: true});

applicationSchema.pre("save", async function(next){
    try{
        if(this.reviewedBy && this.isModified("reviewedBy")){
            this.reviewedAt = new Date()
        }
        next();
    }
    catch(error){
        return next(error);
    }
})

const Application = mongoose.model('application', applicationSchema);

module.exports = Application;