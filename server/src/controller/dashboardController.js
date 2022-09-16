'use strict';

const connectDB=require('../config/connection');
const Expense=require('../models/expense');
const User = require('../models/user');
const exchangeRate=74.25;

const getSummary=(req,res)=>{
    let uid=req.query.uid;

    connectDB();

    Expense.find({uid:uid}).sort({"timestamp":-1})
    .then(data=>{
        let expenseArr=[];
        let totalAmt=0,balance=0,counter=0;
        let recentTransactionSum=0;
        data.forEach(doc=>{
            let amount=doc.amount;
            if(counter<5)
            {
                let uid=doc.uid;
                let index=doc.index;
                let type=doc.type;
                let description=doc.description;
                let currency=doc.currency;
                let timestamp=new Date(doc.timestamp).toString();
                //console.log(timestamp);

                let expenseObj={
                    uid:uid,
                    index:index,
                    type:type,
                    description:description,
                    amount:amount,
                    currency:currency,
                    timestamp:timestamp,
                }
                recentTransactionSum+=amount;
                expenseArr.push(expenseObj);
            }
            totalAmt+=amount;
            counter++;
        })
        let responseData={
            expenses:expenseArr,
            totalSpent:parseFloat(totalAmt.toFixed(2)),
            recentTransactionSum:parseFloat(recentTransactionSum.toFixed(2)),
            balance:0,
            currency:'INR'
        }
        User.findOne({uid:uid})
        .then(data=>{
            responseData.balance=parseFloat(data.balance.toFixed(2));
            responseData.currency=data.currency;
            res.send(responseData);
            counter=0;
        })
        .catch(error=>{
            console.log(error.message);
            res.status(400).send(error.message);
        })
    })
    .catch(error=>{
        console.log(error.message);
        res.status(400).send(error.message);
    })
}

const updateBalance=(req,res)=>{
    let uid=req.body.uid;
    let balance=req.body.balance;
    let currency=req.body.currency;
    User.findOne({uid:uid}).updateOne({balance:balance,currency:currency})
    .then(()=>res.send('Success'))
    .catch(error=>{
        console.log(error.message);
        res.send(error.message);
    })
}

module.exports={getSummary,updateBalance}