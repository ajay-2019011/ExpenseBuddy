const express=require('express');
const {addUser,authUser}=require('../controller/userController');

const router=express.Router();

router.post("/add",addUser);
router.post("/auth",authUser)

module.exports=router;