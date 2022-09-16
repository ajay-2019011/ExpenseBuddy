const mongoose=require('mongoose');

const Expense=mongoose.Schema({
    index:String,
    uid:String,
    type:String,
    amount:Number,
    currency:String,
    timestamp:Number,
    description:String
})

module.exports=mongoose.model('Expense',Expense);