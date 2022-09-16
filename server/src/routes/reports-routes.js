const express=require('express');

const {getWeekReport,getCategoryWiseReport}=require('../controller/reportsController');
const { route } = require('./expense-routes');

const router=express.Router();

router.get("/weekly",getWeekReport);
router.get("/categorywise",getCategoryWiseReport);

module.exports=router;