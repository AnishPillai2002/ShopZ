const express = require('express'); //express is a web framework for nodejs
const router = express.Router(); //router is used to create routes
const Product=require('../models/product'); //importing product model
const Category=require('../models/category'); //importing category model

//routes
//get request for products
router.get(`/`, async(req, res) => {

    //fetching all products from database
    //find() is a promise so we use then and catch/ or we can also use async await
    const productList=await Product.find();

    //if productList is empty
    if(!productList){
        res.status(500).json({  //500 is status code for internal server error
            success:false
        });
    }

    res.send(productList);


});

//GET request for single product
router.get('/:id',async(req,res)=>{

    //fetching product by id
    const product = await Product.findById(req.params.id).populate('category');//populate(fieldname) is used to get the details of the category

    if(!product){
        res.status(500).json({  //500 is status code for internal server error
            success:false
        });
    }
    res.send(product);
})


//POST request for products
router.post(`/`, async (req, res) => {

    //validating category id
    const category = await Category.findById(req.body.category);

    if(!category) {
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
    //save() is a promise so we use then and catch/ or we can also use async await

    data=await product.save();

    if(!data){
        res.status(500).send('The product cannot be created');//500 is status code for internal server error
    }

    res.send(data);
    // product.save().then((data)=>{
    //     res.status(201).json(data); //201 is status code for created
    // }).catch((err)=>{
    //     res.status(500).json({  //500 is status code for internal server error
    //         error:err,
    //         success:false
    //     });
    // })
})


//PUT request for products
router.put('/:id',async(req,res)=>{

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
        res.status(500).send('the product cannot be updated');//500 is status code for internal server error
    }

    res.send(product);
});

//DELETE request for products
router.delete('/:id',(req,res)=>{

    //deleting product by id
    const product= Product.findByIdAndDelete(req.params.id).then(product=>{
        if(product){
            return res.status(200).json({success:true,message:'the product is deleted!'}); //200 is status code for ok
        }else{
            return res.status(404).json({success:false,message:'product not found'}); //404 is status code for not found
        }
    }).catch(err=>{
        return res.status(400).json({success:false,error:err}); //400 is status code for bad request
    });

});
module.exports = router; //exporting router