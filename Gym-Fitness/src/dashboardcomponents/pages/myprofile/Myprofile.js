import { useState } from 'react';
import styles from "./Myprofile.module.css";
import { Link } from 'react-router-dom';
import logoviews from "../../../../src/assets/fitnessWorkout-iconsorange.png";
import overviewimg from "../../../../src/assets/Dashbaord-icons.png";
import workoutimg from "../../../../src/assets/Workout-icons.png";
import  trainerimg from "../../../../src/assets/trainer-icons.png";
import  schedualimg from "../../../../src/assets/Schedule-icons.png";
import  profileimg  from "../../../../src/assets/profile-icons.png";
import  logoutimg from "../../../../src/assets/Logout-icons.png";
import  notify from "../../../../src/assets/notification-icon.png";
import  imgprofile from "../../../../src/assets/Avatar-photo.png";
import profilepic from "../../../../src/assets/Profile-update.png";


const Myprofile = () => {

  const [imageSrc, setImageSrc] = useState(profilepic);
  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file && file.size <= 1024 * 1024) { // Ensure the file size is under 1MB
      const reader = new FileReader();
      reader.onload = (e) => {
        setImageSrc(e.target.result); // Update the image source
      };
      reader.readAsDataURL(file); // Read the file as a data URL
    } else {
      alert('File size should be under 1MB');
    }
  };
 

  return (
    <div className={styles.headcontainer}>
    {/* Left-part */}

    <div className={styles.nextoverview01}>
      <div className={styles.overviewlogo}>
        <h2 className={styles.overviewheader1} >Fitness</h2>
        <img src={logoviews} alt=''></img>
      </div>
      <div className={styles.nextsection01}>

      <div className={styles.menuItemdb1}>
      <img src={overviewimg} alt='' className={styles.menuicon} />
      <Link to= "/overviews" className={styles.menulinksdb}> Overview </Link>
    </div>

    <div className={styles.menuItemdb1}>
      <img src={workoutimg} alt='' className={styles.menuicon} />
      <Link to= "/overviews" className={styles.menulinksdb}> Workout </Link>
    </div>
    <div className={styles.menuItemdb1}>
      <img src={trainerimg} alt='' className={styles.menuicon} />
      <Link to= "/memberlist" className={styles.menulinksdb}> Trainers </Link>
    </div>
    <div className={styles.menuItemdb1}>
      <img src={schedualimg} alt='' className={styles.menuicon} />
      <Link to= "/schedual" className={styles.menulinksdb}> My Schedule </Link>
    </div>


    <div className={styles.nextsection02}>

    <div className={styles.menuItemdb01}>
      <img src={profileimg} alt='' className={styles.menuicon} />
      <Link to= "/myprofile" className={styles.menulinksdb}> My Profile </Link>
    </div>
    <div className={styles.menuItemdb01}>
      <img src={logoutimg} alt='' className={styles.menuicon} />
      <Link to= "/" className={styles.menulinksdb}> Logout </Link>
    </div>
    </div>
      </div>
    </div>
    {/* right-part */}

    <div className={styles.nextoverview02}>

      <div className={styles.topbarover}>
        <div className={styles.topbarover01}>
          <p className={styles.bar01} >Good Morning</p>
          <p className={styles.bar02} >Welcome Back!</p>
        </div>

        <div className={styles.topbarover02}>
          <img src={notify} alt=''></img>
          <img src={imgprofile} alt=''></img>
          <span className={styles.bar03} >Member name</span>
        </div>
      </div>
    <div>
      <h2 className={styles.profileheader} >My Profile</h2>
    </div>

<div className={styles.profilesection} >

<div className={styles.profilesec01}>

<label htmlFor="imageUpload">
        <img src={imageSrc} alt="" className={styles.profileImage} />
      </label>
      <input
        type="file"
        id="imageUpload"
        accept="image/*"
        style={{ display: 'none' }}
        onChange={handleImageChange}
      />
      <p className={styles.accountpara1}>
        Image size should be under 1MB and image ratio needs to be 1:1
      </p>

</div>


<div className={styles.profilesec02}>

<div className={styles.accountsectitle}>General info</div>
        <div className={styles.accountnxt1} >
        <div className={styles.formgroupacc} >
            <label className={styles.formlabelacc}  for="fullName">Full name</label>
            <input className={styles.forminputacc}  type="text" id="fullName" placeholder="Jay Hargudson" />
        </div>
        <div className={styles.formgroupacc}>
            <label className={styles.formlabelacc} for="email">Email id</label>
            <input className={styles.forminputacc} type="email" id="email" placeholder="jayhargudson@gmail.com" />
        </div>
        </div>
        <div className={styles.accountnxt1} >
        <div className={styles.formgroupacc}>
            <label className={styles.formlabelacc} for="phone">Phone number</label>
            <input className={styles.forminputacc} type="text" id="phone" placeholder="+91-9876543210" />
        </div>
        <div className={styles.formgroupacc}>
            <label className={styles.formlabelacc} for="recoveryEmail">Recovery email id</label>
            <input className={styles.forminputacc} type="email" id="recoveryEmail" placeholder="jayhargudson@gmail.com" />
        </div>
        </div>
        <div  className={styles.formactions}>
      <Link to="/editaccount"> <button className={styles.accountbtns} >Edit details</button> </Link>  
        </div>
        <div className={styles.divider}> </div>
        <div  className={styles.sectiontitle}>Update Password</div>
        <div  className={styles.formactions}>
        <Link to="/updateaccount"> <button className={styles.accountbtns1} >Change Password</button> </Link>  
        </div>

</div>
</div>

      </div>
      </div>
  )
}

export default Myprofile