import React from "react";
import validator from "validator";
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import "./Signup.css";
function Signup() {
  const [email, setEmail] = React.useState();
  const [password, setPassword] = React.useState();
  const [emailError, setEmailError] = React.useState(false);
  const [showPassword, setShowPassword]=React.useState(false);
  const [text,setText]=React.useState("password");
  const [passwordErr, setPasswordErr]=React.useState(false);
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
    <div className="signup_container">
      <div className="left-container"></div>
      <div className="right-container">
        <div className="signup-form">
          <img src="https://dashboard.findaa.io/assets/images/logo.svg" />
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
            <button> Sign In</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Signup;
