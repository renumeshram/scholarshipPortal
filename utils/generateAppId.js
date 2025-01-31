
// generateAppId
async function generateAppId(finYear) {
    // use nano id
    try{

        const {customAlphabet } = await import('nanoid');

        const nanoid =  customAlphabet('ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789', 6);
        
        const uniqueId = nanoid();
        // console.log("🚀 ~ generateAppId ~ uniqueId:", uniqueId)

        const appId = finYear + uniqueId;
        // console.log("🚀 ~ generateAppId ~ appId:", appId)
        return appId
    }
    catch(error){
        console.log("Error in generating appId:", error);
    }
}

// generateAppId()

module.exports= generateAppId;

