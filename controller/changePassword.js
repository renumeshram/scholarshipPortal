const User = require('../models/user');
const bcrypt = require('bcrypt');

const changePw = async (req, res)=>{
    try{

        const { currentPw, newPw } = req.body;
    
        const userId = req.session?.userId;
    
        const studFound = await User.findById(userId);
    
        if(!studFound){
            return res.status(400).json({
                msg: 'User not found'
            })
        }
    
        isMatch = await bcrypt.compare(currentPw,studFound.password);
        console.log("🚀 ~ changePw ~ isMatch:", isMatch)
    
        if(!isMatch){
            return res.status(400).json({
                msg: 'Wrong current password.'
            })
        }
    
        studFound.password = newPw;
        await studFound.save();
    
        req.session.destroy((err)=>{
            if(err){
                console.log("🚀 ~ req.session.destroy ~ err:", err)
                return res.status(400).json({
                    msg: 'Password changed successfully but error in invalidating session.'
                })    
            }
            res.clearCookie("connect.sid");
            return res.status(200).json({
                success: true,
                msg: 'Password changed successfully. Please login...'
            })
        })    
    }catch(error){
        console.log("🚀 ~ changePw ~ error:", error)
        return res.status(500).json({
            success: false,
            msg: 'Internal server error',
            statusCode: 500,
        })
    }

}

module.exports = changePw;