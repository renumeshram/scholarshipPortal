const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const studentSchema = new mongoose.Schema({
  aadharNo: {
    type: String,
    required: true,
    unique: true,
    index: true,
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
  },
  financialYear: {
    type: Map,
    of: String,
    default: {},
  },
});

studentSchema.pre("save", async function (next) {
  try {if (this.password && this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  if (this.aadharNo) {
    this.aadharNo = await bcrypt.hash(this.aadharNo, 10);
  }

  next();
}catch(error){
    return next (error);
}
})

studentSchema.methods.checkpw = function (password, cb) {
  bcrypt.compare(password, this.password, (err, result) => {
    return cb(err, result);
  });
};

const Student = mongoose.model("student", studentSchema);

module.exports = Student;
