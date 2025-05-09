import React, { useState, useEffect } from 'react';

import styles from "./Member.module.css";
import api from '../../../api';
import logoviews from "../../../../src/assets/fitnessWorkout-iconsorange.png";
import overviewimg from "../../../../src/assets/Dashbaord-icons.png";
import workoutimg from "../../../../src/assets/Workout-icons.png";
import  trainerimg from "../../../../src/assets/trainer-icons.png";
import  schedualimg from "../../../../src/assets/Schedule-icons.png";
import  profileimg  from "../../../../src/assets/profile-icons.png";
import  logoutimg from "../../../../src/assets/Logout-icons.png";
 import  notify1 from "../../../../src/assets/notification-icon.png";
import  imgprofile from "../../../../src/assets/Avatar-photo.png";
import  yogapose from "../../../../src/assets/workout-overview.png";
import  cardworkout from "../../../../src/assets/db-workout.png";
import  cardcalories  from "../../../../src/assets/db-calories.png";
import   cardstep from "../../../../src/assets/db-steps.png";
import  cardworkout1 from "../../../../src/assets/background-workout.png";
import  cardcalories1 from "../../../../src/assets/backgoumd-calories.png";
import  cardstep1 from "../../../../src/assets/backgound-steps.png";
import  burnt from "../../../../src/assets/calories-burn.png";
import  workoutpic from "../../../../src/assets/calories-workout.png";
import  waterpic from "../../../../src/assets/calories-water.png";
import  workouticons from "../../../../src/assets/workout-arrowup.png";
import  sidearrow from "../../../../src/assets/Arrowright-orange.png";
import  yogabend from "../../../../src/assets/yoga-pose.png";
import  searchicon from "../../../../src/assets/search-icons.png";
import avatarpic from "../../../../src/assets/trainer-avatar.png";
import rightclick from "../../../../src/assets/right-click.png";
import { Link } from 'react-router-dom';




import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer
} from "recharts";
import {formatDistanceToNow} from "date-fns";



const activityData = [
  { name: 'Mon', cal: 120 },
  { name: 'Tue', cal: 210 },
  { name: 'Wed', cal: 170 },
  { name: 'Thu', cal: 250 },
  { name: 'Fri', cal: 180 },
  { name: 'Sat', cal: 220 },
  { name: 'Sun', cal: 200 },
];
  
 
const Overviews = ({ notify }) => {

  // 搜索关键词，用于 overview 页面
  const [overviewKeyword, setOverviewKeyword] = useState('');
  const [notifications, setNotifications] = useState([]);
  const [showPopup, setShowPopup] = useState(false);
  const [loading, setLoading] = useState(false);

  // 新增：存储 Top 3 教练
  const [topTrainers, setTopTrainers] = useState([]);

  useEffect(() => {
    (async () => {
      try {
        const { data } = await api.get('/trainers/search', {
          params: {
            current: 1,
            size: 3,
            sortBy: 'experience',
            sortOrder: 'desc',
            keyword: overviewKeyword
          }
        });
        setTopTrainers((data.records || []).slice(0, 3));
      } catch (err) {
        console.error('Error fetching top trainers:', err);
      }
    })();
  }, [overviewKeyword]);

    const togglePopup = () => {
        if (!showPopup) {
            fetchNotifications();
        }
        setShowPopup(prev => !prev);
    };

    const fetchNotifications = async () => {
        setLoading(true);
        try {
            const response = await api.get('/notifications/unread');
            setNotifications(response.data);
        } catch (error) {
            console.error('Failed to fetch notifications', error);
        } finally {
            setLoading(false);
        }
    };
    const handleView = async (notif) => {
        try {

            const { data: updated } = await api.post(`/notifications/${notif.notificationId}/read`);

            setNotifications(current => current.filter(n => n.notificationId !== updated.notificationId));

            window.location.reload();
        } catch (error) {
            console.error('Failed to mark notification as read', error);
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
                      <h3>Notifications</h3>
                      {loading ? (
                          <p>Loading...</p>
                      ) : notifications.length ? (
                          notifications.map(n => (
                              <div key={n.notificationId} className={styles.notificationItem}>
                                  <div className={styles.textContent}>
                                      <p>{n.message}</p>
                                      <button
                                          onClick={() => handleView(n)}
                                          className={styles.viewLink}
                                      >
                                          View
                                      </button>
                                      <span className={styles.timestamp}>
                    {formatDistanceToNow(new Date(n.createdAt))} ago
                  </span>
                                  </div>
                              </div>
                          ))
                      ) : (
                          <p>No new notifications</p>
                      )}
          </div>
      )}
    </div>


            <img src={imgprofile} alt=''></img>
            <span className={styles.bar03} >Member name</span>
          </div>
        </div>
      
      {/* rightside-next down part */}

      <div className={styles.rightdownpart} >
        <div className={styles.rightdownpart01}>
          <div className={styles.rightdowntextpart}>
          <img className={styles.rightdownpic} src={yogapose} alt=''></img> 
             <div className={styles.textparts}>
            <h2 className={styles.rightdownhead1}>Track Your Daily Activities</h2>
            <p className={styles.rightdowntext1}>Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do 
              eiusmod Lorem ipsum dolor sit amet, consectetur adipisicing elit,
               sed do eiusmod </p> 
               </div>
          </div>
        
        <div className={styles.rightdowncardspart} >

        <div className={styles.rightbgdown}>
<img src={cardworkout1} className={styles.rightimgcards} alt=''></img>

  </div>    
        <div className={styles.rightdowncardspart01}>           
          <img src={cardworkout} alt=''></img>
          <div>
          <p className={styles.rightdowncardstexts01}>Workout</p>
          <p className={styles.rightdowncardstexts02}>4 hrs</p>
          </div>
        </div>
        <div>

        <div className={styles.rightbgdown1}>
<img src={cardcalories1} className={styles.rightimgcards} alt=''></img>

  </div> 
        <div className={styles.rightdowncardspart02}>
        <img src={cardcalories} alt=''></img>
          <div>
          <p className={styles.rightdowncardstexts01}>calories</p>
          <p className={styles.rightdowncardstexts02}>1800 kcl</p>
          </div>

        </div>
        </div>
        <div>

        <div className={styles.rightbgdown2}>
<img src={cardstep1} className={styles.rightimgcards} alt=''></img>

  </div> 
        <div className={styles.rightdowncardspart03}>
        <img src={cardstep} alt=''></img>
          <div>
          <p className={styles.rightdowncardstexts01}>Steps</p>
          <p className={styles.rightdowncardstexts02}>2200 steps</p>
          </div>
          </div>
        </div>

        </div>


{/* charts */}


      <div className={styles.rightdowncharts}>

   {/* Left Panel */}
   <div className={styles.leftPanel}>
    <h2 className={styles.panelheader2}>Total workout Hours </h2>
        <div className={styles.dateTabs}>
          <button className={styles.activeTab01}>Today</button>
          <button className={styles.activeTab01}>Week</button>
          <button className={styles.activeTab01}>Month</button>
        </div>

        <div className={styles.dateRow}>
          {["1", "2", "3", "4", "5", "6", "7"].map((d, i) => (
            <button key={i} className={ styles.activeDate}>
              {d}  <br /> Feb
            </button>
          ))}
        </div>

        <div className={styles.calories}>
          <h4 className={styles.calorieshead01}>Calories</h4>
          <div className={styles.calsmalprt}>
            <img src={burnt} alt=''></img>
          <h3 className={styles.calorieshead2} >Total Calories burned</h3>
          </div>
          <div className={styles.circular}>
            <div className={styles.smallcircular} > 
            <span className={styles.calValue}>3,600</span>
            <span className={styles.calValue1}>cal</span>
            </div>
          </div>
          <p className={styles.calnote}>
            These numbers are based on distance and weight
          </p>
        </div>

        <div className={styles.endsummary}>
          <div className={styles.summaryItem}>
            <h5 className={styles.bottomsummary}>Workout</h5>
            <img src={workoutpic} className={styles.bottomsummarypic} alt=''></img>
              <p className={styles.bottomspansummary}>3 <span className={styles.bottomsp} >Hours</span></p>
          </div>
          <div className={styles.summaryItem1}>
            <h5 className={styles.bottomsummary}>Water</h5>
            <img src={waterpic} className={styles.bottomsummarypic} alt=''></img>
              <p className={styles.bottomspansummary}>3/5  <span className={styles.bottomsp}>liters</span></p>
          </div>
        </div>
      </div>

      {/* Right Panel */}
      <div className={styles.rightPanel}>
      <h2 className={styles.rightheader01}>Activity</h2>

        <div className={styles.rightheader}>

          <div className={styles.percentage}>
            <div className={styles.smallpart011}>
            <img src={workouticons} alt='' ></img>
<h3 className={styles.smallpartheader01}>37%</h3>
</div>
<div>
<p className={styles.smallpartpara01}>Vs. Yesterday</p>
</div>
</div>
          
         
          <div className={styles.burnInfo}>
            <p className={styles.smallspnpart}>93 <span className={styles.smallpartpara01}> Kcal</span></p>
            <p className={styles.smallpartpara01}>Burned</p>
          </div>

          <div className={styles.dailyAvg}>
          <p className={styles.smallspnpart}>3 <span className={styles.smallpartpara01}> Kcal</span></p>
          <p className={styles.smallpartpara01}>Daily Avg</p>
          </div>
        </div>

        <ResponsiveContainer width="80%" height={170}>
          <BarChart data={activityData}>
            <XAxis dataKey="name" />
            <YAxis hide />
            <Tooltip />
            <Bar dataKey="cal" fill="#F47521" barSize={12} radius={[10, 10, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>

        <div className={styles.calDetails}>
          <div className={styles.calendDetails}>402 <span className={styles.calspnDetails}>cal</span>  <span className={styles.calspnDetails}>• Running - 4.3%</span></div>
          <div className={styles.calendDetails}>402 <span className={styles.calspnDetails}>cal</span> <span className={styles.calspnDetails}>• Running - 4.3%</span></div>
          <div className={styles.calendDetails}>402 <span className={styles.calspnDetails}>cal</span> <span className={styles.calspnDetails}>• Running - 4.3%</span></div>
        </div>
      </div>
      </div>


        </div>
        <div className={styles.rightdownpart02}>
          <div className={styles.rightcorner01} >
          <div >
          <h2 className={styles.rightschedual01}>Today's schedule</h2>
          </div>
          <div className={styles.smallcorner}>
            <Link to="/schedual" className={styles.rightlinkschedual}>View All</Link>
            <img src={sidearrow} alt=''></img>
          </div>
          </div>

          <div className={styles.rightcorner02}>
          <h2 className={styles.rightschedual01}>Yoga</h2>
          <div className={styles.smallcorner01}>
          <img src={yogabend} alt=''></img>
<div>
  <p className={styles.smalltraintexts}>Trainee</p>
  <p className={styles.smalltraintexts}>08:00 AM-9:00AM</p>
</div>
<button className={styles.smallbtn01}> <Link to="/overviews" className={styles.completedlink} >Completed</Link> </button>
          </div>
          </div>

          <div className={styles.rightcorner02}>
          <h2 className={styles.rightschedual01}>Yoga</h2>
          <div className={styles.smallcorner01}>
          <img src={yogabend} alt=''></img>
<div>
  <p className={styles.smalltraintexts}>Trainee</p>
  <p className={styles.smalltraintexts}>08:00 AM-9:00AM</p>
</div>
<button className={styles.smallbtn02}> <Link to="/schedual" className={styles.completedlink} >Join class </Link> </button>
          </div>
          </div>
        
          <div className={styles.rightcorners1} >
          <div >
          <h2 className={styles.rightschedual01}>Trainers</h2>
          </div>
          <div className={styles.smallcorner}>
            <Link to="/memberlist" className={styles.rightlinkschedual}>View All</Link>
            <img src={sidearrow} alt=''></img>
          </div>
          </div>

<div className={styles.searchpart}>
  <input className={styles.searchinput} type='text' placeholder='Search'></input>
  <img src={searchicon} alt=''></img>
</div>


{topTrainers.map(trainer => (
  <div key={trainer.trainerId} className={styles.smallcorner03}>
    <div className={styles.minicorner}>
      <img src={trainer.photo || avatarpic} alt={trainer.name} />
      <div>
        <p className={styles.smalltraintext01}>{trainer.name}</p>
        <p className={styles.smalltraintext02}>{trainer.specialty}</p>
      </div>
    </div>
    <button className={styles.smallbtn02}>
      <Link to="/schedualcalmember" className={styles.completedlink}>Connect</Link>
    </button>
  </div>
))}

          <button className={styles.smallbtn03}> <Link to="/schedualcalmember" className={styles.seealllink} >See all </Link> </button>

       {/* package */}

       <div className={styles.overviewpackage}>
        <h2 className={styles.packageoverview}>MID PACKAGE</h2>

        <div className={styles.packagelists}>
        <img src={rightclick} alt=''></img>
<p className={styles.packagetexts}>Unlimited Gym Access</p>
        </div>
        <div className={styles.packagelists}>
        <img src={rightclick} alt=''></img>
<p className={styles.packagetexts}>7x Fitness Consultant</p>
        </div> <div className={styles.packagelists}>
        <img src={rightclick} alt=''></img>
<p className={styles.packagetexts}>Nutrition Tracking</p>
        </div> <div className={styles.packagelists}>
        <img src={rightclick} alt=''></img>
<p className={styles.packagetexts}>5x Free Suplement</p>
        </div> <div className={styles.packagelists}>
        <img src={rightclick} alt=''></img>
<p className={styles.packagetexts}>Gym Card</p>
        </div> <div className={styles.packagelists}>
        <img src={rightclick} alt=''></img>
<p className={styles.packagetexts}>Personal Trainer</p>
        </div>

        <button className={styles.packagebtn}> <Link className={styles.packagelink} to="/signin" >cancel Now</Link></button>

       </div>

        </div>

      </div>

      </div>

    </div>
  )
}

export default Overviews