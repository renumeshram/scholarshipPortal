const isLoggedIn =(req, res, next)=>{
    try {
        // console.log(req.session);
        
        if (!req.session?.role) return res.json({ msg: "You must login first" })
        else {
            console.log('Login_role:',req.session.role);
            next()
        }
    }
    catch (error) {
        console.log(error);
        
        return res.json(error)
    }
}

module.exports = isLoggedIn;