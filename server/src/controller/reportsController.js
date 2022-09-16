'use strict';

const connectDB=require('../config/connection');
const Expense=require('../models/expense');
const user = require('../models/user');
const User = require('../models/user');
const exchangeRate=74.25;

const getWeekReport=(req,res)=>{
    let uid=req.query.uid;
    let currency=req.query.currency;
    let weekno=req.query.weekno;
    let selector={uid:uid};
    let today=new Date();

    let yy=today.getFullYear();
    let mm=today.getMonth()+1;
    let next_mm=mm+1;
    if(mm<9) mm='0'+mm.toString();
    if(next_mm<9) next_mm='0'+next_mm.toString();
    if(weekno==='1')
    {
        let from=new Date(yy+'-'+mm+'-'+'01').getTime();
        let to=new Date(yy+'-'+mm+'-'+'08').getTime();
        //console.log(yy+'-'+mm+'-'+'01'+'\n'+yy+'-'+mm+'-'+'08');
        selector.timestamp={$gte:from,$lt:to};
    }
    else if(weekno==='2')
    {
        let from=new Date(yy+'-'+mm+'-'+'08').getTime();
        let to=new Date(yy+'-'+mm+'-'+'15').getTime();
        selector.timestamp={$gte:from,$lt:to};
    }
    else if(weekno==='3')
    {
        let from=new Date(yy+'-'+mm+'-'+'15').getTime();
        let to=new Date(yy+'-'+mm+'-'+'22').getTime();
        selector.timestamp={$gte:from,$lt:to};
    }
    else 
    {
        let from=new Date(yy+'-'+mm+'-'+'22').getTime();
        selector.timestamp={$gte:from};
    }

    connectDB();

    Expense.find(selector)
    .then(data=>{
        //console.log(data);
        let totalAmount=0;
        data.forEach(doc=>{
            let amount=doc.amount;
            if(currency==='USD' && doc.currency==='INR')
            {
                amount/=exchangeRate;
                amount=parseFloat(amount.toFixed(2));
            }
            else if(currency==='INR' && doc.currency==='USD')
            {
                amount*=exchangeRate;
            }
            totalAmount+=amount;
        })
        res.send(totalAmount.toString());
    })
    .catch(error=>{
        console.log(error);
        res.status(500).send(error.message);
    })
}

const getCategoryWiseReport=(req,res)=>{
    let uid=req.query.uid;
    let currency=req.query.currency;
    let selector={uid:uid};
    let today=new Date();

    let yy=today.getFullYear();
    let mm=today.getMonth()+1;
    let next_mm=mm+1;
    if(mm<9) mm='0'+mm.toString();
    if(next_mm<9) next_mm='0'+next_mm.toString();

    let from=new Date(yy+'-'+mm+'-'+'01').getTime();
    let to=new Date(yy+'-'+next_mm+'-'+'01').getTime();
    selector.timestamp={$gte:from,$lt:to};
    
    connectDB();

    Expense.find(selector)
    .then(data=>{
        //console.log(data);
        let homeExp=0,fuelExp=0,foodExp=0,shoppingExp=0,otherExp=0;
        data.forEach(doc=>{
            let amount=doc.amount;
            console.log("Currency: "+currency+" Doc Currency: "+doc.currency);
            if(currency==='USD' && doc.currency==='INR')
            {
                amount/=exchangeRate;
                amount=parseFloat(amount.toFixed(2));
            }
            else if(currency==='INR' && doc.currency==='USD')
            {
                amount*=exchangeRate;
            }
            if(doc.type==='Home') homeExp+=amount;
            else if(doc.type==='Fuel') fuelExp+=amount;
            else if(doc.type==='Food') foodExp+=amount;
            else if(doc.type==='Shopping') shoppingExp+=amount;
            else if(doc.type==='Other') otherExp+=amount;
        });
        let totalExpense=homeExp+fuelExp+foodExp+shoppingExp+otherExp;
        let homePerc=(homeExp/totalExpense)*100;
        homePerc=parseFloat(homePerc.toFixed(2));
        let fuelPerc=(fuelExp/totalExpense)*100;
        fuelPerc=parseFloat(fuelPerc.toFixed(2));
        let foodPerc=(foodExp/totalExpense)*100;
        foodPerc=parseFloat(foodPerc.toFixed(2));
        let otherPerc=(otherExp/totalExpense)*100;
        otherPerc=parseFloat(otherPerc.toFixed(2));
        let shoppingPerc=(shoppingExp/totalExpense)*100;
        shoppingPerc=parseFloat(shoppingPerc.toFixed(2));
        let result={
            Home:homeExp,
            Fuel:fuelExp,
            Food:foodExp,
            Shopping:shoppingExp,
            Other:otherExp,
            percentage:
            {
                Home:homePerc,
                Fuel:fuelPerc,
                Food:foodPerc,
                Other:otherPerc,
                Shopping:shoppingPerc
            }
        }
        console.log(result);
        res.send(result);
    })
    .catch(error=>{
        console.log(error);
        res.status(500).send(error.message);
    })
}

module.exports={getWeekReport,getCategoryWiseReport};