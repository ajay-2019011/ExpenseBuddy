import { useState,useEffect } from "react";
import '../styles/card2.js.css';
import { Backdrop, CircularProgress, Dialog } from '@material-ui/core';
import '../styles/transactionForm.js.css';
import Details from "./details";

export default function Card3(props)
{

    const [visible,setVisible]=useState(false);
    const [id,setId]=useState(props.id);
    const [src,setSrc]=useState('');
    const [displayPrompt,setDisplayPrompt]=useState(false);
    const [processing,setProcessing]=useState(false);
    const [showDetails,setShowDetails]=useState(false);
    const [message,setMessage]=useState('');

    const [category,setCategory]=useState('');
    const [date,setDate]=useState('');
    const [desc,setDesc]=useState('');
    const [amt,setAmt]=useState('');
    const [currency,setCurrency]=useState('INR');

    function deleteTransaction()
    {
        setDisplayPrompt(false);
        setProcessing(true);
        console.log(id);
        var myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");

        var raw = JSON.stringify({
            "id": id
        });

        var requestOptions = {
            method: 'DELETE',
            headers: myHeaders,
            body: raw,
            redirect: 'follow'
        };

        fetch("http://localhost:3001/expenses/delete", requestOptions)
        .then(()=>{
            setProcessing(false);
            setVisible(false);
            window.location.reload();
        })
        .catch(error => {
            console.log('error', error);
            setProcessing(false);
        });
    }

    function updateTransaction()
    {
        setProcessing(true);
        var myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");

        var raw = JSON.stringify({
            "id": id,
            "type": category,
            "amount": amt,
            "currency": currency,
            "timestamp": date,
            "description": desc
        });

        var requestOptions = {
            method: 'PUT',
            headers: myHeaders,
            body: raw,
            redirect: 'follow'
        };

        fetch("http://localhost:3001/expenses/update", requestOptions)
        .then(response => response.text())
        .then(result => {
            if(result==='Success')
            {
                console.log(result);
                setProcessing(false);
                setMessage('');
                setVisible(false);
                window.location.reload();
            }
            else
            {
                console.log(result);
                setMessage(result);
                setProcessing(false);
            }
        })
        .catch(error => {
            console.log('error: ', error);
            setMessage(error);
            setProcessing(false);
        });
    }

    useEffect(()=>{
        if(props.type==='Home')
            setSrc('assets/home.png');
        if(props.type==='Food')
            setSrc('assets/food.png');
        if(props.type==='Fuel')
            setSrc('assets/fuel.png');
        if(props.type==='Shopping')
            setSrc('assets/shopping.png');
        if(props.type==='Other')
            setSrc('assets/other.png');
        setId(props.id);
    },[])
    return(
        <div className="card2">
            <Dialog open={showDetails}>
                <div className="close-modal" onClick={()=>{setShowDetails(false)}}>X</div>
                <Details id={id} category={props.type} amount={props.value} currency={props.currency} description={props.description} timestamp={props.time}/>
            </Dialog>
            <Dialog open={visible}>
                <div className="close-modal" onClick={()=>{setVisible(false)}}>X</div>
                <div className="modal-form">
                    <div>
                        <label htmlFor="expensetype">Filter:
                            <select id="expensetype" onChange={(event)=>setCategory(event.target.value)}>
                                <option>All</option>
                                <option>Home</option>
                                <option>Fuel</option>
                                <option>Food</option>
                                <option>Shopping</option>
                                <option>Other</option>
                            </select>
                        </label>
                    </div>
                    <div>
                        <label htmlFor="dateoftransaction">
                            Time:<input type="datetime-local" id="dateoftransaction" onChange={(event)=>setDate(event.target.value)}/>
                        </label>
                    </div>
                    <div>
                        <label htmlFor="transactionamount">
                            Amount:<input type="number" id="transactionamount" onChange={(event)=>setAmt(event.target.value)}/>
                        </label>
                    </div>
                    <div>
                        <label htmlFor="currency">Currency:
                            <select id="currency" onChange={(event)=>setCurrency(event.target.value)}>
                                <option>INR</option>
                                <option>USD</option>
                            </select>
                        </label>
                    </div>
                    <div>
                        <label htmlFor="description">Description:</label>
                        <textarea onChange={(event)=>setDesc(event.target.value)}/>
                    </div>
                </div>
                <div className="message" style={{padding:"1vh 2vw 1vh 2vw",color:'red'}}>{message}</div>
                <div style={{width:"83%",display:'flex',flexDirection:'row',justifyContent:"space-between",padding:"2vh 2vw 2vh 2vw"}}>
                    <div className="save"  onClick={()=>updateTransaction()}>UPDATE</div>
                    <div className="cancel"  onClick={()=>setVisible(false)}>CANCEL</div>
                </div>
            </Dialog>
            <Dialog open={displayPrompt}>
                <div className="prompt">
                    <div className="close-prompt" onClick={()=>{setDisplayPrompt(false)}}>X</div>
                    <div className="prompt-message">Are you sure you want to delete this transaction?</div>
                    <div className="prompt-options">
                        <div onClick={()=>deleteTransaction()}>Yes</div>
                        <div onClick={()=>setDisplayPrompt(false)}>No</div>
                    </div>
                </div>
            </Dialog>
            <div>
                <div><img src={src} style={{marginRight:'10vh'}}/></div>
                <div style={{display:'flex',justifyContent:'space-evenly',flexDirection:'column'}}>
                    <h1 className="expense-type" style={{color:'#707070'}}>{props.type}</h1>
                    <div className="time" style={{color:'#C9C2C2'}}>{props.time}</div>
                </div>
            </div>
            <div style={{fontSize:"9vh"}} className="expense1">&nbsp;{props.value}</div>
            <div className="operations">
                <img src="assets/delete.png" style={{marginRight:'10vh',height:'5vh',cursor:'pointer'}} onClick={()=>setDisplayPrompt(true)}/>
                <img src="assets/edit.png" style={{marginRight:'10vh',height:'5vh',cursor:'pointer'}} onClick={()=>setVisible(true)}/>
                <img src="assets/info.png" style={{marginRight:'10vh',height:'5vh',cursor:'pointer'}} onClick={()=>setShowDetails(true)}/>
            </div>
            <Backdrop color="primary" open={processing} style={{zIndex:2000,opacity:0.5}}>
                <CircularProgress style={{color:'#3129D2',fontSize:'xx-large',fontWeight:'bolder'}}/>
            </Backdrop>
        </div>
    )
}