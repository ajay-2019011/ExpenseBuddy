import { useEffect, useState} from 'react';
import '../styles/login.js.css';
import { useAuth } from '../contexts/AuthContext';
import firebase from '../services/firebase.js';

export default function Login(props)
{
    const [buttonStyle,setButtonStyle]=useState(styles.button);
    const [email,setEmail]=useState('');
    const [password,setPassword]=useState('');
    const {login,currentUser}=useAuth();
    const [active,setActive]=useState(true);

    function signin()
    {
        if(active===true)
        {
            if(email==='' || password==='')
            document.getElementById('msg').innerHTML="*Please enter all the required details";
            else
            {
                document.getElementById('msg').innerHTML="&nbsp;";
                document.getElementById('loginbtn').innerHTML="Please Wait...";
                document.getElementById('loginbtn').style.backgroundColor='lightgray';
                setActive(false);
                login(email,password)
                .then(async(userdetails)=>{
                    document.getElementById("loginbtn").style.cursor='progress';
                    authenticate(email,userdetails.user.uid,'email');
                })
                .catch(error=>{
                    document.getElementById("loginbtn").style.cursor='pointer';
                    document.getElementById('loginbtn').innerHTML="Login";
                    document.getElementById('loginbtn').style.backgroundColor='#090476';
                    document.getElementById('msg').innerHTML=error.message;
                    setActive(true);
                });
            }
        }
    }
    function googleSignIn()
    {
        console.log("Logging In...")
        var provider=new firebase.auth.GoogleAuthProvider();
        firebase.auth().signInWithPopup(provider)
        .then(async(userdetails)=>{
            document.getElementById("loginbtn").style.cursor='progress';
            authenticate(userdetails.user.email,userdetails.user.uid,'google');

        })
        .catch(error=>{
            document.getElementById("loginbtn").style.cursor='pointer';
            document.getElementById('loginbtn').innerHTML="Login";
            document.getElementById('loginbtn').style.backgroundColor='#090476';
            setActive(true);
        })
    }
    async function authenticate(email,uid,signinMethod)
    {
        var myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");
        console.log("Email is: "+email);
        var raw = JSON.stringify({
            "email": email,
            "uid": uid
        });

        var requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: raw,
            redirect: 'follow'
        };

        fetch("http://localhost:3001/user/auth", requestOptions)
        .then(response => response.text())
        .then(async(result) => {
            console.log(result);
            if(result==='Auth-Success')
            {
                await localStorage.setItem('uid',uid);
                props.history.push("/");
            }
            else
            {
                if(signinMethod==='google')
                    document.getElementById('msg').innerHTML="No Account exists for this Email-ID";
                await localStorage.removeItem('uid');
                document.getElementById("loginbtn").style.cursor='pointer';
                document.getElementById('loginbtn').innerHTML="Login";
                document.getElementById('loginbtn').style.backgroundColor='#090476';
            }
        })
        .catch(error => console.log('error', error));
    }
    useEffect(async()=>{
        let uid=await localStorage.getItem('uid');
        if(uid!==null)
        {
            props.history.push("/");
        }
    })
    return(
        <div className="logincontainer">
            <div className="loginform">
                <div style={{cursor:'pointer'}}><img src="assets/logofull.png" alt="company logo" id="companylogo"/></div>
                <div id="formhead">Login</div>
                <center style={buttonStyle} 
                    onMouseEnter={()=>{setButtonStyle(styles.buttonActive)}} 
                    onMouseLeave={()=>{setButtonStyle(styles.button)}}
                    onClick={()=>{googleSignIn();}}>
                    <div style={{display:'flex',flexDirection:'row'}}>
                        <img src="assets/googleicon.png" style={{objectFit:'cover',height:25,width:25,marginRight:15}}/>
                        <div style={{paddingTop:2}} onClick={()=>googleSignIn()}>Sign In with Google</div>
                    </div>
                </center>
                <div id="info" style={{margin:"5vh 170px 5vh 70px"}}>
                    <div><h5>Or Sign In using Email</h5></div>
                </div>
                <div>
                    <div id="fieldhead">Email</div>
                    <input type="email" className="formtextbox" placeholder="mail@website.com"  onChange={(event)=>setEmail(event.target.value)}></input>
                </div>
                <div>
                    <div id="fieldhead">Password</div>
                    <input type="password" className="formtextbox" placeholder="Password" onChange={(event)=>setPassword(event.target.value)}></input>
                </div>
                <div style={{display:"flex",margin:"-2px 170px 30px 70px",width:"67%"}}>
                    <div id="forgotpassword">Forgot Password?</div>
                </div>
                <div style={{margin:'-15px 0px 10px 70px',color:'red'}} id="msg">&nbsp;</div>
                <center id="loginbtn" onClick={()=>signin()}>
                    Login
                </center>
                <div style={{margin:"-15px 170px 10px 70px"}} id="rememberme">
                    Not Registered Yet? &nbsp;
                    <span id="forgotpassword" style={{fontWeight:'bolder'}} onClick={()=>props.history.push("/signup")}>Create an Account</span>
                </div>
            </div>
            <img src="assets/filler1.png" alt="Filler Image" style={{height:'100vh',width:'50vw'}} className="filler"/>
        </div>
    )
}
let styles={
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