import Navbar from './navbar.js';
import { useState,useEffect } from 'react';
import { useHistory } from 'react-router';
import Card1 from './card1.js';
import BarChart from './barchart.js';
import DonutChart from './donutchart.js';
import { Backdrop,CircularProgress } from '@material-ui/core';
import '../styles/reports.js.css';

export default function Reports(props)
{

    const [data,setData]=useState([]);
    const [total,setTotal]=useState('\u231B');
    const [avg,setAvg]=useState(0);
    const [homeExp,setHomeExp]=useState(0);
    const [fuelExp,setFuelExp]=useState(0);
    const [foodExp,setFoodExp]=useState(0);
    const [otherExp,setOtherExp]=useState(0);
    const [shoppingExp,setShoppingExp]=useState(0);
    const [processing,setProcessing]=useState(false);
    const [percentArr,setPercentArr]=useState([]);

    async function fetchData(val)
    {
        setProcessing(true);
        let currency=document.querySelector('#currency');
        currency=currency.options[currency.selectedIndex].value;
        fetchWeeklyData(currency);
        fetchCategoryWiseData(currency);
        setProcessing(false);
    }

    async function fetchWeeklyData(currency)
    {
        setProcessing(true);
        var requestOptions = {
            method: 'GET',
            redirect: 'follow'
        };

        if(currency===undefined || currency===null)
            currency='INR';
        
        let uid=await localStorage.getItem('uid');

        let url="http://localhost:3001/reports/weekly?uid="+uid+"&currency="+currency+"&weekno=";

        fetch(url+"1", requestOptions)
        .then(response1 => response1.text())
        .then(result1=>{
            data.push(parseInt(result1));
            fetch(url+"2", requestOptions)
            .then(response2 => response2.text())
            .then(result2=>{
                //console.log(result2);
                data.push(parseInt(result2));
                fetch(url+"3", requestOptions)
                .then(response3 => response3.text())
                .then(result3=>{
                    //console.log(result3);
                    data.push(parseInt(result3));
                    fetch(url+"4", requestOptions)
                    .then(response4 => response4.text())
                    .then(result4=>{
                        //console.log(result4);
                        data.push(parseInt(result4));  
                        setData(data);
                        console.log(data);
                        setTotal(currency+' '+(data[0]+data[1]+data[2]+data[3]));
                        setAvg((currency+' '+((data[0]+data[1]+data[2]+data[3])/4)));  
                        setProcessing(false);                    
                    })
                    .catch(error => console.log('error', error))
                    })
                })
                .catch(error => console.log('error', error))
                })
            .catch(error => console.log('error', error))
    }

    async function fetchCategoryWiseData(currency)
    {
        setProcessing(true);
        var requestOptions = {
            method: 'GET',
            redirect: 'follow'
          };

          if(currency===undefined || currency===null)
            currency='INR';

          let uid=await localStorage.getItem('uid');
          let url="http://localhost:3001/reports/categorywise?uid="+uid+"&currency="+currency

          fetch(url, requestOptions)
            .then(response => response.text())
            .then(result => {
                result=JSON.parse(result);
                setFoodExp(result.Food);
                setHomeExp(result.Home);
                setOtherExp(result.Other);
                setShoppingExp(result.Shopping);
                setFuelExp(result.Fuel);
                setPercentArr([result.percentage.Food,result.percentage.Fuel,result.percentage.Home,result.percentage.Shopping,result.percentage.Other]);
                setProcessing(false);
            })
            .catch(error => console.log('error', error));
    }

    useEffect(async()=>{
        setProcessing(true);
        fetchWeeklyData();
        fetchCategoryWiseData();
        console.log(data);
        setProcessing(false);
    },[])

    return (
        <div>
            <Navbar history={useHistory()} selected="reports"/>
            <Backdrop color="primary" open={processing} style={{zIndex:2000}}>
                <CircularProgress style={{color:'#3129D2',fontSize:'xx-large',fontWeight:'bolder'}}/>
            </Backdrop>
            <div style={{paddingTop:'15vh'}}></div>
            <div className="container1">
                <Card1 title="Total Expenditure this Month" value={total}/>
                <Card1 title="Average Weekly Expenditure This Month" value={avg || '\u231B'}/>
            </div>
            <div className="chart-weekly">
                <BarChart categories={['Week 1','Week 2','Week 3','Week 4']} 
                            label={'Expenditure in this week'} 
                            data={data}
                            title="Total amount spent per week of the current month"
                            />
            </div>
            <div className="charts">
                <BarChart categories={['Food','Fuel','Home','Shopping','Other']} 
                            label={'Total Expenditure for the Category'} 
                            data={[foodExp,fuelExp,homeExp,shoppingExp,otherExp]}
                            title="Category Wise expenditure in the current month"
                            />
                <DonutChart title={"Share of each category in the total Expenditure this month"}
                        data={percentArr}/>
            </div>
        </div>
    )
}