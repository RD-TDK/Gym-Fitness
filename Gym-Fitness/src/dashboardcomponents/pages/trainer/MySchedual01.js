import React from 'react'
import styles from "./Trainer.module.css";
import { Link } from 'react-router-dom';
import logoviews from "../../../../src/assets/fitnessWorkout-iconsorange.png";
import overviewimg from "../../../../src/assets/Dashbaord-icons.png";
import  trainerimg from "../../../../src/assets/trainer-icons.png";
import  schedualimg from "../../../../src/assets/Schedule-icons.png";
import  profileimg  from "../../../../src/assets/profile-icons.png";
import  logoutimg from "../../../../src/assets/Logout-icons.png";
import  notify from "../../../../src/assets/notification-icon.png";
import  imgprofile from "../../../../src/assets/Avatar-photo.png";
import  arrowdown from "../../../../src/assets/downarrow-icon.png";
import  arrowplus from "../../../../src/assets/plus-icon.png";
import  searchicon from "../../../../src/assets/search-icons.png";
import  arrowlefts from "../../../../src/assets/Arrow - lefts2.png";
import  arrowrights from "../../../../src/assets/Arrow -rights2.png";
import avatarpic from "../../../../src/assets/trainer-avatar.png";



const MySchedual01 = () => {

  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const dates = [
    '', '', '', 1, 2, 3, 4,
    5, 6, 7, 8, 9, 10, 11,
    12, 13, 14, 15, 16, 17, 18,
    19, 20, 21, 22, 23, 24, 25,
    26, 27, 28, 29, 30, '', ''
  ];

  const events = {
    2: ['Fitness class', 'Boxing'],
    16: ['Boxing'],
    21: ['Boxing'],
    25: ['Fitness'],
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
      <Link to= "/overviews1" className={styles.menulinksdb}> Overview </Link>
    </div>

   
    <div className={styles.menuItemdb1}>
      <img src={trainerimg} alt='' className={styles.menuicon} />
      <Link to= "/memberlists" className={styles.menulinksdb}> Member </Link>
    </div>
    <div className={styles.menuItemdb1}>
      <img src={schedualimg} alt='' className={styles.menuicon} />
      <Link to= "/myschedual01" className={styles.menulinksdb}> My Schedule </Link>
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
    

    <div className={styles.mainschedual}>
      <h2 className={styles.schedualheader01}>Calender</h2>
      <div className={styles.smallminischedual}>
        <p className={styles.schedualtext01}> Monthly</p>
        <img src={arrowdown} alt=''></img>
        </div>
    </div>

    <div className={styles.maincalenders}>
      <div className={styles.maincalenders01}>
      <div className={styles.smallminicalender01}>
      <img src={arrowplus} alt=''></img>
        <Link to="/" className={styles.schedualtext02}> Create Schedual</Link>
        </div>

        <div className={styles.schedualcalender}>
      <div className={styles.schedualheader11}>
        <span className={styles.dechead}>December 2, 2021</span>
        <div className={styles.nav}>
        <img src={arrowlefts} alt=''></img>
        <img src={arrowrights} alt=''></img>
        </div>
      </div>
      <div className={styles.daysHeader}>
        <div>S</div><div>S</div><div>M</div><div>T</div><div>W</div><div>T</div><div>F</div>
      </div>
      <div className={styles.calenderdates}>
        {[
          "", "", "1", "2", "3", "4", "5",
          "6", "7", "8", "9", "10", "11", "12",
          "13", "14", "15", "16", "17", "18", "19",
          "20", "21", "22", "23", "24", "25", "26",
          "27", "28", "29", "30", "31", "1", "2"
        ].map((day, index) => (
          <div
            key={index}
            className={`${styles.caldate} ${day === "3" ? styles.active : ""} ${["29", "30", "1", "2"].includes(day) && index < 7 ? styles.faded : ""} ${["1", "2"].includes(day) && index > 30 ? styles.faded : ""}`}
          >
            {day}
          </div>
        ))}
      </div>
    </div>

    <div className={styles.nextcalender01}>
      <p className={styles.nxtcaltext} >People</p>

      <div className={styles.calenderbtns01}>
  <input className={styles.memberinput} type='text' placeholder='Search'></input>
  <img src={searchicon} alt=''></img>
</div>

    </div>
  
<div className={styles.bottomschedual}>
<div className={styles.bottomschdal01}>
<img src={avatarpic} className={styles.userimg} alt='' />
</div>
<div className={styles.bottomschdal01}>
  <p className={styles.bottomschdaltxt}>Eddie Lobanovskiy</p>
  <p className={styles.bottomschdaltxtss}>laboanovskiy@gmail.com</p>
</div>
</div>

<div className={styles.bottomschedual}>
<div className={styles.bottomschdal01}>
<img src={avatarpic} className={styles.userimg} alt='' />
</div>
<div className={styles.bottomschdal01}>
  <p className={styles.bottomschdaltxt}>Alexey Stave</p>
  <p className={styles.bottomschdaltxtss}>alexeyst@gmail.com</p>
</div>
</div>

<div className={styles.bottomschedual}>
<div className={styles.bottomschdal01}>
<img src={avatarpic} className={styles.userimg} alt='' />
</div>
<div className={styles.bottomschdal01}>
  <p className={styles.bottomschdaltxt}>Anton Tkacheve</p>
  <p className={styles.bottomschdaltxtss}>tkacheveanton@gmail.com</p>
</div>
</div>
<div className={styles.bottomendcal}>
  <Link to="/" className={styles.bottomlinkend}>My Schedule</Link>
</div>
      </div>
      <div className={styles.maincalenders02}>
 <div className={styles.calendarlist}>
  <div className={styles.maincalende11}>
    <div>
<p className={styles.calparatxt}>December 2, 2021</p>
</div>
<div className={styles.nav}>
        <img src={arrowlefts} alt=''></img>
        <img src={arrowrights} alt=''></img>
        </div>

  </div>

      <div className={styles.calenheader}>
        {days.map(day => (
          <div key={day} className={styles.calendarDay}>{day}</div>
        ))}
      </div>
      <div className={styles.calenbody}>
        {dates.map((date, index) => (
          <div key={index} className={`${styles.date} ${date === 2 ? styles.selected : ''}`}>
            {date && <div className={styles.number}>{String(date).padStart(2, '0')}</div>}
            {events[date] && (
              <div className={styles.events}>
                {events[date].map((event, i) => (
                  <div key={i} className={`${styles.schedalevent} ${styles[event.toLowerCase().replace(/\s/g, '')]}`}>
                    {event}
                  </div>
                ))}
                {events[date].length > 1 && <Link to="/myschedual02" className={styles.schedalmore}>More</Link>}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
      </div>

    </div>

      </div>
      </div>
  )
}

export default MySchedual01