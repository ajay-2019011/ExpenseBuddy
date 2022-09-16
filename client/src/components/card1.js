import { useState } from 'react';
import '../styles/card1.js.css';
import { Backdrop, CircularProgress, Dialog } from '@material-ui/core';
export default function Card1(props)
{

    const [processing,setProcessing]=useState(false);
    const [showDialog,setShowDialog]=useState(false);
    const [amt,setAmt]=useState('');
    const [currency,setCurrency]=useState('INR');
    const [message,setMessage]=useState('');

    async function updateBalance()
    {
        var myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");

        let uid=await localStorage.getItem('uid');

        var raw = JSON.stringify({
          "uid": uid,
          "balance": amt,
          "currency": currency
        });

        var requestOptions = {
            method: 'PUT',
            headers: myHeaders,
            body: raw,
            redirect: 'follow'
        };

        fetch("http://localhost:3001/dashboard/update", requestOptions)
        .then(response => response.text())
        .then(result => {
            console.log(result);
            setProcessing(false);
            setShowDialog(false);
        })
        .catch(error => {
            console.log('error', error);
            setMessage(error.toString());
            setProcessing(false);
        });
    }

    return(
        <div className="card1">
            <Backdrop color="primary" open={processing} style={{zIndex:2000}}>
                <CircularProgress style={{color:'#3129D2',fontSize:'xx-large',fontWeight:'bolder'}}/>
            </Backdrop>
            <Dialog open={showDialog}>
                <div className="close-modal" onClick={()=>setShowDialog(false)}>X</div>
                <div className="modal-form" style={{height:'200px'}}>
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
                </div>
                <div className="message" style={{padding:"1vh 2vw 1vh 2vw",color:'red'}}>{message}</div>
                <div style={{width:"83%",display:'flex',flexDirection:'row',justifyContent:"space-between",padding:"2vh 2vw 2vh 2vw"}}>
                    <div className="save" onClick={()=>{
                        setProcessing(true);
                        updateBalance();
                    }}>SAVE</div>
                    <div className="cancel" onClick={()=>setShowDialog(false)}>CANCEL</div>
                </div>
            </Dialog>
            <h3>{props.title}</h3>
            <h1>&nbsp;{props.value}</h1>
            <center><h5 onClick={()=>setShowDialog(true)}>{props.option}</h5></center>
        </div>
    )
}