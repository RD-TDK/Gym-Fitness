import React, { useState, useEffect }from 'react'
import styles from "./Trainer.module.css";
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import api from '../../../api';
import { getCurrentUser } from '../../../utils/auth'
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


const daysOfWeek = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];

const MySchedual01 = () => {
  const navigate = useNavigate();
  const trainerId = parseInt(localStorage.getItem('trainerId'), 10);
  /*const dates = [
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
  };*/

  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [sessions, setSessions]       = useState({});

  const handleCancel = async (sessionId) => {
    if (!window.confirm('Confirmed to cancel this class?')) return;
    try {
      // DELETE /api/sessions/{sessionId}?trainerId={trainerId}
      await api.delete(`/sessions/${sessionId}`, {
        params: { trainerId }
      });
      setSessions(prev => {
        const day = Object.keys(prev).find(d =>
            prev[d].some(s => s.sessionId === sessionId)
        );
        if (!day) return prev;
        return {
          ...prev,
          [day]: prev[day].filter(s => s.sessionId !== sessionId)
        };
      });
    } catch (err) {
      console.error(err);
      alert('Cancellation failed, please try again');
    }
  };

  const generateCalendar = (base) => {
    const year  = base.getFullYear();
    const month = base.getMonth();
    const first = new Date(year, month, 1);
    const last  = new Date(year, month + 1, 0);
    const slots = [];
    for (let i = 0; i < first.getDay(); i++) slots.push("");
    for (let d = 1; d <= last.getDate(); d++) slots.push(d);
    while (slots.length % 7 !== 0) slots.push("");
    return slots;
  };

  const prevMonth = () =>
      setCurrentMonth(d => new Date(d.getFullYear(), d.getMonth() - 1, 1));
  const nextMonth = () =>
      setCurrentMonth(d => new Date(d.getFullYear(), d.getMonth() + 1, 1));

  // 获取课程数据
  useEffect(() => {
    if (!trainerId) return;

    const year  = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const startDate = new Date(year, month, 1);
    startDate.setHours(0,0,0,0);
    const endDate   = new Date(year, month+1, 0);
    endDate.setHours(23,59,59,0);

    // ISO 字符串到秒
    const fmt = d => d.toISOString().slice(0,19);
    // [改] 直接拼 querystring，避免 axios params 报 TS 类型错
    const url = `/sessions?start=${encodeURIComponent(fmt(startDate))}` +
        `&end=${encodeURIComponent(fmt(endDate))}`;

    api.get(url)
        .then(res => {
          // [改] 过滤本教练并分组到 daysOfMonth
          const grouped = res.data
              .filter(s => s.trainerId === trainerId)
              .reduce((acc, s) => {
                const day = new Date(s.sessionDatetime).getDate();
                acc[day] = acc[day] || [];
                acc[day].push({
                  ...s,
                  formattedTime: new Date(s.sessionDatetime)
                      .toLocaleTimeString([], {hour:'2-digit',minute:'2-digit'})
                });
                return acc;
              }, {});
          setSessions(grouped);
        })
        .catch(console.error);
  }, [trainerId, currentMonth]);

  const renderCells = () => {
    const slots = generateCalendar(currentMonth);
    return slots.map((slot, idx) => {
      const has = slot && sessions[slot];
      return (
          <div key={idx} className={`${styles.date} ${!slot?styles.faded:""}`}>
            {slot && <div className={styles.number}>{slot}</div>}
            {has && (
                <div className={styles.events}>
                  {sessions[slot].map(sess => {
                    const descKey = (sess.goalDescription || "")
                        .toLowerCase()
                        .replace(/\s+/g,"");
                    return (
                        <div
                            key={sess.sessionId}
                            className={`${styles.schedalevent} ${styles[descKey] || ""}`}
                        >
                          <div className={styles.eventDesc}>
                            {sess.goalDescription || "No description"}
                          </div>
                          <div className={styles.eventTime}>
                            {sess.formattedTime}
                          </div>

                          <button
                              onClick={() => handleCancel(sess.sessionId)}
                          >
                            Cancel
                          </button>
                        </div>
                    );
                  })}
                </div>
            )}
          </div>
      );
    });
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
            <div className={styles.calendarNav}>
              <button onClick={prevMonth}>◀</button>
              <span>
           {currentMonth.toLocaleString('en-US', { month: 'long' })}
                {" "}
                {currentMonth.getFullYear()}
            </span>
              <button onClick={nextMonth}>▶</button>
            </div>
          </div>

          <div className={styles.daysHeader}>
            {daysOfWeek.map(d => (
                <div key={d} className={styles.calendarDay}>{d}</div>
            ))}
          </div>
          <div className={styles.calenbody}>
            {renderCells()}
          </div>

          <div className={styles.maincalenders}>
            <div className={styles.maincalenders01}>
              <div className={styles.smallminicalender01}>
                <img src={arrowplus} alt=''></img>
                <Link to="/create-session" className={styles.schedualtext02}> Create Schedual</Link>
              </div>



            </div>
          </div>
        </div>
      </div>
  )
}

export default MySchedual01