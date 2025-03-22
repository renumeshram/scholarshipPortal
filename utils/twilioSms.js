require('dotenv').config();
const twilio = require('twilio');
const { TWILIO_ACC_SID, TWILIO_AUTH_TOKEN, TWILIO_NUMBER } = process.env;
// console.log("🚀 ~ TWILIO_AUTH_TOKEN:", TWILIO_AUTH_TOKEN)
// console.log("🚀 ~ TWILIO_ACC_SID:", TWILIO_ACC_SID)

// Initialize Twilio client
const client = twilio(TWILIO_ACC_SID, TWILIO_AUTH_TOKEN);

let otpStorage = {}; // Temp storage for OTPs
// let attempt = 0;

const sendOTP = async (mobNo, purpose) => {
    console.log("🚀 ~ sendOTP ~ purpose:", purpose)
    const otp = Math.floor(100000 + Math.random() * 900000); // Generate a 6-digit OTP
    const otpExpiry = Date.now() + 10 * 60 * 1000; // Expiration time 10 mins from now

   if(!otpStorage[mobNo]){
    otpStorage[mobNo] = {attempt: 0}
   }
   otpStorage[mobNo].attempt++; //Increment the count
   
   if(otpStorage[mobNo].attempt > 3){
    console.log("🚀 ~ sendOTP ~ attempt: exceeded", otpStorage[mobNo].attempt);
    setTimeout(() =>{
        otpStorage[mobNo].attempt =0; //Reset attempt count after 10 minutes 
    }, 10*60*1000)
    return { msg: 'Too many requests for OTP. Please try again later.'}; 
   }
    
    otpStorage[mobNo] = { otp, expiry: otpExpiry , attempt: otpStorage[mobNo].attempt}; // Store OTP and its expiration time
    console.log("🚀 ~ sendOTP ~ otpStorage:", otpStorage)
    
    // Send the OTP via SMS using Twilio's messaging service
    try {
        //THIS IS COMMENTED FOR THE TESTING PURPOSE
        // await client.messages.create({
        //     body: `Your OTP for BSSY ${purpose} is: ${otp}`, // Send your generated OTP
        //     from: TWILIO_NUMBER, // Replace with your Twilio phone number
        //     to: `+91`+mobNo
        // });
        
        return { success: true, msg: 'OTP sent successfully.' };
    } catch (error) {
        console.log("🚀 ~ sendOTP ~ error:", error);
        return { success: false, msg: 'Error in sending OTP' };
    }
};
//    console.log("🚀 ~ sendOTP ~ attempt:", attempt)

const verifyOTP = async (mobNo, code) => {
    console.log("🚀 ~ verifyOTP ~ code:", code)
    console.log("🚀 ~ verifyOTP ~ mobNo:", mobNo)
    
    console.log("🚀 ~ otpStorage:", otpStorage)
    
    const storedData = otpStorage[mobNo];
    console.log("🚀 ~ verifyOTP ~ storedData:", storedData)

    if (!storedData) {
        return {
            success: false,
            msg: "No OTP sent to this mobile number. Please request a new OTP."
        };
    }

    const { otp, expiry } = storedData;
    console.log("🚀 ~ verifyOTP ~ otp:", otp)
    

    if (Date.now() > expiry) {
        delete otpStorage[mobNo]; // Clear expired OTP
        return {
            success: false,
            msg: "OTP has expired. Please request a new OTP."
        };
    }

    if (otp !== code) {
        return {
            success: false,
            msg: "Invalid OTP. Please try again."
        };
    }

   
    delete otpStorage[mobNo]; // Clear OTP after successful verification
    return {
        success: true,
        msg: 'Mobile number verified successfully'
    };
};

module.exports = { sendOTP, verifyOTP };