
const validateBankDetails = async (req, res, next) =>{

    const {accountNo , ifscCode, bankName, bankBranch } = req.body;

    if([accountNo , ifscCode, bankName, bankBranch].some((field) => field?.trim() === "")){

        return res.status(400).json({
            success: false,
            msg: "All fields are required...",
            statusCode: 400,
        })
    }

    next()
}

module.exports = validateBankDetails;