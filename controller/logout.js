const logoutHandler = (req, res) =>{
    if(!req.session.studId){
        return res.status(400).json({ msg: "No active session found."});
    }

    req.session.destroy((err)=>{
        if(err){
            console.log("🚀 ~ req.session.destroy ~ err:", err)
            return res.status(500).json({ msg: "Logout failed. Please try again."})
        }
        res.clearCookie("connect.sid"); //Remove session cookie

        return res.status(200).json({ success: true, msg: "Successfully logged out."})
    });
};

module.exports = logoutHandler;