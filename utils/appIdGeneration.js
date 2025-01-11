// const date = new Date();

// const month = date.getMonth();

// const year = date.getFullYear();

// let finYear;

// console.log(date, month, year);

const appIdGeneration = (studId) => {
    const date = new Date();

    const month = date.getMonth();

    const year = date.getFullYear();

    let finYear;
    if (month >= 3 && month <= 11) {
        finYear = `${year - 2000}${(year + 1) - 2000}`;

    }
    else {
        finYear = `${(year - 1) - 2000}${year - 2000}`;
    }

    const appId = finYear + studId;
    console.log(appId);


    return appId
}

// console.log(studIdGeneration(Math.floor(Date.now()/1000)));

module.exports = appIdGeneration;
