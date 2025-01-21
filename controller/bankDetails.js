const Bank =  require('../models/bank');

const bankDetailsHandler = async(req , res) =>{
    try{

        const {accountNo , ifscCode, bankName, bankBranch } = req.body;

        const appId = req.session?.appId;
        console.log("Application Id:", appId);

        const existingBankDetails = await Bank.findOne({appId});

        if(existingBankDetails) {
            return res.json({ msg: "Bank details are already added. Proceed to next step "})
        }

        const bankDetails = await Bank.create({
            accountNo,
            ifscCode,
            bankName,
            bankBranch,
            appId
        }) 
        
        console.log("Bank details added: ", bankDetails);

        return res.status(200).json({
            success: true,
            msg: "Bank details added Successfully",
            statusCode: 200
        })       

    }catch(error){
        if (error.code === 11000){
            console.log(error);
            
            return res.json({ msg: "Duplicate Entry!! Please enter valid details..."});

        } 
        console.log("Error in bankDetailsHandler", error);
        
        return res.status(500).json({ msg: "Internal Server Error"})
    }

}

module.exports = bankDetailsHandler;