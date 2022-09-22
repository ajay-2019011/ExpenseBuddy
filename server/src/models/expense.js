const mongoose=require('mongoose');
//Making models for expense and user
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