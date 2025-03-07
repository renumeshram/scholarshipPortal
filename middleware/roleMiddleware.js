const isAuthorized = (roles) => {
    return (req, res, next) =>{
        if(!req.session || !req.session.role){
            return res.status(403).json({ msg: "Unauthorized access. Please log in."});
        }

        if(!roles.includes(req.session.role)){
            return res.status(403).json({ msg: "Forbidden: You don't have permission to access this resource."});
        }
        next();
    };
};

module.exports = isAuthorized;