const Education = require('../models/education')



const academicDetailsHandler = async (req, res) => {

    try {
        const { enrollNo, eduLevel, currentClass, schoolId } = req.body;


        const appId = req.session?.appId;
        console.log("Application Id:", appId);

        const educationDetail = await Education.findOneAndUpdate(
            { appId },
            {
                enrollNo,
                eduLevel,
                currentClass,
                schoolId,
                appId,
            },
            { new: true, upsert: true }
        );

        console.log("Education details Added", educationDetail);


        return res.status(200).json({
            success: true,
            msg: "Academics details added Successfully",
            stausCode: 200
        })


    }
    catch (error) {
        if (error.code == 11000) {
            console.log(error);

            return res.json({
                msg: "Duplicate Entry!! Already added academics details. Please proceed to next step...",
                errorCode: 11000,
            });

        }
        console.log("Error in academicDetailsHandler", error);

        return res.status(500).json({
            success: false,
            msg: "Internal Server Error",
            statusCode: 500,
        })
    }


}

module.exports = academicDetailsHandler;
