import { useState,useEffect } from 'react';
import { useHistory } from 'react-router';
import Navbar from './navbar.js';
import Card1 from './card1.js';
import Card3 from './card2.js';
import '../styles/dashboard.js.css';

export default function DashBoard(props)
{
    const [totalSpent,setTotalSpent]=useState('\u231B');
    const [balance,setBalance]=useState('\u231B');
    const [recentTransactionSum,setRecentTransactionSum]=useState('\u231B');
    const [currency,setCurrency]=useState('')
    const [expenseArr,setExpenseArr]=useState([]);

    useEffect(async()=>{
        //setProcessing(true);
        let uid=await localStorage.getItem('uid');

        var requestOptions = {
            method: 'GET',
            redirect: 'follow'
        };

        let url='http://localhost:3001/dashboard/get?uid='+uid;
          
        fetch(url, requestOptions)
        .then(response => response.text())
        .then(result => {
            result=JSON.parse(result);
            console.log(result);
            setTotalSpent(result.totalSpent);
            setBalance(result.balance);
            setExpenseArr(result.expenses);
            setRecentTransactionSum(result.recentTransactionSum);
            setCurrency(result.currency);
            //setProcessing(false);
        })
        .catch(error => console.log('error', error));
    })

    return (
        <div>
            <Navbar history={useHistory()} selected="dashboard"/>
            <div style={{paddingTop:'15vh'}}></div>
            <div className="container1">
                <Card1 title="Total Balance" value={currency+' '+balance} option="Update Balance"/>
                <Card1 title="Total Spent Amount" value={currency+' '+totalSpent}/>
            </div>
            <div style={{marginTop:'12vh',marginLeft:'5vw',fontWeight:'bolder',fontSize:'xx-large'}}>Most Recent Transactions</div>
            <div style={{paddingTop:'9vh'}}></div>
            <div style={{display:'flex',flexDirection:'column',maxWidth:'90vw',marginLeft:'5vw'}}>
                {expenseArr.map((item)=>{
                    return <Card3 key={item.index} type={item.type} time={item.timestamp} value={item.amount} id={item.index} description={item.description} currency={item.currency}/>
                })}
            </div>
            <div className="total">
                <div  style={{fontSize:"4vh",marginTop:'10vh',color:'#707070'}}>Expenses incurred in the last 5 transactions</div>
            </div>
            <div className="total">
                <div  style={{fontSize:"12vh",fontWeight:"bolder",color:'#3112A0'}}>&#8377;&nbsp;{recentTransactionSum}</div>
            </div>
        </div>
    )
}