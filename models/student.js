const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const studentSchema = new mongoose.Schema({
    studId: {
        type: String,
        required: true,
        unique: true,
    },
    aadharNo: {
        type: String,
        required: true,
        unique: true
    },
    fullName: {
        type: String,
        required: true,
    },
    fatherName: {
        type: String,
        required: true,
    },
    gender: {
        type: String,
        required: true,
    },
    caste: {
        type: String,
        required: true,
    },
    mobNo: {
        type: String,
        required: true,
    },
    address: {
        type: String ,
        required: true,  
    },
    district: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    dob: {
        type: String,
        required: true,
    }
})

studentSchema.pre('save', function(next){
    if (this.password && this.isModified('password')){
        bcrypt.hash(this.password, 10, (err, hashedPw) =>{
            if(err) return next(err);
            this.password = hashedPw;
            next()
        })
    }
    else{
        next()
    }
})

studentSchema.methods.checkpw = function(password, cb){

    bcrypt.compare(password, this.password, (err, result)=>{
        return cb(err, result)
    })

}

const Student = mongoose.model('student', studentSchema);

module.exports = Student;