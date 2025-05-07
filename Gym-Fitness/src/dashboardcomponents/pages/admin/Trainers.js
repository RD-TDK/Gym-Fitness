import React from 'react'
import styles from "./Admin.module.css";
import { Link } from 'react-router-dom';
import logoviews from "../../../../src/assets/fitnessWorkout-iconsorange.png";
import overviewimg from "../../../../src/assets/Dashbaord-icons.png";
import  trainerimg from "../../../../src/assets/trainer-icons.png";
import  schedualimg from "../../../../src/assets/Schedule-icons.png";
import  profileimg  from "../../../../src/assets/profile-icons.png";
import  logoutimg from "../../../../src/assets/Logout-icons.png";
import  notify from "../../../../src/assets/notification-icon.png";
import  imgprofile from "../../../../src/assets/Avatar-photo.png";
 import  searchicon from "../../../../src/assets/search-icons.png";
 import  trainerprofile from "../../../../src/assets/trainer-avatar.png";
 import  trainerinfoprofile from "../../../../src/assets/trainer-info.png";
 import email from "../../../../src/assets/email.png";
 import phone from "../../../../src/assets/phone.png";
 import address from "../../../../src/assets/location.png";





const Schedualcalender = () => {



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
      <Link to= "/overview" className={styles.menulinksdb}> Overview </Link>
    </div>

    <div className={styles.menuItemdb1}>
      <img src={trainerimg} alt='' className={styles.menuicon} />
      <Link to= "/scheduale" className={styles.menulinksdb}> Member </Link>
    </div>
    <div className={styles.menuItemdb1}>
      <img src={schedualimg} alt='' className={styles.menuicon} />
      <Link to= "/trainer" className={styles.menulinksdb}> Trainer </Link>
    </div>


    <div className={styles.nextsection02}>

    <div className={styles.menuItemdb01}>
      <img src={profileimg} alt='' className={styles.menuicon} />
      <Link to= "/myprofile" className={styles.menulinksdb}> My Profile </Link>
    </div>
    <div className={styles.menuItemdb01}>
      <img src={logoutimg} alt='' className={styles.menuicon} />
      <Link to= "/signup" className={styles.menulinksdb}> Logout </Link>
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


      <div className={styles.mainmembertwos}>
        <div className={styles.mainmembertwo01}>

        <div className={styles.Memberlistsection01}>
          <h2 className={styles.memberheader01}> Trainer List </h2>
          <div className={styles.membertwobtns}>
<div className={styles.membertwobtns02}>
  <Link to="/memberlists" className={styles.Memberlinklist}>Members Requests</Link>
  <Link to="/memberlists" className={styles.Memberlinklist}>Approved members</Link>
  <Link to="/memberlists" className={styles.Memberlinklist}>Rejected members</Link>


</div>

<div className={styles.membertwobtns0101}>
<input className={styles.memberinput} type='text' placeholder='Search'></input>
<img src={searchicon} alt=''></img>
 
</div>
          </div>
          {/* memberlist01-table */}
         
          <div className= {styles.member01tablenxtcontnr}>
      <div className={styles.member01tableheader}>
        <div className= {styles.member01tableheaderitem}>Name</div>
        <div className= {styles.member01tableheaderitem}>Email</div>
        <div className= {styles.member01tableheaderitem}> number</div>
        <div className= {styles.member01tableheaderitem}>Gender</div>
        <div className= {styles.member01tableheaderitem}>Actions</div>
      </div>



      {[...Array(5)].map((_, index) => (
        <div key={index} className= {styles.member01tablerow}>
          <div className={styles.member01tablerowitemmember01tableuser}>
          <img src={trainerprofile} alt="avatar" className={styles.avatar} />
            <span className= {styles.member01tableusername}>Arora</span>
          </div>
         


          <div className= {styles.member01tablerowitem}>aror@gmail.com</div>
          <div className= {styles.member01tablerowitem}>+49 587 2547</div>
          <div className= {styles.member01tablerowitem}>Male</div>
          <div className= {styles.member01tablerowitemmember01tableactions}>
            <button className={styles.member01tableacceptbtn}>Accept</button>
            <button className= {styles.member01tablerejectbtn}>Reject</button>
            <div className={styles.lastmemberthree}>
        ...
      </div>
          </div>
        </div>
      ))}
    </div>


          </div>

        </div>
        <div className={styles.mainmembertwo02}>
          <div className={styles.mainmembertwosub02}>
        <img src={trainerinfoprofile} alt="avatar" className={styles.avtarinfos} />
        <h2 className={styles.mebsubhead}>Arrora gaur</h2>
        <p className={styles.mebsubpara}>Male</p>
        <Link to="/overview" className={styles.mebsublink}>Approved</Link>
        </div>

        <div className={styles.mainmembertwosub03}>
          <h2 className={styles.mebsubhead}>Profile Info</h2>

          <div className={styles.mainmembertwosubs11}>
          <img src={email} alt="avatar" className={styles.emailinfo} />
          <p className={styles.mebsubtxtpara}> <Link to="/overview"className={styles.mebsublinkmail} >Email:</Link> arroragaur@gmail.com</p>
          </div>

          <div className={styles.mainmembertwosubs11}>
          <img src={phone} alt="avatar" className={styles.emailinfo} />
          <p className={styles.mebsubtxtpara}> <Link to="/overview"className={styles.mebsublinkmail} >Phone:</Link> +49 587 2547</p>
          </div>

          <div className={styles.mainmembertwosubs11}>
          <img src={phone} alt="avatar" className={styles.emailinfo} />
          <p className={styles.mebsubtxtpara}> <Link to="/overview"className={styles.mebsublinkmail} >Date of Birth:</Link>  6 April 1997  </p>
          </div>

          <div className={styles.mainmembertwosubs11}>
          <img src={address} alt="avatar" className={styles.emailinfo} />
          <p className={styles.mebsubtxtpara}> <Link to="/overview"className={styles.mebsublinkmail} >Address:</Link>  2239  Hog Camp Road</p>
          </div>


        </div>


        </div>
</div>
</div>


</div>
    
    

  )
}

export default Schedualcalender