const express=require('express');

const {addExpense,getAllExpenses,updateExpense, deleteExpense}=require('../controller/expenseController');

const router=express.Router();

router.post("/add",addExpense);
router.get("/get",getAllExpenses);
router.put("/update",updateExpense);
router.delete("/delete",deleteExpense);

module.exports=router;