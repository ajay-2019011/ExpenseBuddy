import firebase from '@firebase/app';
import { useState,useEffect} from 'react';
import { Backdrop, CircularProgress, Dialog } from '@material-ui/core';
import '../styles/login.js.css';

export default function Register(props)
{
    const [email,setEmail]=useState('');
    const [password,setPassword]=useState('');
    const [cnfpassword,setCnfPassword]=useState('');
    const [buttonStyle,setButtonStyle]=useState(styles.button);
    const [processing,setProcessing]=useState(false);


    function register(val)
    {
        if(val==='emailAndPassword')
        {
            if(email==='' || password==='' || cnfpassword==='')
                document.getElementById('msg').innerHTML="*Please enter all the required details";
            else if(password!==cnfpassword)
                document.getElementById('msg').innerHTML="*Password and Confirm Password do not match";
            else 
            {
                setProcessing(true);
                var provider=new firebase.auth.GoogleAuthProvider();
                firebase.auth().createUserWithEmailAndPassword(email,password)
                .then(async(userdetails)=>{
                    saveDetails(email,userdetails.user.uid);
                    props.history.push("/");
                })   
                .catch(error=>{
                    document.getElementById('msg').innerHTML=error.message;
                    setButtonStyle(styles.button);
                    setProcessing(false);
                })
            }
        }
        else if(val==='google')
        {   
            var provider=new firebase.auth.GoogleAuthProvider();
            firebase.auth().signInWithPopup(provider)
            .then(async(userdetails)=>{
                saveDetails(userdetails.user.email,userdetails.user.uid);
                props.history.push("/");
            })
            .catch(error=>{
                document.getElementById('msg').innerHTML=error.message;
                setProcessing(false);
            })
        }
    }
    function saveDetails(email,uid)
    {
        setProcessing(true);
        document.getElementById("loginbtn").style.cursor='progress';

        //POST request to the server to add the user data to database
        var myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");

        var raw = JSON.stringify({
            "uid": uid,
            "email": email
        });

        var requestOptions = 
        {
            method: 'POST',
            headers: myHeaders,
            body: raw,
            redirect: 'follow'
        };

        fetch("http://localhost:3001/user/add", requestOptions)
        .then(response => response.text())
        .then(async(result) => {
            console.log(result);
            if(result==='New User Added!')
            {
                //Store the uid in localstorage for a persistent login
                await localStorage.setItem('uid',uid);
                props.history.push("/");
            }
            else
            {
                document.getElementById('msg').innerHTML=result;
                setButtonStyle(styles.button);
                setProcessing(false);
            }
        })
        .catch(error => {
            console.log('error', error);
            setProcessing(false);
        });
    }
    useEffect(async()=>{
        let uid=await localStorage.getItem('uid');
        if(uid!==null)
        {
            props.history.push("/");
        }
    });
    return(
        <div class="logincontainer">
            <Backdrop color="primary" open={processing} style={{zIndex:2000}}>
                <CircularProgress style={{color:'#3129D2',fontSize:'xx-large',fontWeight:'bolder'}}/>
            </Backdrop>
            <div class="loginform">
                <div style={{cursor:'pointer'}} onClick={()=>props.history.push("/")}><img src="assets/logofull.png" alt="company logo" id="companylogo"/></div>
                <div id="formhead">Register</div>
                    <center style={buttonStyle} 
                        onMouseEnter={()=>{setButtonStyle(styles.buttonActive)}} 
                        onMouseLeave={()=>{setButtonStyle(styles.button)}}
                        onClick={()=>register('google')}>
                        <div style={{display:'flex',flexDirection:'row'}}>
                            <img src="assets/googleicon.png" style={{objectFit:'cover',height:25,width:25,marginRight:15}}/>
                            <div style={{paddingTop:2}}>Sign Up with Google</div>
                        </div>
                    </center>
                    <div id="info" style={{margin:"5vh 170px 5vh 70px"}}>
                        <div><h5>Or Sign In using Email</h5></div>
                    </div>
                    <div>
                        <div id="fieldhead">Email</div>
                        <input type="email" className="formtextbox" placeholder="mail@website.com"  style={{marginTop:'3px',marginBottom:'20px'}}   onChange={(event)=>setEmail(event.target.value)}></input>
                    </div>
                    <div>
                        <div id="fieldhead">Password</div>
                        <input type="password" className="formtextbox" placeholder="Password"  style={{marginTop:'3px',marginBottom:'20px'}}  onChange={(event)=>setPassword(event.target.value)}></input>
                    </div>
                    <div>
                        <div id="fieldhead">Confirm Password</div>
                        <input type="password" className="formtextbox" placeholder="Confirm Password"  style={{marginTop:'3px',marginBottom:'20px'}} onChange={(event)=>setCnfPassword(event.target.value)}></input>
                    </div>
                    <div style={{margin:'-15px 0px 10px 70px',color:'red'}} id="msg">&nbsp;</div>
                    <center id="loginbtn" onClick={()=>register('emailAndPassword')} style={{marginTop:'-5px'}}>
                        Sign Up
                    </center>
                    <div style={{margin:"-15px 170px 10px 70px"}} id="rememberme">
                        Already have an account? &nbsp;
                        <span id="forgotpassword" style={{fontWeight:'bolder'}} onClick={()=>props.history.push("/login")}>Sign In</span>
                    </div>
                    <center>
                </center>
            </div>
            <img src="assets/filler2.png" alt="Filler Image" style={{height:'100vh',width:'50vw'}} class="filler"/>
        </div>
    )
}
let styles={
    buttonDisabled:{
        transition: '750ms',
        margin: '0px 0px 30px 65px',
        fontWeight: 'bolder',
        color:'white',
        fontSize: 'xx-large',
        backgroundColor: 'gray',
        width:'33vw',
        borderRadius: '25px',
        padding:'5px 10px 5px 10px'
    },
    button: {
        transition:'750ms',
        backgroundColor:'white',
        display:'flex',
        margin:'0px 170px 0px 70px',
        flexDirection:'row',
        justifyContent:'space-evenly',
        alignContent:'center',
        width:'64%',
        color:'rgb(100,100,100)',
        borderRadius:50,
        boxShadow:'0px 0px 5px lightgray',
        fontSize:'large',
        paddingTop:8,
        paddingBottom:8,
        paddingLeft:20,
        paddingRight:20,
        cursor:'pointer'
    },
    buttonActive: {
        transition:'750ms',
        backgroundColor:'white',
        display:'flex',
        margin:'0px 170px 0px 70px',
        flexDirection:'row',
        justifyContent:'space-evenly',
        alignContent:'center',
        width:'64%',
        color:'rgb(100,100,100)',
        borderRadius:50,
        boxShadow:'0px 0px 10px lightgray',
        fontSize:'large',
        paddingTop:8,
        paddingBottom:8,
        paddingLeft:20,
        paddingRight:20,
        cursor:'pointer'
    }
}