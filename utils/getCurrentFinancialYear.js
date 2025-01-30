const getCurrentFinancialYear = () => {
    const date = new Date();

    const month = date.getMonth();

    const year = date.getFullYear();

    let finYear;
    
    if (month >= 3 && month <= 11) {
        finYear = `${year}${(year + 1).toString().slice(-2)}`;

    }
    else {
        finYear = `${(year - 1)}${(year).toString().slice(-2)}`;
    }

    return finYear
}

module.exports = getCurrentFinancialYear