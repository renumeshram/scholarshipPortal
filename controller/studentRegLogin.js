const Student = require('../models/student')
const Application = require('../models/application')

const generateAppId = require('../utils/generateAppId');
const getCurrentFinancialYear  = require('../utils/getCurrentFinancialYear');

const finYear = getCurrentFinancialYear();
// console.log(finYear);


const registerHandler = async (req, res) => {

    try {
        const { aadharNo, fullName, fatherName, dob, gender, caste, mobNo, address, district, password } = req.body;

        // const studId = Math.floor(Date.now() / 1000);

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
            financialYear: {
                [finYear]: null,
            }
        }) 

        console.log("New Student Details Added:", newUser);


        res.status(200).json({
            success: true,
            msg: "Registration Successful",
            statusCode: 200,
        });

    } catch (error) {
        console.log(error);
        
        if (error.code === 11000) return res.json({ msg: "User already registered. Please Login..." });

        console.log(error);

        res.status(500).json({
            success: false,
            msg: "Internal Server Error",
            statusCode: 500,
        })
    }
}

const loginHandler = async (req, res) => {
    try {
        const { aadharNo, password } = req.body;

        const student = await Student.findOne({ aadharNo }); //can't exclude pw as it's verification cb isn't working

        if (!student) return res.json({ msg: "Student not found. Please register..." });

        
            student.checkpw(password, async function (err, result) {
                if (err) return next(err)

                if (!result) return res.status(400).json({ msg: "Invalid Password" });

                const studId = student._id;

                req.session.studId = studId;

                // console.log(student.financialYear.get(finYear));

                try {

                    if (!(student.financialYear.has(finYear)) || student.financialYear.get(finYear) === null) {

                        const appId = await generateAppId(finYear);
                        console.log(appId);

                        student.financialYear.set(finYear, appId);

                        const newApplication = await Application.create({
                            appId,
                            studId,    
                        })

                        console.log("New Application", newApplication);

                        await student.save();

                    }
                }
                catch (error) {
                    console.log("Error in accessing & comparing the Academic Year", error);

                    return res.status(500).json({ msg: "Something went wrong!" })
                }

                req.session.appId = student.financialYear.get(finYear);
                req.session.caste = student.caste;
                console.log("Login Successful", req.session);

                return res.status(200).json({ 
                    success: true,
                    msg: "Successfully LoggedIn",
                    statusCode: 200,
                })

            })
        
    } catch (error) {
        console.log(error);

        res.json({ msg: "Error in Logging In" })

    }
}

module.exports = { registerHandler, loginHandler }