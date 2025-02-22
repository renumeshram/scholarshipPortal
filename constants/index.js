require('dotenv').config

// category constants
const categories = {
    'GEN': 'GEN',
    'OBC': 'OBC'
}

const dirPath = "../nmdcBSSY/temp";

const secretKey = process.env.SECRET_KEY;
console.log("🚀 ~ secretKey:", secretKey.length)
const cryptoIV = process.env.IV;
console.log("🚀 ~ cryptoIV:", cryptoIV.length)

module.exports = {
    categories,
    dirPath,
    secretKey,
    cryptoIV,
}