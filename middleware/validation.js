//Validation goes here....
//1. Aadhar(maxlength =12) 2. mobNo(maxLength = 10) 3.p/w(min. character, upper-lowercase-digits-characters)  4. dob(dd/mm/yyyy)
// check empty field /\S/


const validateRegistration = (req, res, next) => {
    // const { aadharNo, mobNo, password } = req.body;

    const { aadharNo, fullName, fatherName, dob, gender, caste, mobNo, address, district, password, cpassword } = req.body;

    const aadharNoRegex = /^\d{12}$/;
    const mobNoRegex = /^[1-9]\d{9}$/;
    const passwordRegex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@#$%!?*&])[a-zA-Z\d@#$%!?*&]{8,}$/
    const dobRegex = /^(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[0,1,2])\/(19|20)\d{2}$/

    if ([aadharNo, fullName, fatherName, dob, gender, caste, mobNo, address, district, password, cpassword].some((field) => field?.trim() === "")) {
        return res.status(400).json("All fields are required...")
    }


    if (password !== cpassword) {
        return res.status(400).json("Password and confirm password should match...")
    }

    if (!aadharNoRegex.test(aadharNo)) return res.status(400).json("Aadhar number must be all numbers of length 12");

    if (!mobNoRegex.test(mobNo)) return res.status(400).json("Mobile number must be of length 10 & it should start from 6-9");

    if (!passwordRegex.test(password)) return res.status(400).json("Password must be of minimum 8 charcter and contain digits, lowercase, uppercase and special characters");

    if(!dobRegex.test(dob)) return res.status(400).json("Invalid date format")

    next()
}

module.exports = validateRegistration ;