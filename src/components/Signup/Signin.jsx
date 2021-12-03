import React from "react";
import validator from "validator";
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import "./Signin.css";
import GamingAtoll from "../../assests/images/GamingAtoll .png"
import CustomizedSnackbars from "../Snackbar/Snackbar";
import { useHistory } from "react-router-dom";

function Signin() {
  const [email, setEmail] = React.useState();
  const [password, setPassword] = React.useState();
  const [emailError, setEmailError] = React.useState(false);
  const [showPassword, setShowPassword]=React.useState(false);
  const [text,setText]=React.useState("password");
  const [snackBar,setSnackBar] = React.useState({state:false,message:''})
  const [passwordErr, setPasswordErr]=React.useState(false);
  const router = useHistory();

  const signin = async () => {
    const payload = JSON.stringify({
      email,password
    })
    let response = await fetch(process.env.REACT_APP_PROXY+'/login',{method:'POST',body:payload,headers:{'Content-Type':'application/json'}});
    response = await response.json();
    setSnackBar({state:false,message:''})
    if(response.status && response.user.type == 'admin') {
      localStorage.user = JSON.stringify(response.user);
      localStorage.accessToken = response.accessToken;
      localStorage.refreshToken = response.refreshToken;
      setSnackBar({state:true,message:response.message})
      setTimeout(() => {
        router.push('/')
      }, 2000);
    }
    else {
      setSnackBar({state:true,message:"You are not authorized to continue"})
    }
  } 

  const validateEmail = (e) => {
    var email = e.target.value
  
    if (validator.isEmail(email)) {
      setEmailError(false)
      setEmail(email);
    } else {
      setEmailError(true)
    }
  }
  return (
    <>
    <div className="signup_container">
      <div className="left-container"></div>
      <div className="right-container">
        <div className="signup-form">
          <img src={GamingAtoll} /> <span>GamingAToll</span>
          <h2>Welcome! Sign in</h2>
          <div className="field">
            <label>Email*</label>
            <input placeholder="Email" type="email" onChange={(e)=>validateEmail(e) } style={emailError?{border:"2px solid red"}:{border:"2px solid whiteSmoke"}}></input><br />
        {/* <span style={{
          fontWeight: 'bold',
          color: 'red',
        }}>{emailError}</span> */}
          </div>
          <div className="field">
            <label>Password*</label>
            <div className="password-field">
            <input placeholder="Password" type={text}  style={passwordErr?{border:"2px solid red"}:{border:"2px solid whiteSmoke"}} onChange={(e)=>{
                console.log(e.target.value);
                if(e.target.value==""){
                    setPasswordErr(true)
                    console.log("white space")
                }
                setPasswordErr(false)
                setPassword(e.target.value)
            }}></input>
            {showPassword ?<VisibilityIcon sx={{margiRight:2}} onClick={()=>{setShowPassword(!showPassword);setText("password")}}/>:<VisibilityOffIcon sx={{margiRight:2}} onClick={()=>{setShowPassword(!showPassword);setText("text")}}/> }
         </div>
         
            {/* <VisibilityIcon/> */}
          </div>
          <div className="btn">
            <button onClick={signin}> Sign In</button>
          </div>
        </div>
      </div>
    <CustomizedSnackbars open={snackBar.state} message={snackBar.message} />
    </div>
    </>
  );
}

export default Signin;
