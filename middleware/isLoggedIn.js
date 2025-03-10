const isLoggedIn =(req, res, next)=>{
    try {
        // console.log(req.session);
        
        if (!req.session?.studId) return res.json({ msg: "You must login first" })
        else {
            console.log('Login: true',req.session.studId);
            next()
        }
    }
    catch (error) {
        console.log(error);
        
        return res.json(error)
    }
}

module.exports = isLoggedIn;