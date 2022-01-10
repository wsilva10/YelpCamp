//Error handler 
class ExpressError extends Error {
    constructor(message, statusCode) {      //When error in inputted a message and status code is passed
        super();                            //Accessing all functions from Error     
        this.message = message;             // refers to message passed
        this.statusCode = statusCode;       // refers to status code passed 
    }
}

module.exports = ExpressError;  //Exports class