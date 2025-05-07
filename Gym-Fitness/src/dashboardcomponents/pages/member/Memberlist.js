import { useEffect, useState } from 'react';
import styles from "./Member.module.css";
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
import  searchicon from "../../../../src/assets/search-icons.png";
import  arrowdown from "../../../../src/assets/downarrow-icon.png";
import  trainerprofile from "../../../../src/assets/trainer-avatar.png";
import  newarrowdown from "../../../../src/assets/NewArrow - Down.png";



const trainers = Array(6).fill({
  name: 'Arorra gaur',
  email: 'Arorra@gmail.com',
  type: 'Boxing, Fitness, etc', 
});




const Memberlist = () => {
  const [isSticky, setIsSticky] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 60) { // trigger after 1 scroll (adjust as needed)
        setIsSticky(true);
      } else {
        setIsSticky(false);
      }
    };
  
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);


  return (
    <div className={styles.headcontainer}>
      {/* Left-part */}

      <div className={`${styles.nextoverview01} ${isSticky ? styles.stickySidebar : ''}`}>
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
        <Link to= "/signin" className={styles.menulinksdb}> Logout </Link>
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
        
        <div className={styles.Memberlistsection}>
          <h2 className={styles.memberheader01}> Members List </h2>
          <div className={styles.membertwobtns}>
<div className={styles.membertwobtns01}>
  <input className={styles.memberinput} type='text' placeholder='Search'></input>
  <img src={searchicon} alt=''></img>
</div>

<div className={styles.membertwobtns02}>
  <button className={styles.member02btns}>Workout type</button>
  <img src={arrowdown} alt=''></img>
</div>
          </div>

        {/* memberlist-table */}

        <div className={styles.membertablesection}>
      <table className={styles.membermaintable}>
        <thead className={styles.membermainthread}>
          <tr className={styles.membertr1}>
            
            <th className={styles.memberth}>
            <div className={styles.newmembrth}>
              <span className={styles.newmembspn}>Name</span> 
            <img src={newarrowdown} alt=''></img>
            </div>
            </th>
            <th className={styles.memberth}>
            <div className={styles.newmembrth}>
              <span className={styles.newmembspn}>Email</span> 
            <img src={newarrowdown} alt=''></img>
            </div>
            </th>          
            <th className={styles.memberth}>
            <div className={styles.newmembrth}>
              <span className={styles.newmembspn}>Trainer Type</span> 
            <img src={newarrowdown} alt=''></img>
            </div>
            </th>   
            <th className={styles.memberth}>
            <div className={styles.newmembrth}>
              <span className={styles.newmembspn}>Status</span> 
            <img src={newarrowdown} alt=''></img>
            </div>
            </th>   
          </tr>
        </thead>
        <tbody>
          {trainers.map((trainer, index) => (
            <tr className={styles.membertr} key={index}>
              <td className={styles.membertd}>
                <div className={styles.profile}>
                  <img src={trainerprofile} alt="avatar" className={styles.avatar} />
                  {trainer.name}
                </div>
              </td>
              <td className={styles.membertd}>{trainer.email}</td>
              <td className={styles.membertd}>{trainer.type}</td>
              <td className={styles.membertd}>
                <button className={styles.membertablebtns}>Connect</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>


        </div>


      </div>
      </div>
  )
}

export default Memberlist