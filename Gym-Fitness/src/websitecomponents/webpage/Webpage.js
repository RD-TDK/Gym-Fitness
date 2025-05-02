import React from 'react'
import styles from "./Webpage.module.css";
import { Link } from 'react-router-dom';


const Webpage = () => {
  return (
    <div className={styles.webpagecontainer}>
<div className={styles.webpagesection}>
<h2 className={styles.webpagehead01}>FITNESS</h2>
<Link to="/signin" className={styles.webpageLink01} >SIGNIN/SIGNUP</Link>
</div>

<div className={styles.webpagesection01}>
  <h2 className={styles.webpagehead001}>READY TO TRAIN</h2>
  <h2 className={styles.webpagehead002}>YOUR BODY</h2>
  <p className={styles.webpagepara01}>Gym training is a structured and disciplined approach to physical 
    exercise that focuses on strength, endurance and overall fitness improvement.</p>
<Link to="/" className={styles.webpagelink02}>JOIN NOW</Link>
</div> 

<div className={styles.webpagesection02}>
      <div className={styles.statBoxsectwo}>
        <h2 className={styles.numbersectwo}>20+</h2>
        <p className={styles.labelsectwo}>Years of Experience</p>
      </div>
      <div className={styles.dividersectwo} />
      <div className={styles.statBoxsectwo}>
        <h2 className={styles.numbersectwo}>15K+</h2>
        <p className={styles.labelsectwo}>Members Join</p>
      </div>
      <div className={styles.dividersectwo} />
      <div className={styles.statBoxsectwo}>
        <h2 className={styles.numbersectwo}>14K+</h2>
        <p className={styles.labelsectwo}>Happy members</p>
      </div>
    </div>

    <div className={styles.webpagesection03}>
      <div className={styles.sliderWrapper}>
        <p className={styles.webpagesecsliding}>
          YOU'RE FEARLESS - YOU'RE FEARLESS - YOU'RE FEARLESS - YOU'RE FEARLESS - YOU'RE FEARLESS - YOU'RE FEARLESS - YOU'RE FEARLESS
        </p>
        <p className={styles.webpagesecsliding}>
          YOU'RE FEARLESS - YOU'RE FEARLESS - YOU'RE FEARLESS - YOU'RE FEARLESS - YOU'RE FEARLESS - YOU'RE FEARLESS - YOU'RE FEARLESS
        </p>
      </div>
    </div>

    </div>
  )
}

export default Webpage