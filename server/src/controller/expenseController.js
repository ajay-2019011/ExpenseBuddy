'use strict';

const connectDB=require('../config/connection');
const Expense=require('../models/expense');
const user = require('../models/user');
const User = require('../models/user');
const exchangeRate=74.25;

const addExpense=(req,res)=>{

    console.log(req.body);

    let uid=req.body.uid;
    let index='';
    let type=req.body.category;
    let description=req.body.description;
    let amount=req.body.amount;
    let currency=req.body.currency;
    let timestamp=req.body.timestamp;

    connectDB();

    User.findOne({uid:uid})
    .then(data=>{
        let balance=data.balance;
        if(data.currency==='USD' && currency==='INR')
        {
            amount/=exchangeRate;
            amount=parseFloat(amount.toFixed(2));
        }
        else if(data.currency==='INR' && currency==='USD')
        {
            amount*=exchangeRate;
        }
        if(balance<amount)
        {
            res.send('Insufficient balance')
        }
        else
        {
            balance-=amount;
            let date =new Date(timestamp);
            timestamp=date.getTime();

           let expenseData={
                uid:uid,
                index:index,
                type:type,
                description:description,
                amount:amount,
                currency:currency,
                timestamp:timestamp
            }

            let expense=new Expense(expenseData);

            expense.save()
            .then(data=>{
                let id=data._id;
                console.log("Adding Index.....");
                Expense.updateOne({uid:uid,index:''},{index:id})
                .then(()=>{
                    User.updateOne({uid:uid},{balance:balance})
                    .then(()=>res.send('Success'))
                    .catch(error=>{
                        console.log(error.emssage)
                        res.status(500).send(error.message);
                    })
                })
                .catch(error=>{
                    console.log(error.emssage)
                    res.status(500).send(error.message);
                })
            })
            .catch(error=>{
                console.log(error.emssage)
                res.status(500).send(error.message);
            })
        }
    })
    .catch(error=>{
        console.log(error.message);
        res.status(500).send(error.message);
    })
}

const getAllExpenses=(req,res)=>{

    let uid=req.query.uid;
    let from=req.query.from;
    let to=req.query.to;
    let filter=req.query.filter;
    let pageno=req.query.pageno;

    let findClause={uid:uid};

    if(from!=='' && to!=='')
    {
        from=new Date(from).getTime();
        to=new Date(to).getTime();
        findClause.timestamp={$gte:from,$lte:to}
    }
    else if(from!=='')
    {
        from=new Date(from).getTime();
        findClause.timestamp={$gte:from}
    }
    else if(to!='')
    {
        to=new Date(to).getTime();
        findClause.timestamp={$lte:to}
    }

    if(filter!=='All')
    {
        findClause.type=filter;
    }

    connectDB();

    Expense.find(findClause).sort({"timestamp":-1})
    .then(result=>{
        Expense.find(findClause).sort({"timestamp":-1}).limit(5).skip((pageno-1)*5)
        .then(data=>{
            let expenseArr=[];
            data.forEach(doc=>{
                
                let uid=doc.uid;
                let index=doc.index;
                let type=doc.type;
                let description=doc.description;
                let amount=doc.amount;
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
                    timestamp:timestamp
                }

                expenseArr.push(expenseObj);
            })
            let numPages=Math.floor(result.length/5)+((result.length%5==0)?0:1);
            res.send({"expenses":expenseArr,pages:numPages});
        })
        .catch(error=>{
            console.log(error.emssage)
            res.status(500).send(error.message);
        });
    })
    .catch(error=>{
        console.log(error.emssage)
        res.status(500).send(error.message);
    });

}

const updateExpense=(req,res)=>{
    let id=req.body.id;
    let type=req.body.type;
    let amount=req.body.amount;
    let currency=req.body.currency;
    let timestamp=new Date(req.body.timestamp).getTime();
    let description=req.body.description;

    connectDB();

    Expense.findOne({index:id})
    .then(data=>{
        let prevAmount=data.amount;
        let prevcurrency=data.currency;
        if(prevcurrency==='USD' && currency==='INR')
        {
            prevAmount*=exchangeRate;
        }
        else if(prevcurrency==='INR' && currency==='USD')
        {
            prevAmount/=exchangeRate;
            prevAmount=parseFloat(prevAmount.toFixed(2));
        }
        let difference=amount-prevAmount;
        User.findOne({uid:data.uid})
        .then(userdata=>{
            if(userdata.currency==='INR' && currency==='USD')
            {
                difference*=exchangeRate;
            }
            else if(prevcurrency==='INR' && currency==='USD')
            {
                difference/=exchangeRate;
                difference/=parseFloat(difference.toFixed(2));
            }
            if(userdata.balance<difference)
            {
                res.send('Insufficient Balance');
            }
            else
            {
                User.updateOne({uid:userdata.uid},{balance:userdata.balance-difference})
                .then(()=>{
                    //to be deleted
                    Expense.updateOne({index:id},{type:type,amount:amount,currency:currency,timestamp:timestamp,description:description})
                    .then(()=>res.send('Success'))
                    .catch(error=>{
                        console.log(error.emssage)
                        res.status(500).send(error.message);
                    })
                })
                .catch(error=>{
                    console.log(error.emssage)
                    res.status(500).send(error.message);
                })
            }
        })
        .catch(error=>{
            console.log(error.emssage)
            res.status(500).send(error.message);
        })
    })
    .catch(error=>{
        console.log(error.emssage)
        res.status(500).send(error.message);
    })
}

const deleteExpense=(req,res)=>{
    let id=req.body.id;
    Expense.deleteOne({index:id})
    .then(()=>res.send('Success'))
    .catch(error=>{
        console.log(error.message);
        res.status(500).send(error.message)
    })
}

module.exports={addExpense,getAllExpenses,updateExpense,deleteExpense};