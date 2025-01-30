
// generateAppId
async function generateAppId(finYear = "202425") {
    // let finYear = getCurrentFinancialYear()
    // use nano id

    try{

        const {customAlphabet } = await import('nanoid');

        const nanoid =  customAlphabet('ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789', 6);
        
        const uniqueId = nanoid();
        console.log("🚀 ~ generateAppId ~ uniqueId:", uniqueId)

        const appId = finYear + uniqueId;
        // console.log(appId);
        return appId
    }
    catch(error){
        console.log("Error in generating appId:", error);
    }
}

generateAppId()

module.exports= generateAppId;

