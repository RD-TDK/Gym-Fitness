import React, { useState, useEffect } from 'react';
import styles from "./Trainer.module.css";
import api from '../../../api';
import { getCurrentUser } from '../../../utils/auth'
import logoviews from "../../../../src/assets/fitnessWorkout-iconsorange.png";
import overviewimg from "../../../../src/assets/Dashbaord-icons.png";
import  trainerimg from "../../../../src/assets/trainer-icons.png";
import  schedualimg from "../../../../src/assets/Schedule-icons.png";
import  profileimg  from "../../../../src/assets/profile-icons.png";
import  logoutimg from "../../../../src/assets/Logout-icons.png";
import  notify1 from "../../../../src/assets/notification-icon.png";
import  imgprofile from "../../../../src/assets/Avatar-photo.png";
import { Link } from 'react-router-dom';
 import  cardworkout from "../../../../src/assets/db-workout.png";
 import  cardcalories  from "../../../../src/assets/db-calories.png";
 import   cardstep from "../../../../src/assets/db-steps.png";
 import  cardworkout1 from "../../../../src/assets/background-workout.png";
 import  cardcalories1 from "../../../../src/assets/backgoumd-calories.png";
 import  cardstep1 from "../../../../src/assets/backgound-steps.png";
//  import  arrowplus from "../../../../src/assets/plus-icon.png";
import  sidearrow from "../../../../src/assets/Arrowright-orange.png";
import  searchicon from "../../../../src/assets/search-icons.png";
import  arrowlefts from "../../../../src/assets/Arrow - lefts2.png";
import  arrowrights from "../../../../src/assets/Arrow -rights2.png";
import avatarpic from "../../../../src/assets/trainer-avatar.png";




const Overviews1 = ({ notify }) => {

  const [showPopup, setShowPopup] = useState(false);
    const user = JSON.parse(localStorage.getItem('user'));
    console.log('User id:', user.userId);
  const togglePopup = () => {
    setShowPopup(!showPopup);
  };

  const [memberCount, setMemberCount] = useState(0);
  const [classCount, setClassCount] = useState(0);
  const [loadingCount, setLoadingCount] = useState(true);
  const currentUser = getCurrentUser();
  const trainerId = currentUser ? currentUser.userId : null;
  const userName = currentUser?.name || 'Member';

    useEffect(() => {
        if (!trainerId) return;
        const fetchMemberCount = async () => {
            try {
                const { data } = await api.get(`/requests/trainers/${trainerId}`);
                // 过滤已批准请求，去重 memberId
                const approved = data.filter(r => r.status === 'APPROVED');
                const uniqueIds = new Set(approved.map(r => r.memberId));
                setMemberCount(uniqueIds.size);
                const uniqueSessions = new Set(approved.map(r => r.sessionId));
                setClassCount(uniqueSessions.size);
            } catch (error) {
                console.error('获取会员列表失败：', error);
            } finally {
                setLoadingCount(false);
            }
        };
        fetchMemberCount();
    }, [trainerId]);

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

      {/* <div className={styles.menuItemdb1}>
        <img src={workoutimg} alt='' className={styles.menuicon} />
        <Link to= "/overviews" className={styles.menulinksdb}> Workout </Link>
      </div> */}
      <div className={styles.menuItemdb1}>
        <img src={trainerimg} alt='' className={styles.menuicon} />
        <Link to= "/memberlists" className={styles.menulinksdb}> Members </Link>
      </div>
      <div className={styles.menuItemdb1}>
        <img src={schedualimg} alt='' className={styles.menuicon} />
        <Link to= "/myschedual01" className={styles.menulinksdb}> My Schedule </Link>
      </div>


      <div className={styles.nextsection02}>

      <div className={styles.menuItemdb01}>
        <img src={profileimg} alt='' className={styles.menuicon} />
        <Link to= "/myprofile1" className={styles.menulinksdb}> My Profile </Link>
      </div>
      <div className={styles.menuItemdb01}>
        <img src={logoutimg} alt='' className={styles.menuicon} />
        <Link to= "/login" className={styles.menulinksdb}> Logout </Link>
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

            {/* pop-up1 */}
          <div className={styles.notifypopcontainer}>
      <img
        src={notify1}
        className={styles.topnotifyimg}
        alt=''
        onClick={togglePopup}
      />

      {showPopup && (
        <div className={styles.notifypopup1}>
          <h3>NOTIFICATIONS</h3>

          <div className={styles.notificationItem}>
            <img src={avatarpic} className={styles.userImg} alt='' />
            <div className={styles.textContent}>
              <p><strong>Clifford Hale</strong> Sent you a message</p>
              <p>This handy tool helps you create dummy text</p>
              <a href="/">View message</a>
              <span>2 hours ago</span>
            </div>
          </div>

          <div className={`${styles.notificationItem} `}>
            <div className={styles.circleIcon}>L</div>
            <div className={styles.textContent}>
              <p><strong>Lifford Hale</strong> Fitness class</p>
              <p>Next workout class is today at 11AM</p>
              <a href="/">View and join</a>
              <span>2 hours ago</span>
            </div>
          </div>

          <div className={styles.notificationItem}>
            <img src={avatarpic} className={styles.userImg} alt='' />
            <div className={styles.textContent}>
              <p><strong>Clifford Hale</strong> Sent you a message</p>
              <p>This handy tool helps you create dummy text</p>
              <a href="/">View message</a>
              <span>2 hours ago</span>
            </div>
          </div>
        </div>
      )}
    </div>


            <img src={imgprofile} alt=''></img>
            <span className={styles.bar03} >{userName}</span>
          </div>
        </div>

      {/* rightdown */}
      <div className={styles.trainercarsect} >
        <div className={styles.trainersec01}>
        <div className={styles.rightdowncardspart} >

<div className={styles.rightbgdown}>
<img src={cardworkout1} className={styles.rightimgcards} alt=''></img>
</div>

<div className={styles.rightdowncardspart01}>
  <img src={cardworkout} alt=''></img>
  <div>
  <p className={styles.rightdowncardstexts01}>Total Members</p>
      <p className={styles.rightdowncardstexts02}>{loadingCount ? 'Loading...' : memberCount}</p>
  </div>
</div>

<div>

<div className={styles.rightbgdown2}>
<img src={cardstep1} className={styles.rightimgcards} alt=''></img>
</div>
<div className={styles.rightdowncardspart03}>
<img src={cardstep} alt=''></img>
  <div>
  <p className={styles.rightdowncardstexts01}>Total Classes</p>
  <p className={styles.rightdowncardstexts02}> {loadingCount ? 'Loading...' : classCount}</p>
  </div>
  </div>
</div>

</div>


        </div>
        <div className={styles.trainersec02}>
        <div className={styles.maincalenders011}>
          <div className={styles.traincalenders02}>

        <div className={styles.schedualcalender}>
      <div className={styles.schedualheader11}>
        <span className={styles.dechead}>May, 2025</span>
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
            "", "", "", "", "1", "2", "3",
            "4", "5", "6", "7", "8", "9", "10",
            "11", "12", "13", "14", "15", "16", "17",
            "18", "19", "20", "21", "22", "23", "24",
            "25", "26", "27", "28", "29", "30", "31"
        ].map((day, index) => (
          <div
            key={index}
            className={`${styles.caldate} ${day === "14" ? styles.active : ""}`}
          >
            {day}
          </div>

        ))}

      </div>

    </div>
    <div className={styles.smallminicalender01}>
    <Link to="/myschedual01" className={styles.schedualtext02}> My Schedule</Link>
</div>
</div>
    <div className={styles.nextcalender01}>
    <div className={styles.rightcorner01} >
          <div >
          <h2 className={styles.rightschedual01}>Members</h2>
          </div>
          <div className={styles.smallcorner}>
            <Link to="/schedual" className={styles.rightlinkschedual}>View All</Link>
            <img src={sidearrow} alt=''></img>
          </div>
          </div>
          <div className={styles.searchpart}>
  <input className={styles.searchinput} type='text' placeholder='Search'></input>
  <img src={searchicon} alt=''></img>
</div>
    </div>
  </div>

  <div className={styles.smallcorner03}>
  <div className={styles.minicorner} >
    <div>
          <img src={avatarpic} alt=''></img>
          </div>
<div>
  <p className={styles.smalltraintext01}>Alex</p>
  <p className={styles.smalltraintext02}>Fitness, Boxing</p>
</div>
</div>
          </div>

          <div className={styles.smallcorner03}>
  <div className={styles.minicorner} >
    <div>
          <img src={avatarpic} alt=''></img>
          </div>
<div>
  <p className={styles.smalltraintext01}>Alex</p>
  <p className={styles.smalltraintext02}>Fitness, Boxing</p>
</div>
</div>
          </div>
          <div className={styles.smallcorner03}>
  <div className={styles.minicorner} >
    <div>
          <img src={avatarpic} alt=''></img>
          </div>
<div>
  <p className={styles.smalltraintext01}>Alex</p>
  <p className={styles.smalltraintext02}>Fitness, Boxing</p>
</div>
</div>
          </div>
          <div className={styles.smallcorner03}>
  <div className={styles.minicorner} >
    <div>
          <img src={avatarpic} alt=''></img>
          </div>
<div>
  <p className={styles.smalltraintext01}>Alex</p>
  <p className={styles.smalltraintext02}>Fitness, Boxing</p>
</div>
</div>
          </div>

        </div>
      </div>

        </div>
        </div>

  )
}

export default Overviews1