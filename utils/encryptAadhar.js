require('dotenv').config()
const crypto = require('crypto')
const {secretKey, cryptoIV} = require('../constants/index');

function encryptAadhar(aadharNo){
    // console.log("🚀 ~ encryptAadhar ~type of aadharNo:", typeof(aadharNo))
    
    const cipher = crypto.createCipheriv('aes-256-cbc',Buffer.from(secretKey, 'utf8'),Buffer.from(cryptoIV));
    let encrypted = cipher.update(aadharNo, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    return encrypted;
}

module.exports = encryptAadhar;