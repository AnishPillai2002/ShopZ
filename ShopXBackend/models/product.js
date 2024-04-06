const mongoose=require('mongoose'); //used to connect to mongodb

//product schema
const productSchema=new mongoose.Schema({
    // name:String,
    // price:String,
    // count:{                 //required is used to make the field mandatory
    //     type:Number,
    //     required:true
    
    // },

    name:{
        type:String,
        required:true
    },
    description:{
        type:String,
        required:true
    },
    richDescription:{
        type:String,
        default:''
    },
    image:[{
        type:String,
        default:''
    }],
    brand:{
        type:String,
        default:''
    },
    price:{
        type:Number,
        default:0
    },
    category:{
        type:mongoose.Schema.Types.ObjectId, //this is used to refer to the category model (Foreign Key)
        ref:'Category', //this is used to refer to the category model (Foreign Key)
        required:true
    },
    countInStock:{
        type:Number,
        required:true,
        min:0,
        max:255
    },
    rating:{
        type:Number,
        default:0
    },
    isFeatured:{
        type:Boolean,
        default:false
    },
    dateCreated:{
        type:Date,
        default:Date.now
    }
})

//creating virtual id
//it is used to convert _id to id for easy understanding in frontend
productSchema.virtual('id').get(function(){
    return this._id.toHexString(); //converting object id to string
});

productSchema.set('toJSON',{
    virtuals:true //to include virtual id in response
})

//exporting product model
module.exports=mongoose.model('Product',productSchema);
