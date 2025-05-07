import React, { useState } from 'react';
import styles from "./Entry.module.css";
import fitimage from "../assets/signup-image.png";
import fitlogo from "../assets/logo-image.jpg";
 import eye from '../assets/password-hide.png';
import { Link } from "react-router-dom";



const Entry = () => {

    const [showOTP, setShowOTP] = useState(false);
    const [otp, setOtp] = useState(["", "", "", ""]);
  
    const handleInputChange = (value, index) => {
      const newOtp = [...otp];
      newOtp[index] = value.slice(-1); // ensure only 1 character
      setOtp(newOtp);
  
      // Auto-focus next input
      if (value && index < 3) {
        const nextInput = document.getElementById(`otp-${index + 1}`);
        nextInput?.focus();
      }
    };
  
    const handleSignInClick = (e) => {
      e.preventDefault(); // prevent navigation
      setShowOTP(true);
    };


  return (
    <div className={styles.maincontainer}>
    <header className={styles.maintopbar}>
      <img src={fitlogo} alt="" className={styles.fitlogo}></img>
 <button className={styles.topButton} >  <Link to="/signin" className={styles.linktopbtn}>SIGNIN / SIGNUP</Link > </button> 
    </header>

    <div className={styles.maintopbar01} >
    <h2 className={styles.maintitle}>SIGNIN TO YOUR ACCOUNT</h2>

    </div>

    <div className={styles.mainContent}>
      {/* Left Side Image & Text */}
      <div className={styles.leftSection}>
        <img src={fitimage} alt="Fitness Models" className={styles.signinimage} />
      </div>

      {/* Right Side Form */}
      <div className={styles.rightSection}>
        <div className={styles.signInAsSection}>
          <h3 className={styles.signInAsTitle}>Sign In As</h3>
          {/* <div className={styles.signInAsOptions}>
            <Link to="/signin" className={styles.option}>Member</Link>
            <Link to="/login" className={styles.option}>Personal Trainer</Link>
            <Link to="/signup" className={styles.option}>Admin</Link>
          </div> */}
        </div>

        <input
          type="email"
          placeholder="Email Id"
          className={styles.sigininput}
        />

        <div className={styles.passwordContainer}>
          <input
            type= 'password'
            placeholder="Password"
            className={styles.siginpassword}
          />
          <img src={eye} alt="eye"></img>
       
        </div>

        <Link to="/" className={styles.forgotPassword}>Forgot Password?</Link>

        <div>
      <button className={styles.signInButton} onClick={handleSignInClick}>
        <span className={styles.signInLink}>Sign In</span>
      </button>

      {showOTP && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <h3 className={styles.popuptextentry}>Enter OTP</h3>
            <div className={styles.otpContainer}>
              {otp.map((digit, index) => (
                <input
                  key={index}
                  id={`otp-${index}`}
                  type="text"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleInputChange(e.target.value, index)}
                  className={styles.otpInput}
                />
              ))}
            </div>
            <button  className={styles.otpbtnsubmit}  onClick={() => alert("OTP Submitted: " + otp.join(""))}>Submit</button>
          </div>
        </div>
      )}
    </div>

        <div className={styles.nextdivider}>
          <hr className={styles.signhr} />
          <span className={styles.signTexts}>Or sign in with</span>
          <hr className={styles.signhr} />
        </div>

        {/* <div className={styles.socialButtonsEnd}>
      <div className={styles.socialbtn2}>  < img src={google} alt=""  className={styles.icon} />  <Link to="/" className={styles.socialBtn}> Google</Link> </div> 
      <div className={styles.socialbtn2}>    <img src={facebook} alt="" className={styles.icon} /> <Link to="/" className={styles.socialBtn}> Facebook</Link> </div> 
        </div> */}

        <div className={styles.signupText}>
          Don't have an account? <Link to="/signin" className={styles.signupLink}>Signup</Link>
        </div>
      </div>
    </div>
  </div>
  )
}

export default Entry