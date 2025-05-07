import React from 'react'
import styles from "./Member.module.css";
import { Link } from 'react-router-dom';
import fitimage from '../../../../src/assets/signup-image.png';
import fitlogo from '../../../../src/assets/logo-image.jpg';
import eye from '../../../../src/assets/password-hide.png';
// import google from '../../../../src/assets/google.png';
// import facebook from '../../../../src/assets/icons-facebook.png';

const Createacc = () => {
  return (
    <div className={styles.mainaccountcreate}>
    <header className={styles.maintopbar}>
      <img src={fitlogo} alt="" className={styles.fitlogo}></img>
 <button className={styles.topButton} >  <Link to="/signin" className={styles.linktopbtn}>SIGNIN</Link > </button> 
    </header>

    <div className={styles.maintopbar01} >
    <h2 className={styles.maintitle}>CREATE AN ACCOUNT</h2>

    </div>

    <div className={styles.mainContent}>
      {/* Left Side Image & Text */}
      <div className={styles.leftSection}>
        <img src={fitimage} alt="Fitness Models" className={styles.signinimage} />
      </div>

      {/* Right Side Form */}
      <div className={styles.rightSection}>
        <div className={styles.signInAsSection}>
          <h3 className={styles.signInAsTitle}>Sign Up As</h3>
          <div className={styles.signInAsOptions}>
            <Link to="/createacc" className={styles.option}>Member</Link>
            <Link to="/openaccount" className={styles.option}>Personal Trainer</Link>
            {/* <Link to="/createaccount" className={styles.option}>Admin</Link> */}
          </div>
        </div>

        <input
          type="text"
          placeholder="Full name"
          className={styles.sigininput}
        />
          <input
          type="text"
          placeholder="Date of Birth"
          className={styles.sigininput}
        />

        <input
          type="text"
          placeholder="Phone Number"
          className={styles.sigininput}
        />

        <input
          type="email"
          placeholder="Email Id"
          className={styles.sigininput}
        />

          <input
          type="text"
          placeholder="Gender"
          className={styles.sigininput}
        />

<input
          type="text"
          placeholder="Select Interested Workouts"
          className={styles.sigininput}
        />

<textarea
  placeholder="Address"
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

        <div className={styles.passwordContainer}>
          <input
            type= 'Password'
            placeholder="Confirm Password"
            className={styles.siginpassword}
          />
          <img src={eye} alt="eye"></img>      
        </div>


        <button className={styles.signInButton}> <Link to="/overviews" className={styles.signInLink}>Sign Up</Link>  </button>

        <div className={styles.nextdivider}>
          <hr className={styles.signhr} />
          <span className={styles.signTexts}>Or sign up with</span>
          <hr className={styles.signhr} />
        </div>

        {/* <div className={styles.socialButtonsEnd}>
      <div className={styles.socialbtn2}>  < img src={google} alt=""  className={styles.icon} />  <Link to="/" className={styles.socialBtn}> Google</Link> </div> 
      <div className={styles.socialbtn2}>    <img src={facebook} alt="" className={styles.icon} /> <Link to="/" className={styles.socialBtn}> Facebook</Link> </div> 
        </div> */}

        <div className={styles.signupText}>
        Already have an account? <Link to="/signin" className={styles.signupLink}>SignUp</Link>
        </div>
      </div>
    </div>
  </div>
  )
}

export default Createacc