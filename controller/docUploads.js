const cloudinary = require('../uploads/cloudinary');
const Document = require('../models/document')
const upload = require('../utils/multerConfig');
const fs = require('fs');
const path = require('path');
const { categories, dirPath } = require("../constants/");


const docUploads = async (req, res) => {
    try {

        // console.log(req.files); //here files are array to access the file we have to write index [0]

        if (!req.files) return res.status(400).json({ msg: "No files uploaded" });

        const appId = req.session?.appId;
        const caste = req.session?.caste;

        if (caste !== categories.GEN && !req.files?.casteCertificate) {

            return res.status(400).json({ success: false, msg: "Caste Certificate is necessary for Non-General category students" });
        }

        if (caste === categories.GEN && req.files?.casteCertificate) {

            return res.status(400).json({ msg: "Caste Certificate is not required for General category students" });
        }

        //Extracting data
        const { idProof, birthCertificate, casteCertificate, domicileCertificate, incomeCertificate, passbookCertificate, prevMarksheet, bplCertificate, gapCertificate, instituteAckCertificate } = req.files


        //uploading to cloudinary
        const uploadToCloudinary = async (file) => {

            // console.log("ee", file)
            const filePath = path.join(__dirname, '..', 'temp', file[0].filename); //temp is out of this folder

            const result = await cloudinary.uploader.upload(filePath, {
                folder: 'nmdcBssyUploads'
            });

            if (result.secure_url) {
                fs.unlink(filePath, (error) => {
                    if (error) console.log("Error in deleting temp files...");
                    else console.log("Successfully deleted temp files...");
                });
            }
            return result.secure_url;
        }

        //storing the cloudinary url
        const uploads = {
            idProof: idProof ? await uploadToCloudinary(idProof) : null,
            birthCertificate: birthCertificate ? await uploadToCloudinary(birthCertificate) : null,
            casteCertificate: casteCertificate ? await uploadToCloudinary(casteCertificate) : null,
            domicileCertificate: domicileCertificate ? await uploadToCloudinary(domicileCertificate) : null,
            incomeCertificate: idProof ? await uploadToCloudinary(incomeCertificate) : null,
            passbookCertificate: passbookCertificate ? await uploadToCloudinary(passbookCertificate) : null,
            prevMarksheet: prevMarksheet ? await uploadToCloudinary(prevMarksheet) : null,
            bplCertificate: bplCertificate ? await uploadToCloudinary(bplCertificate) : null,
            gapCertificate: gapCertificate ? await uploadToCloudinary(gapCertificate) : null,
            instituteAckCertificate: instituteAckCertificate ? await uploadToCloudinary(instituteAckCertificate) : null,
        }


        const updocs = await Document.findOneAndUpdate(
            { appId: appId },

            {
                idProof: uploads.idProof,
                birthUrl: uploads.birthCertificate,
                casteUrl: uploads.casteCertificate,
                domicileUrl: uploads.domicileCertificate,
                incomeUrl: uploads.incomeCertificate,
                passbookUrl: uploads.passbookCertificate,
                prevMarksheetUrl: uploads.prevMarksheet,
                bplUrl: uploads.bplCertificate,
                gapUrl: uploads.gapCertificate,
                instituteAckUrl: uploads.instituteAckCertificate,
                appId: appId,
            },

            { new: true, upsert: true } //upsert: true for if appId already there then update details else creates one
        )

        console.log("Uploaded Docs", updocs);

        return res.status(200).json({
            success: true,
            msg: "Files uploaded successfully",
            statusCode: 200,
        });

    } catch (error) {
        console.log(error);

        return res.status(500).json({
            success: false,
            msg: "Error in uploading Files",
            statusCode: 500,
        })
    }

    finally {
        const cleaningDir = (dirPath) => {

            try {
                const files = fs.readdirSync(dirPath, (error) => {
                    if (error) console.log("Error in reading files", error);

                });

                for (const file of files) {
                    const filePath = `${dirPath}/${file}`;

                    fs.unlinkSync(filePath, (error) => {
                        if (error) console.log("Error!!! in deleting file", error);

                    })

                }
                console.log("All files have been deleted..");

            }
            catch (error) {
                console.log("Error in deleting files", error);

            }
        }


        cleaningDir(dirPath);
    }
}

module.exports = docUploads;