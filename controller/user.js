const Student = require('../models/student')
const Application = require('../models/application')

const appIdGeneration = require('../utils/appIdGeneration')

const registerStudent = async (req, res )=>{

    try{
        const { aadharNo, fullName, fatherName, dob, gender, caste, mobNo, address, district, password, cpassword} = req.body;

        const studId = Math.floor(Date.now()/1000);

        const newUser = await Student.create({
            studId,
            aadharNo,
            fullName,
            fatherName,
            dob, 
            gender,
            caste,
            mobNo,
            district,
            address,
            password
        })

        console.log("New Student Details Added:", newUser);
        

        const appId = appIdGeneration(studId);

        const application = await Application.create({
            appId,
            studId,
        })

        console.log("Application Added...", application);


        res.status(200).json({msg: "Registration Succesful"});

    }catch(error){
        if(error.code === 11000) return res.json("User already registered. Please Login...");
        
        console.log(error);
        
        res.status(500).json("Internal Server Error")
    }
}

const loginHandler = async(req, res)=>{
    try{
        const { aadharNo, password } = req.body;

        const student = await Student.findOne({ aadharNo });

        if(!student) return res.json({ msg: "Student not found. Please register..."});

        else{
            student.checkpw(password, async function(err, result){
                if(err) return next(err)
                   
                if(!result) return res.status(400).json({msg: "Invalid Password"});
                
                const studId = student.studId;

                req.session.studId = studId;
                const application = await Application.findOne({studId});

                console.log("Application Details: ", application);
                

                req.session.appId = application.appId;
                req.session.caste = student.caste;
                console.log("Login Successful", req.session);

                return res.status(200).json({ msg: "Successfully LoggedIn"})
                
            })
        }
    }catch(error) {
        console.log(error);

        res.json({ msg: "Error in Logging In"})
        
    }
}

module.exports = { registerStudent, loginHandler}