const Student = require('../models/student')
const Application = require('../models/application')
const bcrypt = require('bcrypt')
const generateAppId = require('../utils/generateAppId');
const getCurrentFinancialYear = require('../utils/getCurrentFinancialYear');
const { sendOTP, verifyOTP } = require('../utils/twilioSms');
const encryptAadhar = require('../utils/encryptAadhar');
const { MAX_ATTEMPTS, LOCK_TIME } = require('../constants/index')

const finYear = getCurrentFinancialYear();
// console.log(finYear);

const registerHandler = async (req, res) => {
    try {
        const { aadharNo, fullName, fatherName, dob, gender, caste, mobNo, address, district, password } = req.body;

        const encryptedAadhar = encryptAadhar(aadharNo);
        // console.log("🚀 ~ registerHandler ~ encryptedAadhar:", encryptedAadhar)

        const existingStudent = await Student.findOne({ aadharNo: encryptedAadhar });
        if (existingStudent) {
            return res.status(400).json({ msg: "User already registered. Please login..." });
        }
        const purpose = 'Registration'
        console.log("🚀 ~ registerHandler ~ purpose:", purpose)
        const sendOtpResponse = await sendOTP(mobNo, purpose); //this will send otp and store it

        if (!sendOtpResponse.success) {
            return res.status(400).json({
                msg: sendOtpResponse.msg
            })
        }

        req.session.registrationData = {
            aadharNo,
            fullName,
            fatherName,
            dob,
            gender,
            caste,
            mobNo,
            address,
            district,
            password,
        }

        res.status(200).json({
            success: true,
            msg: "Otp sent to your mobile number.Please verify to complete registration"
        });
    } catch (error) {
        console.log("🚀 ~ registerHandler ~ error:", error)
        if (error.code === 11000) return res.json({ msg: "User already registered. Please login..." })
        res.status(500).json({
            success: false,
            msg: 'Internal Server Error'
        })
    }

}
const verifyOTPHandler = async (req, res) => {
    console.log("🚀 ~ verifyOTPHandler ~ req.body:", req.body);

    const { mobNo, code } = req.body;
    codeInt = parseInt(code);
    console.log("🚀 ~ verifyOTPHandler ~ codeInt:", codeInt)


    const otpResponse = await verifyOTP(mobNo, codeInt);

    if (!otpResponse.success) {
        return res.status(400).json({
            success: false,
            msg: otpResponse.msg
        });
    }

    // OTP verification is successful, now proceed with registration
    req.session.verified = true;

    if (!req.session.registrationData) {
        return res.status(400).json({ success: false, msg: "Session expired. Please register again." });
    }

    // OTP is valid, now proceed to save the user

    const { aadharNo, fullName, fatherName, dob, gender, caste, address, district, password } = req.session.registrationData;

    const newUser = await Student.create({
        aadharNo,
        fullName,
        fatherName,
        dob,
        gender,
        caste,
        mobNo,
        district,
        address,
        password,
        maskedAadhar: aadharNo.slice(-4),
        financialYear: {
            [finYear]: null,
        }
    })

    console.log("New Student Details Added:", newUser);

    delete req.session.registrationData;

    res.status(201).json({
        success: true,
        msg: "Registration Successful",
        statusCode: 201,
    });


}

const loginHandler = async (req, res) => {
    try {
        const { aadharNo, password } = req.body;
        
        // const students = await Student.find({ maskedAadhar: aadharNo.slice(-4) }); //can't exclude pw as it's verification cb isn't working  & it will return array of entries having same masked aadharNo
        
        // if (students.length === 0) return res.json({ msg: "Student not found. Please register..." });
        
        const encryptedAadhar = encryptAadhar(aadharNo);
        // console.log("🚀 ~ loginHandler ~ encryptedAadhar:", typeof(encryptedAadhar))
        
        
        let studentFound = await Student.findOne({ aadharNo: encryptedAadhar });
        console.log("🚀 ~ loginHandler ~ studentFound:", studentFound)
        
        
        if (!studentFound) {
            return res.json({ msg: "Student not found....Please register!!!" })
        }
        
        if(studentFound.isLocked && studentFound.lockUntil > Date.now()){
            return res.status(403).json({ msg: "Account is locked. Try again later."})
        }
        
        studentFound.checkpw(password, async function (err, result) {
            if (err) return next(err)
                
                if (!result){
                    studentFound.failedLoginAttempts += 1;
                    
                    if(studentFound.failedLoginAttempts >= MAX_ATTEMPTS){
                        studentFound.isLocked = true;
                        studentFound.lockUntil = Date.now() + LOCK_TIME;
                    }
                    
                    await studentFound.save();
                    return res.status(400).json({ msg: "Invalid Password" });
                } 
            
                studentFound.failedLoginAttempts = 0;
                studentFound.isLocked = false;
                studentFound.lockUntil = null;
                await studentFound.save();
                
            const purpose = 'Login';
            const sendOtpResponse = await sendOTP(studentFound.mobNo, purpose);
            if (!sendOtpResponse.success) {
                return res.status(400).json({
                    msg: sendOtpResponse.msg
                })
            }

            req.session.tempStudId = studentFound._id;
            req.session.tempRole = studentFound.role;

            res.status(200).json({
                success: true,
                msg: "Otp sent to your mobile number.Please verify to complete login",
                statusCode: 200,
            });



            // console.log(student.financialYear.get(finYear));


        })

    } catch (error) {
        console.log(error);

        res.json({ msg: "Error in Logging In" })
    }

}

const verifyLoginOTPHandler = async (req, res) => {
    try {
        const { mobNo, code } = req.body;

        const codeInt = parseInt(code);

        const otpResponse = await verifyOTP(mobNo, codeInt);

        if (!otpResponse) {
            return res.status(400).json({
                success: false,
                msg: otpResponse.msg,
            })
        }

        const studId = req.session.tempStudId;
        const role = req.session.tempRole;

        if (!studId) {
            return res.status(400).json({
                msg: 'Session expired. Please login again.'
            });
        }

        const studentFound = await Student.findById(studId);

        if (!studentFound) {
            return res.status(400).json({
                msg: 'Student not found. Please register...'
            });
        }

        try {

            if (!(studentFound.financialYear.has(finYear)) || studentFound.financialYear.get(finYear) === null) {

                const appId = await generateAppId(finYear);
                console.log(appId);

                studentFound.financialYear.set(finYear, appId);

                const newApplication = await Application.create({
                    appId,
                    studId,
                })

                console.log("New Application", newApplication);

                await studentFound.save();

            }
        }
        catch (error) {
            console.log("Error in accessing & comparing the Academic Year", error);

            return res.status(500).json({ msg: "Something went wrong!" })
        }

        req.session.studId = studentFound._id
        req.session.role = role;
        req.session.appId = studentFound.financialYear.get(finYear);
        req.session.caste = studentFound.caste;
        console.log("Login Successful", req.session);

        delete req.session.tempStudId;
        delete req.session.tempRole;

        return res.status(200).json({
            success: true,
            msg: "Successfully LoggedIn",
            statusCode: 200,
        })

    } catch (error) {
        console.log("🚀 ~ verifyLoginOTPHandler ~ error:", error)
        return res.status(500).json({
            success: false,
            msg: 'Error in verifyOTPHandler...',
            statusCode: 500,
        })

    }

}

module.exports = { registerHandler, loginHandler, verifyOTPHandler, verifyLoginOTPHandler }