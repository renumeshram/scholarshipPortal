
const Application = require('../models/application');
const { appAction, appStatus } = require('../constants/index')
// console.log("🚀 ~ appAction:", appAction, typeof(appAction))

const getApplications = async (req, res) => {
    try {
        const applications = await Application.find({ status: "SUBMITTED" });
        if (applications.length === 0) {
            return res.json({
                msg: "Currently there is no applications submitted."
            })
        }
        return res.json(applications)
    }
    catch (error) {
        console.log("🚀 ~ getApplications ~ error:", error)
        res.status(500).json({
            msg: "Error in fetching applications."
        })
    }
}

const applicationAction = async (req, res) => {
    const { id: appId } = req.params;
    const { action } = req.body;

    if (!appAction.includes(action)) {
        return res.json({
            msg: "Invaild action. Use 'approve' or 'reject'.",
        })
    }

    try {
        const application = await Application.findOne({ appId });

        if (!application) {
            return res.status(404).json({
                msg: "Application not found."
            })
        }

        if(application.status === appStatus.approved){
            return res.json({
                msg: 'Application has already been approved.'
            })
        }

        application.status = action === appAction[0] ? appStatus.approved : appStatus.rejected;
        application.reviewedBy = req.session.userId || null;

        await application.save();

        res.json({
            msg: `Application ${application.status} successfully.`,
            application,
        })
    }
    catch (error) {
        console.log("🚀 ~ applicationAction ~ error:", error)
        return res.status(500).json({
            msg: "Error in updating the application status."
        })
    }

}

module.exports = {
    getApplications,
    applicationAction
}