//used to protect the api routes from unauthorized access

require('dotenv/config');
const  {expressjwt}  = require('express-jwt'); //This module provides Express middleware for validating JWTs (JSON Web Tokens) through the jsonwebtoken module. The decoded JWT payload is available on the request object.


function authJwt() {

    const secret = process.env.secret; //secret key to sign the jwt token
   
    return expressjwt({ 
        secret, 
        algorithms: ['HS256'],
        isRevoked: isRevoked //function to revoke token
    }).unless({                        //unless is used to allow access to the specified path without jwt token
        path:['/api/v1/users/login',
        '/api/v1/users/register',
        {url: /\/api\/v1\/products(.*)/, methods: ['GET', 'OPTIONS']}, //allowing get request for products (we use regular expression)
        {url: /\/api\/v1\/categories(.*)/, methods: ['GET', 'OPTIONS']}
    ]
    });
};


//function to revoke token (revoke means to cancel or withdraw a token)
//req: request object , payload: decoded jwt token, done: callback function
async function isRevoked(req, token) {
    if (token.payload.isAdmin == false) {
      return true;
    }
    return false;
  }
module.exports = authJwt;

