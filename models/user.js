const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const encryptAadhar = require('../utils/encryptAadhar')

const userSchema = new mongoose.Schema({
  aadharNo: {
    type: String,
    required: true,
    unique: true,
  },
  fullName: {
    type: String,
    required: true,
  },
  fatherName: {
    type: String,
    required: true,
  },
  dob: {
    type: String,
    required: true,
  },
  gender: {
    //enum : MALE, FEMALE
    type: String,
    required: true,
    enum: ["MALE", "FEMALE"],
    set: (value) => value.toUpperCase(),
  },
  caste: {
    //enum
    type: String,
    required: true,
    enum: ["ST", "SC", "OBC", "GEN"],
    set: (value) => value.toUpperCase(),
  },
  address: {
    type: String,
    required: true,
  },
  district: {
    type: String,
    required: true,
  },
  mobNo: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: false,
  },
  password: {
    type: String,
    required: true,
  },
  maskedAadhar: {
    type: String,
    required: true,
    index:true
  },
  financialYear: {
    type: Map,
    of: String,
    default: {},
  },
  role: {
    type: String,
    enum: ['ADMIN', 'FINANCE', 'STUDENT' ],
    default: 'STUDENT',
    set: (value) => value.toUpperCase(),
  },
  failedLoginAttempts: {
    type: Number,
    default: 0,
  },
  isLocked: {
    type: Boolean,
    default: false,
  },
  lockUntil: {
    type: Date,
    default: null,
  },
});

userSchema.pre("save", async function (next) {
  try {
    if (this.password && this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  if (this.aadharNo && this.isModified("aadharNo")) {
    this.aadharNo = encryptAadhar(this.aadharNo);
  }

  next();
}catch(error){
    return next (error);
}
})

userSchema.methods.checkpw = function (password, cb) {
  bcrypt.compare(password, this.password, (err, result) => {
    return cb(err, result);
  });
};

const User = mongoose.model("user", userSchema);

module.exports = User;
