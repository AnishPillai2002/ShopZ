//api for user authentication

const express = require('express');
const router = express.Router();
const User = require('../models/user');
var bcrypt = require('bcryptjs'); //used to hash password for security purpose

//POST request for user registration
router.post(`/`, (req, res) => {


    let user=new User({
        name:req.body.name,
        email:req.body.email,
        passwordHash:bcrypt.hashSync(req.body.password,10),
        phone:req.body.phone,
        isAdmin:req.body.isAdmin,
        street:req.body.street,
        apartment:req.body.apartment,
        zip:req.body.zip,
        city:req.body.city,
        country:req.body.country
    });

    //saving user to database
    user.save().then((createdUser)=>{
        res.status(201).json(createdUser); //201 is status code for created
    }).catch((err)=>{
        res.status(500).send('User Cannot be Created');//500 is status code for internal server error
    });
});

module.exports = router; //exporting the router