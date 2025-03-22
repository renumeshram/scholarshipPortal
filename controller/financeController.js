const Application = require('../models/application');
const Payment = require('../models/payment')
const Education = require('../models/education')
const { paymentStatusEnum, paymentAction, paymentAmount } = require('../constants/');

const getApprovedApplications = async (req, res) => {
    try {
        const applications = await Application.find({ status: 'APPROVED' });

        if (applications.length === 0) {
            return res.json({
                msg: "Currently there is no approved applications"
            })
        }
        return res.json(applications)
    }
    catch (error) {
        console.log("🚀 ~ getApprovedApplications ~ error:", error)
        return res.status(500).json({
            msg: "Error in fetching approved applications."
        })
    }
}

const paymentStatusUpdate = async (req, res) => {
    const { id: appId } = req.params;
    const { action, transactionId } = req.body;

    if (!paymentAction.includes(action)) {
        return res.json({
            msg: "Invalid action. Use 'processed  or 'failed'."
        })
    }
    let status = action === paymentAction[0] ? paymentStatusEnum.processed : paymentStatusEnum.failed;
    let processedBy = req.session.userId || null;

    try {
        let amount;
        const payment = await Payment.findOne({ appId });
        if(payment.status === paymentStatusEnum.processed){
            return res.json({ msg: "Payment has already processed for this application."});
        }

        const education = await Education.findOne({ appId });
        if (!education) {
            return res.status(404).json({ msg: "Education record not found" });
        }
        // console.log("🚀 ~ paymentStatusUpdate ~ education:", education)
        const educationLevel = education.eduLevel;
        // console.log("🚀 ~ paymentStatusUpdate ~ educationLevel:", educationLevel)

        // console.log(paymentAmount.hasOwnProperty(educationLevel));
        if (paymentAmount.hasOwnProperty(educationLevel)) {

            amount = paymentAmount[educationLevel];
            console.log("🚀 ~ paymentStatusUpdate ~ amount:", amount)
        }

        if (!amount) {
            console.log("amount is Present");

            return res.status(400).json({ msg: "Invalid education level for payment." });
        }

        const paymentDetails = await Payment.findOneAndUpdate(
            { appId },

            {
                amount,
                transactionId,
                status,
                processedBy,
                processedAt: Date.now(),
            },

            { new: true, upsert: true }


        )
        console.log("Payment details added: ", paymentDetails);

        return res.status(201).json({
            msg: "Payment details successfully added.",
            stausCode : 201,
        })
    }
    catch (error) {
        console.log("🚀 ~ paymentStatusUpdate ~ error:", error)
        return res.status(500).json({
            msg: "Error in updating payment details."
        })
    }
}

module.exports = {
    getApprovedApplications,
    paymentStatusUpdate,
}