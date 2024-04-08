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

//GET request for getting all User
router.get(`/`, async(req, res) => {

    //find() is a promise so we use then and catch/ or we can also use async await
    const userList=await User.find().select('-passwordHash');//select is used to exclude passwordHash from response
    //if productList is empty
    if(!userList){
        res.status(500).json({  //500 is status code for internal server error
            success:false
        });
    }
    res.send(userList); //sending categoryList as response
});

//GET request for a single user by id
//get request for category by id
router.get('/:id',(req,res)=>{
    //fetching category by id from database
     User.findById(req.params.id).select('-passwordHash').then((data)=>{
        if(data){
            return res.status(200).json(data); //200 is status code for ok
        }else{
            return res.status(404).json({success:false,message:'User not found'}); //404 is status code for not found
        }
    }).catch((err)=>{
        return res.status(400).json({success:false,error:err}); //400 is status code for bad request
    }); //finding category by id
});

module.exports = router; //exporting the router