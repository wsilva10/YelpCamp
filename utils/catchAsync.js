//Catches errors from async functions
module.exports = func => {          //Takes in function
    return (req, res, next) => {
        func(req, res, next).catch(next);     //Returns function with catch wrapped on it
    }
}