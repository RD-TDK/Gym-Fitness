import React, { useState, useEffect } from 'react';
import styles from "./Trainer.module.css";
import { Link } from 'react-router-dom';
import api from '../../../api';
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
import  newarrowdown from "../../../../src/assets/NewArrow - Down.png";

const trainer = Array.from({ length: 6 }, () => ({
  name: 'Arorra gaur',
  email: 'Arorra@gmail.com',
  phonenumber: '+49 587 2547',
  gender: 'Male',
  workouts: 'Yoga, Zumba, Gymnastic',
}));

const Memberlists = () => {
  const [requests, setRequests] = useState([]);
  const [showPopup, setShowPopup] = useState(false);
  const trainerId = parseInt(localStorage.getItem('trainerId'), 10);

  useEffect(() => {
    if (!trainerId) return;
    api.get(`/requests/trainers/${trainerId}`)
        .then(res => setRequests(res.data))
        .catch(err => console.error('Failed to fetch requests', err));
  }, [trainerId]);

  const handleReview = (requestId, status) => {
    api.put(`/requests/${requestId}`, { status })
        .then(res => {
          setRequests(prev =>
              prev.map(r => r.requestId === requestId ? res.data : r)
          );
        })
        .catch(err => console.error('Failed to update request', err));
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
{/* 
      <div className={styles.menuItemdb1}>
        <img src={workoutimg} alt='' className={styles.menuicon} />
        <Link to= "/overviews" className={styles.menulinksdb}> Workout </Link>
      </div> */}
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
        
        <div className={styles.Memberlistsection}>
          <h2 className={styles.memberheader01}> Members List </h2>
          <div className={styles.membertwobtns}>
<div className={styles.membertwobtns02}>
  <Link to="/memberlists" className={styles.Memberlinklist}>Members Requests</Link>
  <Link to="/memberlists" className={styles.Memberlinklist}>Approved members</Link>
  <Link to="/memberlists" className={styles.Memberlinklist}>Rejected members</Link>


</div>

<div className={styles.membertwobtns01}>
<input className={styles.memberinput} type='text' placeholder='Search'></input>
<img src={searchicon} alt=''></img>
 
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
              <span className={styles.newmembspn}>Phone Number</span> 
              <img src={newarrowdown} alt=''></img>

            </div>
            </th>   
            <th className={styles.memberth}>
            <div className={styles.newmembrth}>
              <span className={styles.newmembspn}>Gender</span> 
              <img src={newarrowdown} alt=''></img>

            </div>
            </th>          
            <th className={styles.memberth}>
            <div className={styles.newmembrth}>
              <span className={styles.newmembspn}>Interested Workout</span> 
            </div>
            </th>   
            <th className={styles.memberth}>
            <div className={styles.newmembrth}>
              <span className={styles.newmembspn}>Action</span> 
            </div>
            </th>   
          </tr>
        </thead>
        <tbody>
        {requests.map(req => (
            <tr key={req.requestId} className={styles.membertr}>
              <td className={styles.membertd}>{req.memberId}</td>
              <td className={styles.membertd}>{req.sessionId}</td>
              <td className={styles.membertd}>{req.status}</td>
              <td className={styles.membertd}>
                {req.status === 'PENDING' && (
                    <>
                      <button
                          className={styles.membertablebtns}
                          onClick={() => handleReview(req.requestId, 'APPROVED')}
                      >
                        Accept
                      </button>
                      <button
                          className={styles.membertablebtns01}
                          onClick={() => handleReview(req.requestId, 'REJECTED')}
                      >
                        Reject
                      </button>
                      <div
                          className={styles.lastmemberthree}
                          onClick={() => setShowPopup(true)}
                      >
                        …
                      </div>
                    </>
                )}
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

export default Memberlists