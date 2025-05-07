import React from "react";
import styles from "./Member.module.css";
import fitimage from '../../../../src/assets/signup-image.png';
import fitlogo from '../../../../src/assets/logo-image.jpg';
import eye from '../../../../src/assets/password-hide.png';
// import google from '../../../../src/assets/google.png';
// import facebook from '../../../../src/assets/icons-facebook.png';
import { Link } from "react-router-dom";


const signin = () => {


  return (
    <div className={styles.maincontainer}>
      <header className={styles.maintopbar}>
        <img src={fitlogo} alt="" className={styles.fitlogo}></img>
   <button className={styles.topButton} >  <Link to="/createacc" className={styles.linktopbtn}>SIGNUP</Link > </button> 
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

          <Link to="/createacc" className={styles.forgotPassword}>Forgot Password?</Link>

          <button className={styles.signInButton}> <Link to="/overviews" className={styles.signInLink}>Sign In</Link>  </button>

          {/* <div className={styles.nextdivider}>
            <hr className={styles.signhr} />
            <span className={styles.signTexts}>Or sign in with</span>
            <hr className={styles.signhr} />
          </div> */}

          {/* <div className={styles.socialButtonsEnd}>
        <div className={styles.socialbtn2}>  < img src={google} alt=""  className={styles.icon} />  <Link to="/" className={styles.socialBtn}> Google</Link> </div> 
        <div className={styles.socialbtn2}>    <img src={facebook} alt="" className={styles.icon} /> <Link to="/" className={styles.socialBtn}> Facebook</Link> </div> 
          </div> */}

          <div className={styles.signupText}>
            Don't have an account? <Link to="/createacc" className={styles.signupLink}>Signup</Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default signin