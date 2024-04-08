//Function to handle Error
function errorHandler(err, req, res, next) {

    if(err.name === 'UnauthorizedError') {
        //jwt authentication error
        //error message is returned when the user is not authorized with a jwt token
        return res.status(401).json({message:"The user is not authorized"});
    }

    if(err.name === 'ValidationError') {
        //validation error
        //error message is returned when the user enters invalid data
        return res.status(401).json({message:err});
    }

    //default error message
    return res.status(500).json({message:err.message});
}

module.exports = errorHandler; //exporting the errorHandler function
