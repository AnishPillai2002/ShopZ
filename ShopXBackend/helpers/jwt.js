//used to protect the api routes from unauthorized access

require('dotenv/config');
const  {expressjwt}  = require('express-jwt'); //This module provides Express middleware for validating JWTs (JSON Web Tokens) through the jsonwebtoken module. The decoded JWT payload is available on the request object.

function authJwt() {

    const secret = process.env.secret; //secret key to sign the jwt token

    return expressjwt({ 
        secret, 
        algorithms: ['HS256'] }
    );
};

module.exports = authJwt;

