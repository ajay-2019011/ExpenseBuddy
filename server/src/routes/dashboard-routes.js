const express=require('express');

const {getSummary,updateBalance}=require('../controller/dashboardController');

const router=express.Router();

router.get("/get",getSummary);
router.put("/update",updateBalance);

module.exports=router;