const { log } = require('console');

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

const MAX_ATTEMPTS = 5;
const LOCK_TIME = 15 * 60 * 1000;

const appStatus ={
    'draft': 'DRAFT',
    'submitted': 'SUBMITTED',
    'approved': 'APPROVED',
    'rejected': 'REJECTED',
}

const appAction = ["approve", "reject"];
// console.log("🚀 ~ appAction:", appAction)
// console.log("See this", appAction.includes('approve'));

const userRole = {
    'student' : 'STUDENT',
    'admin' : 'ADMIN',
    'finance' : 'FINANCE'
}

module.exports = {
    categories,
    dirPath,
    secretKey,
    cryptoIV,
    MAX_ATTEMPTS,
    LOCK_TIME,
    appStatus,
    appAction,
    userRole,
}