const User = require('../models/user')
const Application = require('../models/application')
const generateAppId = require('../utils/generateAppId');
const getCurrentFinancialYear = require('../utils/getCurrentFinancialYear');
const { sendOTP, verifyOTP } = require('../utils/twilioSms');
const encryptAadhar = require('../utils/encryptAadhar');
const { MAX_ATTEMPTS, LOCK_TIME, userRole } = require('../constants/index')

const finYear = getCurrentFinancialYear();
// console.log(finYear);

const registerHandler = async (req, res) => {
    try {
        const { aadharNo, fullName, fatherName, dob, gender, caste, mobNo, address, district, password } = req.body;

        const encryptedAadhar = encryptAadhar(aadharNo);
        // console.log("🚀 ~ registerHandler ~ encryptedAadhar:", encryptedAadhar)

        const existinguser = await User.findOne({ aadharNo: encryptedAadhar });
        if (existinguser) {
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

    const newUser = await User.create({
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

    console.log("New user Details Added:", newUser);

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
        
        // const users = await User.find({ maskedAadhar: aadharNo.slice(-4) }); //can't exclude pw as it's verification cb isn't working  & it will return array of entries having same masked aadharNo
        
        // if (users.length === 0) return res.json({ msg: "user not found. Please register..." });
        
        const encryptedAadhar = encryptAadhar(aadharNo);
        // console.log("🚀 ~ loginHandler ~ encryptedAadhar:", typeof(encryptedAadhar))
        
        
        let userFound = await User.findOne({ aadharNo: encryptedAadhar });
        console.log("🚀 ~ loginHandler ~ userFound:", userFound)
        
        
        if (!userFound) {
            return res.json({ msg: "user not found....Please register!!!" })
        }
        
        if(userFound.isLocked && userFound.lockUntil > Date.now()){
            return res.status(403).json({ msg: "Account is locked. Try again later."})
        }
        
        userFound.checkpw(password, async function (err, result) {
            if (err) return next(err)
                
                if (!result){
                    userFound.failedLoginAttempts += 1;
                    
                    if(userFound.failedLoginAttempts >= MAX_ATTEMPTS){
                        userFound.isLocked = true;
                        userFound.lockUntil = Date.now() + LOCK_TIME;
                    }
                    
                    await userFound.save();
                    return res.status(400).json({ msg: "Invalid Password" });
                } 
            
                userFound.failedLoginAttempts = 0;
                userFound.isLocked = false;
                userFound.lockUntil = null;
                await userFound.save();
                
            const purpose = 'Login';
            const sendOtpResponse = await sendOTP(userFound.mobNo, purpose);
            if (!sendOtpResponse.success) {
                return res.status(400).json({
                    msg: sendOtpResponse.msg
                })
            }

            req.session.tempuserId = userFound._id;
            req.session.tempRole = userFound.role;

            res.status(200).json({
                success: true,
                msg: "Otp sent to your mobile number.Please verify to complete login",
                statusCode: 200,
            });
            // console.log(user.financialYear.get(finYear));
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

        const userId = req.session.tempuserId;
        const role = req.session.tempRole;

        if (!userId) {
            return res.status(400).json({
                msg: 'Session expired. Please login again.'
            });
        }

        const userFound = await User.findById(userId);

        if (!userFound) {
            return res.status(400).json({
                msg: 'user not found. Please register...'
            });
        }

        if(userFound.role === userRole.student){
            try {
                if (!(userFound.financialYear.has(finYear)) || userFound.financialYear.get(finYear) === null) {
    
                    const appId = await generateAppId(finYear);
                    console.log(appId);
    
                    userFound.financialYear.set(finYear, appId);
    
                    const newApplication = await Application.create({
                        appId,
                        userId,
                    })
    
                    console.log("New Application", newApplication);
    
                    await userFound.save();
                }
            }
            catch (error) {
                console.log("Error in accessing & comparing the Academic Year", error);
    
                return res.status(500).json({ msg: "Something went wrong!" })
            }
            req.session.appId = userFound.financialYear.get(finYear);
        }

        req.session.userId = userFound._id
        req.session.role = role;
        req.session.caste = userFound.caste;
        console.log("Login Successful", req.session);

        delete req.session.tempuserId;
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