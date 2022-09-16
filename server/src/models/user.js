const mongoose=require('mongoose');

const User=mongoose.Schema({
    uid:String,
    email:String,
    balance:Number,
    currency:String
})

module.exports=mongoose.model('User',User);