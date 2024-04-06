const express = require('express'); //express is a web framework for nodejs
const router = express.Router(); //router is used to create routes
const Category=require('../models/category'); //importing category model

//routes
//get request for category
router.get(`/`, async(req, res) => {
    //fetching all category from database
    //find() is a promise so we use then and catch/ or we can also use async await
    const categoryList=await Category.find();
    //if productList is empty
    if(!categoryList){
        res.status(500).json({  //500 is status code for internal server error
            success:false
        });
    }
    res.send(categoryList); //sending categoryList as response
});

//get request for category by id
router.get('/:id',(req,res)=>{
    //fetching category by id from database
     Category.findById(req.params.id).then((data)=>{

        if(data){
            return res.status(200).json(data); //200 is status code for ok
        }else{
            return res.status(404).json({success:false,message:'category not found'}); //404 is status code for not found
        }

    }).catch((err)=>{
        return res.status(400).json({success:false,error:err}); //400 is status code for bad request
    }); //finding category by id

    
});

//PUT request for category
router.put('/:id',async(req,res)=>{

    const category= await Category.findByIdAndUpdate(
        req.params.id,
        {
            name:req.body.name,
            color:req.body.color,
            icon:req.body.icon,
            image:req.body.image
        },
        {new:true}//to get updated data
    )

    if(!category){
        return res.status(400).json({success:false,message:'category cannot updated'}); //200 is status code for ok
    }

    res.send(category); //sending category as response
});

//post request for category
router.post(`/`, (req, res) => {
    //creating new category
    let category=new Category({
        name:req.body.name,
        color:req.body.color,
        icon:req.body.icon,
        image:req.body.image
    });
    //saving the category to database
    //save() is a promise so we use then and catch/ or we can also use async await
    category.save().then((data)=>{
        res.status(201).json(data); //201 is status code for created
    }).catch((err)=>{
        res.status(500).json({  //500 is status code for internal server error
            error:err,
            success:false
        });
    })   
});

//delete request for category
router.delete(`/:id`,(req,res)=>{

    Category.findByIdAndDelete(req.params.id).then((category)=>{
        if(category){
            return res.status(200).json({success:true,message:'category is deleted'}); //200 is status code for ok
        }else{
            return res.status(404).json({success:false,message:'category not found'}); //404 is status code for not found
        }
    }).catch((err)=>{
        return res.status(400).json({success:false,error:err}); //400 is status code for bad request
    }); //deleting category by id
})

module.exports = router; //exporting the router