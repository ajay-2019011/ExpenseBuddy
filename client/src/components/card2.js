import { useState,useEffect } from "react";
import '../styles/card2.js.css';
export default function Card2(props)
{
    const [src,setSrc]=useState('');
    useEffect(()=>{
        if(props.type==='Home')
            setSrc('assets/home.png');
        else if(props.type==='Food')
            setSrc('assets/food.png');
        else if(props.type==='Fuel')
            setSrc('assets/fuel.png');
        else if(props.type==='Shopping')
            setSrc('assets/shopping.png');
        else if(props.type==='Other')
            setSrc('assets/other.png');
    },[])
    return(
        <div className="card2">
            <div>
                <div><img src={src} style={{marginRight:'10vh'}}/></div>
                <div style={{display:'flex',justifyContent:'space-evenly',flexDirection:'column'}}>
                    <h1 className="expense-type" style={{color:'#707070'}}>{props.type}</h1>
                    <div className="time" style={{color:'#C9C2C2'}}>{props.time}</div>
                </div>
            </div>
            <div style={{fontSize:"9vh"}} className="expense1">{props.currency}&nbsp;{props.value}</div>
        </div>
    )
}