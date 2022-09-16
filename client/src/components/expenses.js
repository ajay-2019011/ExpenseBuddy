import Navbar from './navbar.js';
import { useState,useEffect } from 'react';
import { useHistory } from 'react-router';
import '../styles/expenses.js.css';
import Card3 from './card3.js';
import { Backdrop, CircularProgress, Dialog } from '@material-ui/core';
import Pagination from '@material-ui/lab/Pagination';
import '../styles/transactionForm.js.css';
export default function Expenses(props)
{
    const [visible,setVisible]=useState(false);

    const [category,setCategory]=useState('');
    const [date,setDate]=useState('');
    const [desc,setDesc]=useState('');
    const [amt,setAmt]=useState('');
    const [currency,setCurrency]=useState('INR');
    const [message,setMessage]=useState('');
    const [processing,setProcessing]=useState(false);

    const [pages,setPages]=useState(0);
    
    const [expenseArr,setExpenseArr]=useState([]);

    const handleChange = (event,value) => {
        refreshData(value);
    };

    async function refreshData(pageno)
    {
        setProcessing(true);
        var myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");

        if(pageno===null || pageno===undefined) pageno=1;

        let from=document.getElementById('datebegin').value;
        let to=document.getElementById('dateend').value;
        let filter=document.querySelector('#filteroptions');
        filter=filter.options[filter.selectedIndex].value;
        console.log(from);
        console.log(to);
        console.log(filter);

        var requestOptions = {
            method: 'GET',
            headers: myHeaders,
            redirect: 'follow'
        };
        let uid=await localStorage.getItem('uid');
        let url="http://localhost:3001/expenses/get"+"?uid="+uid+'&from='+from+'&to='+to+'&filter='+filter+'&pageno='+pageno;
        fetch(url, requestOptions)
        .then(response => response.text())
        .then(result => {
            result=JSON.parse(result);
            setExpenseArr(result.expenses);
            setPages(result.pages)
            setProcessing(false);
        })
        .catch(error => console.log('error', error));
    }

    async function createNewExpense()
    {
        if(category==='' || date==='' || amt==='')
        {
            setMessage('*Please fill in all the required details');
        }
        else
        {
            setProcessing(true);

            var myHeaders = new Headers();
            myHeaders.append("Content-Type", "application/json");

            let uid=await localStorage.getItem('uid');

            var raw = JSON.stringify({
                "uid":uid,
                "category": category,
                "description": desc,
                "amount": amt,
                "currency": currency,
                "timestamp": date
            }); 

            var requestOptions = {
                method: 'POST',
                headers: myHeaders,
                body: raw,
                redirect: 'follow'
            };

            fetch("http://localhost:3001/expenses/add", requestOptions)
            .then(response => response.text())
            .then(result => {
                setMessage(result);
                if(result==='Success')
                {
                    setCategory('');
                    setDate('');
                    setDesc('');
                    setAmt('');
                    setCurrency('INR');
                    setMessage('');

                    setVisible(false);
                    setProcessing(false);
                    refreshData();
                }
                else
                {
                    setProcessing(false);
                    setMessage(result);
                }
            })
            .catch(error =>{
                setMessage(error.message);
                setProcessing(false);
            });
        }
    }

    useEffect(async()=>{
            refreshData();
    },[])

    return (
        <div>
            <Navbar history={useHistory()} selected="expenses"/>
            <Backdrop color="primary" open={processing} style={{zIndex:2000}}>
                <CircularProgress style={{color:'#3129D2',fontSize:'xx-large',fontWeight:'bolder'}}/>
            </Backdrop>
            <Dialog open={visible}>
                <div className="close-modal" onClick={()=>{setVisible(false)}}>X</div>
                <div className="modal-form">
                    <div>
                        <label htmlFor="expensetype">Filter:
                            <select id="expensetype" onChange={(event)=>setCategory(event.target.value)}>
                                <option value=''>Category</option>
                                <option value='Home'>Home</option>
                                <option value='Fuel'>Fuel</option>
                                <option value='Food'>Food</option>
                                <option value='Shopping'>Shopping</option>
                                <option value='Other'>Other</option>
                            </select>
                        </label>
                    </div>
                    <div>
                        <label htmlFor="dateoftransaction">
                            Time:<input type="datetime-local" id="dateoftransaction"  onChange={(event)=>setDate(event.target.value)}/>
                        </label>
                    </div>
                    <div>
                        <label htmlFor="transactionamount">
                            Amount:<input type="number" id="transactionamount"  onChange={(event)=>setAmt(event.target.value)}/>
                        </label>
                    </div>
                    <div>
                        <label htmlFor="currency">Currency:
                            <select id="currency"  onChange={(event)=>setCurrency(event.target.value)}>
                                <option value='INR'>INR</option>
                                <option value='USD'>USD</option>
                            </select>
                        </label>
                    </div>
                    <div>
                        <label htmlFor="description">Description:</label>
                        <textarea  onChange={(event)=>setDesc(event.target.value)}/>
                    </div>
                </div>
                <div className="message" style={{padding:"1vh 2vw 1vh 2vw",color:'red'}}>{message}</div>
                <div style={{width:"83%",display:'flex',flexDirection:'row',justifyContent:"space-between",padding:"2vh 2vw 2vh 2vw"}}>
                    <div className="save"  onClick={()=>createNewExpense()}>SAVE</div>
                    <div className="cancel"  onClick={()=>setVisible(false)}>CANCEL</div>
                </div>
            </Dialog>
            <div style={{paddingTop:'15vh'}}></div>
            <div className="new-expense" onClick={()=>setVisible(true)}>Create New Expense</div>
            <div className="filters">
                <div className="datefilter">
                    <div>
                        <label htmlFor="datebegin">
                            From:<input type="date" id="datebegin" onChange={()=>{refreshData()}}/>
                        </label>
                    </div>
                    <div></div>
                    <div>
                        <label htmlFor="dateend">
                            To:
                                <input type="date" id="dateend" onChange={()=>{refreshData()}}/>
                        </label>
                    </div>
                </div>
                <div><label htmlFor="filteroptions">Filter:
                        <select id="filteroptions" onChange={()=>{refreshData()}}>
                            <option>All</option>
                            <option>Home</option>
                            <option>Fuel</option>
                            <option>Food</option>
                            <option>Shopping</option>
                            <option>Other</option>
                        </select>
                    </label>
                </div>
            </div>
            <div style={{display:'flex',flexDirection:'column',maxWidth:'90vw',marginLeft:'5vw'}}>
                <center style={{display:((expenseArr.length===0)?'block':'none')}}>
                    <div style={{fontSize:'xx-large'}}>&#8987;</div>
                </center>
                {expenseArr.map((item)=>{
                    return <Card3 key={item.index} type={item.type} time={item.timestamp} value={item.currency+' '+item.amount} id={item.index} description={item.description} currency={item.currency}/>
                })}
            </div>
            <div style={{display:'flex',justifyContent:'center',marginTop:'20px',marginBottom:'20px'}}>
                <Pagination count={pages}  color="primary" onChange={handleChange}/>
            </div>
        </div>
    )
}