const User = require('../models/user');
const encryptAadhar = require('../utils/encryptAadhar');
const { sendOTP, verifyOTP } = require('../utils/twilioSms');

const forgotPw = async (req, res) => {
    try {
        const { aadharNo } = req.body;
        const encryptedAadhar = encryptAadhar(aadharNo)
        studFound = await User.findOne({ aadharNo: encryptedAadhar })
        console.log("🚀 ~ forgotPw ~ studFound:", studFound)

        if (!studFound) {
            return res.status(400).json({
                success: false,
                msg: 'User not found. Please register first',
                statusCode: 400
            })
        }

        const purpose = "Forgot Password"
        console.log("🚀 ~ forgotPw ~ studFound.mobNo:", studFound.mobNo)
        const sendOtpResponse = await sendOTP(studFound.mobNo, purpose);

        if (!sendOtpResponse.success) {
            return res.status(400).json({
                msg: sendOtpResponse.msg
            })
        }

        req.session.mobNo = studFound.mobNo;
        req.session.userId = studFound._id;

        // setTimeout(() => {
        //     req.session.mobNo = null;
        //     req.session.userId = null;
        //     req.session.verified = false;
        // }, 15 * 60 * 1000);

        res.status(200).json({
            success: true,
            msg: "Otp sent to your mobile number.Please verify to proceed",
            statusCode: 200,
        })
    } catch (error) {
        console.log("🚀 ~ forgotPw ~ error:", error)
        return res.status(500).json({
            success: false,
            msg: 'Internal server error.',
            statusCode: 500
        })
    }
}

const verifyOTPForPw = async (req, res) => {
    try {
        const { mobNo, code } = req.body;

        if (!mobNo || !code) {
            return res.statusCode(400).json({
                msg: 'All fields are required'
            })
        }
        codeInt = parseInt(code);
        console.log("🚀 ~ verifyOTPHandler ~ codeInt:", codeInt)

        const otpResponse = await verifyOTP(mobNo, codeInt);

        if (!otpResponse.success) {
            req.session.destroy((err) => {
                if (err) {
                    console.log("🚀 ~ req.session.destroy ~ err:", err)
                }
                return res.status(400).json({
                    success: false,
                    msg: otpResponse.msg
                });
            });

        }

        req.session.verified = true;

        res.json({
            success: true,
            msg: 'Otp verified. Proceed to reset your password'
        })
    } catch (error) {
        console.log("🚀 ~ verifyOTPForPw ~ error:", error)
        return res.status(500).json({
            success: false,
            msg: 'Internal server error',
            statusCode: 400,
        })
    }

}

const resetPw = async (req, res) => {
    try {
        const { newPassword } = req.body;

        const user = await User.findById(req.session.userId);

        if (!user) {
            return res.status(400).json({ success: false, msg: 'User not found' });
        }

        user.password = newPassword;
        await user.save();

        //clear session after successful reset
        req.session.destroy((err) => {
            if (err) {
                console.log("🚀 ~ req.session.destroy ~ err:", err)
                return res.status(500).json({
                    success: true,
                    msg: 'Password reset successful but Internal server error in destroying session',
                    statusCode: 500,
                })
            }
            return res.status(200).json({
                success: true,
                msg: 'Password reset successful. You can now log in with your new password.',
                statusCode: 200,
            });
        })
    } catch (error) {
        console.error("🚀 ~ resetPw ~ error:", error);
        return res.status(500).json({
            success: false,
            msg: 'Internal server error'
        });
    }
}

module.exports = { forgotPw, verifyOTPForPw, resetPw }