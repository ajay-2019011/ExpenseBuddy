const mongoose=require('mongoose');
require('dotenv').config();
//For connection
const connectDB=async()=>
{
    try
    {
        await mongoose.connect(process.env.URI,{
            useUnifiedTopology:true,
            useNewUrlParser:true
        });
        //console.log("Database connection established");
    }
    catch(exception)
    {
        console.log(exception);
        mongoose.connection.close();
    }
}

module.exports=connectDB;