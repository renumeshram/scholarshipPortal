const Student = require('../models/student')
const Application = require('../models/application')
const bcrypt = require('bcrypt')

const generateAppId = require('../utils/generateAppId');
const getCurrentFinancialYear  = require('../utils/getCurrentFinancialYear');

const finYear = getCurrentFinancialYear();
// console.log(finYear);


const registerHandler = async (req, res) => {

    try {
        const { aadharNo, fullName, fatherName, dob, gender, caste, mobNo, address, district, password } = req.body;

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
            maskedAadhar: aadharNo.slice(-4),
            financialYear: {
                [finYear]: null,
            }
        }) 

        console.log("New Student Details Added:", newUser);


        res.status(201).json({
            success: true,
            msg: "Registration Successful",
            statusCode: 201,
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

        const students = await Student.find({ maskedAadhar: aadharNo.slice(-4) }); //can't exclude pw as it's verification cb isn't working  & it will return array of entries having same masked aadharNo

        if (students.length === 0) return res.json({ msg: "Student not found. Please register..." });

        let studentFound = null;

       for(let student of students){
        const isMatch = await bcrypt.compare(aadharNo, student.aadharNo);
        if(isMatch){
            studentFound = student;
            break;
        }
       }

        if(!studentFound){
            return res.json({msg: "Student not found....Please register!!!"})
        }
        
            studentFound.checkpw(password, async function (err, result) {
                if (err) return next(err)

                if (!result) return res.status(400).json({ msg: "Invalid Password" });

                const studId = studentFound._id;

                req.session.studId = studId;

                // console.log(student.financialYear.get(finYear));

                try {

                    if (!(studentFound.financialYear.has(finYear)) || studentFound.financialYear.get(finYear) === null) {

                        const appId = await generateAppId(finYear);
                        console.log(appId);

                        studentFound.financialYear.set(finYear, appId);

                        const newApplication = await Application.create({
                            appId,
                            studId,    
                        })

                        console.log("New Application", newApplication);

                        await studentFound.save();

                    }
                }
                catch (error) {
                    console.log("Error in accessing & comparing the Academic Year", error);

                    return res.status(500).json({ msg: "Something went wrong!" })
                }

                req.session.appId = studentFound.financialYear.get(finYear);
                req.session.caste = studentFound.caste;
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