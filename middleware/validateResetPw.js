const validateResetPw = (req, res, next) =>{
    const passwordRegex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@#$%!?*&])[a-zA-Z\d@#$%!?*&]{8,}$/

    if (!req.session.verified || !req.session.mobNo) {
        req.session.destroy();
        return res.status(400).json({ success: false, msg: 'OTP verification required before resetting password' });
    }

    const { newPassword } = req.body;

    if (!newPassword || !passwordRegex.test(newPassword)) {
        return res.status(400).json("Password must be of minimum 8 charcter and contain digits, lowercase, uppercase and special characters");
    }

    next();
}

module.exports = validateResetPw;
