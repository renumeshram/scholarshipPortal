const multer = require('multer');
const path = require('path');

//storage config

const storage = multer.diskStorage({
    destination: (req, file, callback)=>{
        callback(null, 'temp/');
    },
    filename: (req, file, callback) =>{

        const uniqueName = `${Date.now()}-${file.originalname}`;
        callback(null, uniqueName)
    }
})

const fileFilter = (req, file, callback) =>{
    const allowedTypes = /jpeg|jpg|png|pdf/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase())
    const mimetype = allowedTypes.test(file.mimetype);

    if(extname && mimetype){
        callback(null, true);
    }
    else{
        callback(new Error ('Only image and pdf files are allowed!'));
    }
}

const upload = multer({
    storage: storage,
    fileFilter: fileFilter, //to validate file type
    limits: { fileSize: 5 * 1024 * 1024 } //5MB size limit

});

module.exports = upload;