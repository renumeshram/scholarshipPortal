const multer = require('../config/multerConfig');

const uploadMiddleware = multer.fields([

    {name: 'idProof', maxCount: 1},
    {name: 'birthCertificate', maxCount: 1},
    {name: 'casteCertificate', maxCount: 1},
    {name: 'domicileCertificate', maxCount: 1},
    {name: 'incomeCertificate', maxCount: 1},
    {name: 'passbookCertificate', maxCount: 1},
    {name: 'prevMarksheet', maxCount: 1},
    {name: 'bplCertificate', maxCount: 1},
    {name: 'gapCertificate', maxCount: 1},
    {name: 'instituteAckCertificate', maxCount: 1},

]);

module.exports = uploadMiddleware;