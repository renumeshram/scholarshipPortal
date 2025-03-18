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

// const fileFilter = (req, file, callback) => {
//     const allowedImages = /jpeg|jpg|png/;
//     const allowedPDF = /pdf/;
//     const extname = path.extname(file.originalname).toLowerCase();
//     const mimetype = file.mimetype;

//     if(allowedImages.test(extname) && allowedImages.test(mimetype)){
//         if(file.size > 1* 1024* 1024){
//             return callback(new Error('Image size should not exceed 2MB!'), false);
//         }
//         return callback(null, true);
//     }

//     if(allowedPDF.test(extname) && allowedPDF.test(mimetype)){
//         if(file.size > 2* 1024* 1024){
//             return callback(new Error('PDF size should not exceed 5MB!'), false);
//         }
//         return callback(null, true);
//     }
//     return callback(new Error('Only JPEG, JPG, PNG and PDF files are allowed!'), false);
// }

const upload = multer({
    storage: storage,
    fileFilter: fileFilter, //to validate file type
    limits: { fileSize: 5 * 1024 * 1024 } //5MB size limit

});

// const upload = multer ({
//     storage: storage,
//     fileFilter: (req, file, callback) =>{
//         fileFilter(req, file, (err, isValid)=>{
//             if(err){
//                 return callback(err);
//             }
//             callback(null, isValid);
//         });
//     },
//     limits: {fileSize: 5* 1024 * 1024}
// });

module.exports = upload;