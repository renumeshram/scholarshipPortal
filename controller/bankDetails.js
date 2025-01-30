const Bank = require('../models/bank');

const bankDetailsHandler = async (req, res) => {
    try {

        const { accountNo, ifscCode, bankName, bankBranch } = req.body;

        const appId = req.session?.appId;
        // console.log("Application Id:", appId);

        const bankDetails = await Bank.findOneAndUpdate(
            { appId },

            {
                accountNo,
                ifscCode,
                bankName,
                bankBranch,
                appId
            },

            { new: true, upsert: true }
        )

        console.log("Bank details added: ", bankDetails);

        return res.status(200).json({
            success: true,
            msg: "Bank details added Successfully",
            statusCode: 200
        })

    } catch (error) {
        if (error.code === 11000) {
            console.log(error);

            return res.json({
                success: false,
                msg: "Duplicate Entry!! Please enter valid details...",
                errorCode: 11000
            });

        }
        console.log("Error in bankDetailsHandler", error);

        return res.status(500).json({
            success: false,
            msg: "Internal Server Error",
            statusCode: 500
        })
    }

}

module.exports = bankDetailsHandler;