const Education = require('../models/education')



const academicDetailsHandler = async (req, res) => {
    
    try {
        const { academicYear, enrollNo, eduLevel, currentClass, schoolId} = req.body;

        // const studentId = req.session?.studId;
        // console.log(studentId);

        const appId = req.session?.appId;
        console.log( "Application Id:", appId )

        // TODO : Generate application id at utils
        
        const existingEducation = await Education.findOne({appId});

        if(existingEducation) return res.status(400).json({ msg: "Academics details already added. Proceed to next step"})

        const educationDetail = await Education.create({
            academicYear,
            enrollNo,
            eduLevel,
            currentClass,            
            schoolId,
            appId,
        });

        console.log("Education details Added",educationDetail);

        
        return res.status(200).json({msg: "Academics details and application added Successfully"})

        
    }
    catch (error) {
        if (error.code == 11000){
            console.log(error);
            
            return res.json({ msg: "Duplicate Entry!! Already added academics details. Please proceed to next step..."});

        } 
        console.log("Error in academicDetailsHandler", error);
        
        return res.status(500).json({ msg: "Internal Server Error"})
    }

    
}

module.exports = academicDetailsHandler;
