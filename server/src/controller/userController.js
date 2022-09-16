'use strict';

const connectDB=require('../config/connection');
const User = require('../models/user');
const user=require('../models/user');

const addUser=(req,res)=>{
    let uid=req.body.uid;
    let email=req.body.email;

    connectDB();

    let userData={
        uid:uid,
        email:email,
        balance:0,
        currency:'INR'
    }

    let user=new User(userData);

    user.save()
    .then(()=>res.send("New User Added!"))
    .catch(error=>res.status(500).send(error.message))
}

const authUser=(req,res)=>{
    let uid=req.body.uid;
    let email=req.body.email;

    User.find({uid:uid})
    .then(data=>{
        console.log(data);
        console.log(data.length);
        if(data.length===1 && (data[0]).email===email)
            res.send('Auth-Success');
        else
            res.send('Auth-Failure');
    })
    .catch(error=>res.send(error.message));
}

module.exports={addUser,authUser}