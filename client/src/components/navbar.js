import { useEffect,useState } from 'react';
import '../styles/navbar.js.css';
import firebase from '../services/firebase.js';
import { useAuth } from '../contexts/AuthContext';
import MenuOpen from '@material-ui/icons/MenuOpen';
import Menu from '@material-ui/core/Menu';
import { Button } from '@material-ui/core';
import MenuItem from '@material-ui/core/MenuItem';
export default function Navbar(props)
{
    const {logout,currentUser}=useAuth();
    const [msg,setMsg]=useState('');
    const [anchorEl,setAnchorEl]=useState(null);

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    
    const handleClose = () => {
        setAnchorEl(null);
    };

    function handleLogout()
    {
        logout()
        .then(async()=>{
            await localStorage.removeItem('uid');
            props.history.push("/login");
        })
        .catch((error)=>{
            setMsg(error.message);
        })
    }
    useEffect(async()=>{
        let uid=await localStorage.getItem('uid');
        if(uid===null)
        {
            props.history.push('/login');
        }
    },[])

    useEffect(()=>{
        if(props.selected==="dashboard")
        {
            document.querySelector(".menu:nth-child(1)").style.color="white";
            document.querySelector(".menu:nth-child(1)").style.backgroundColor="#3129D2";
        }
        else if(props.selected==="expenses")
        {
            document.querySelector(".menu:nth-child(2)").style.color="white";
            document.querySelector(".menu:nth-child(2)").style.backgroundColor="#3129D2";
        }
        else if(props.selected==="reports")
        {
            document.querySelector(".menu:nth-child(3)").style.color="white";
            document.querySelector(".menu:nth-child(3)").style.backgroundColor="#3129D2";
        }
    },[])
    return(
        <div className="navbar">
            <div className="menuicon">
                <Button aria-controls="simple-menu" aria-haspopup="true" onClick={handleClick}>
                    <MenuOpen  style={{fontSize:'xx-large',color:'#3129D2'}}/>
                </Button>
                <Menu
                    id="simple-menu"
                    keepMounted
                    anchorEl={anchorEl}
                    open={Boolean(anchorEl)}
                    onClose={handleClose}
                >
                    <MenuItem onClick={()=>props.history.push("/dashboard")}>DashBoard</MenuItem>
                    <MenuItem onClick={()=>props.history.push("/expenses")}>Expenses</MenuItem>
                    <MenuItem onClick={()=>props.history.push("/reports")}>Reports</MenuItem>
                </Menu>
            </div>
            <div><img src="assets/logofull.png" alt="company logo" id="companylogo"/></div>
            <div className="menucontainer">
                <div className="menu" onClick={()=>props.history.push("/dashboard")}>DashBoard</div>
                <div className="menu" onClick={()=>props.history.push("/expenses")}>Expenses</div>
                <div className="menu" onClick={()=>props.history.push("/reports")}>Reports</div>
            </div>
            <div id="logout" onClick={handleLogout}><center>Logout</center></div>
        </div>
    )
}