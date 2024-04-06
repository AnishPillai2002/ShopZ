const mongoose=require('mongoose'); //used to connect to mongodb

//category schema
const categorySchema= new mongoose.Schema({


    name:{
        type:String,
        required:true 
    },
    color:{
        type:String,
        required:true 
    },
    icon:{
        type:String,
        required:true
    },
    image:{
        type:String,
        default:''
    },
});

module.exports=mongoose.model('Category',categorySchema); //exporting the category model