const express = require('express'); //express is a web framework for nodejs
const router = express.Router(); //router is used to create routes
const Product=require('../models/product'); //importing product model
const Category=require('../models/category'); //importing category model

const mongoose=require('mongoose'); //mongoose is a mongodb object modeling tool designed to work in an asynchronous environment




//GET request for fetching all Products
router.get(`/`, async(req, res) => {
    //passing query parameter
    //localhost:3000/api/v1/products?categories=2342342,2342342
    let filter={} //filter is an object
    if(req.query.categories){ //if categories are provided
        filter={category:req.query.categories.split(',')} //splitting the categories by comma and storing them in an array
    }

    //find() is a promise so we use then and catch/ or we can also use async await
    const productList=await Product.find(filter); //filtering the products by category

    //if productList is empty
    if(!productList){
        return res.status(500).json({  //500 is status code for internal server error
            success:false
        });
    }
    return res.send(productList);
});



//GET request for Single Product
router.get('/:id',(req,res)=>{
    //fetching product by id
    const product = Product.findById(req.params.id).populate('category').then(product=>{  //populate(fieldname) is used to get the details of the category
        if(product){
            return res.status(200).json(product); //200 is status code for ok
        }else{
            return res.status(404).json({success:false,message:'Product not found'}); //404 is status code for not found
        }
    }).catch(err=>{
        return res.status(400).json({success:false,error:err}); //400 is status code for bad request
    });
})



//POST request for Product
router.post(`/`, async (req, res) => {
    try {
        //validating category id
        const category = await Category.findById(req.body.category);
        if(!category){
            return res.status(400).send('Invalid Category');//400 is status code for bad request
        }

        //creating new product for post request
        const product = new Product({
            name:req.body.name,
            description:req.body.description,
            richDescription:req.body.richDescription,
            image:req.body.image,
            brand:req.body.brand,
            price:req.body.price,
            category:req.body.category,
            countInStock:req.body.countInStock,
            rating:req.body.rating,
            numReviews:req.body.numReviews,
            isFeatured:req.body.isFeatured,
        });

        //saving the product to database
        const createdProduct = await product.save();
        if(!createdProduct){
            return res.status(500).send('The product cannot be created');//500 is status code for internal server error
        }else{
            return res.status(201).send(createdProduct); //201 is status code for created
        }
    } catch(err) {
        return res.status(400).json({  //400 is status code for bad request
            success:false,
            message:'Invalid Product Data, the Category Id may not be a valid mongoDB ObjectId'
        });
    }
});



//PUT request for updating a Product
router.put('/:id',async(req,res)=>{
    //checking if the id is valid or not
    if(!mongoose.isValidObjectId(req.params.id)){
        return res.status(400).send('Invalid Product Id');//400 is status code for bad request
    } 
    //validating category id
    const category = await Category.findById(req.body.category);

    if(!category) {
        return res.status(400).send('Invalid Category');//400 is status code for bad request
    }

    //updating product by id
    const product=await Product.findByIdAndUpdate(req.params.id,{
        name:req.body.name,
        description:req.body.description,
        richDescription:req.body.richDescription,
        image:req.body.image,
        brand:req.body.brand,
        price:req.body.price,
        category:req.body.category,
        countInStock:req.body.countInStock,
        rating:req.body.rating,
        numReviews:req.body.numReviews,
        isFeatured:req.body.isFeatured,
    },{new:true});//new:true is used to get the updated product

    if(!product){
        return res.status(500).send('The product cannot be updated');//500 is status code for internal server error
    }
    return res.send(product);
});




//DELETE request for products
router.delete('/:id',(req,res)=>{
    //deleting product by id
    const product= Product.findByIdAndDelete(req.params.id).then(product=>{
        if(product){
            return res.status(200).json({success:true,message:'The product is deleted!'}); //200 is status code for ok
        }else{
            return res.status(404).json({success:false,message:'The product not found'}); //404 is status code for not found
        }
    }).catch(err=>{
        return res.status(400).json({success:false,message:'Invalid Product Id'}); //400 is status code for bad request
    });
});



//API to get Product Count
router.get(`/get/count`,(req,res)=>{
    //counting the number of products
    Product.countDocuments().then(count=>{
        res.send({
            productCount:count
        });
    }).catch(err=>{
        res.status(500).json({  //500 is status code for internal server error
            success:false
        });
    });
});



//API to get Featured Products
//count is optional(? is used to make it optional)
router.get(`/get/featured/:count?`,async(req,res)=>{

    //fetching featured products
    const count=req.params.count; //if count is not provided then it is set to 0

    let products;
    if(count){
        products=await Product.find({isFeatured:true}).limit(+count);//limiting the number of products
        
    }else{
        products=await Product.find({isFeatured:true});
    }

    if(!products){
        return res.status(500).send({  //500 is status code for internal server error
            success:false,
            message:'The product cannot be fetched'
        });
    }
    return res.send(products);
});



//exporting router
module.exports = router; 