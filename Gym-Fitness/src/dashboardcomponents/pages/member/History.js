import React, { useState, useEffect } from 'react';
import styles from "../member/Member.module.css";
import { Link } from 'react-router-dom';
import notify from "../../../../src/assets/notification-icon.png";
import defaultUser from "../../../../src/assets/default-user.png";
import api from '../../../api';
import logoviews from "../../../../src/assets/fitnessWorkout-iconsorange.png";
import overviewimg from "../../../../src/assets/Dashbaord-icons.png";
import trainerimg from "../../../../src/assets/trainer-icons.png";
import schedualimg from "../../../../src/assets/Schedule-icons.png";
import profileimg from "../../../../src/assets/profile-icons.png";
import logoutimg from "../../../../src/assets/Logout-icons.png";
import searchicon from "../../../../src/assets/search-icons.png";
import { getCurrentUser } from '../../../utils/auth';
import workoutimg from "../../../assets/Workout-icons.png";

const History = () => {
    const [requests, setRequests] = useState([]);
    // Notification and profile popup states
    const [showNotify, setShowNotify] = useState(false);
    const [notifications, setNotifications] = useState([]);
    const [showProfilePopup, setShowProfilePopup] = useState(false);
    // Membership info states (copied from Overviews.js)
    const [membership, setMembership] = useState(null);
    const [showPlanModal, setShowPlanModal] = useState(false);
    const [planType, setPlanType] = useState('BASIC');
    const currentUser = getCurrentUser();
    const memberId = currentUser ? currentUser.userId : null;

    useEffect(() => {
        if (!memberId) return;
        api.get(`/sessions/history/${memberId}`)
            .then(res => setRequests(res.data))
            .catch(err => console.error('Failed to fetch session history', err));
    }, [memberId]);

    // Fetch membership info (copied from Overviews.js)
    useEffect(() => {
        const fetchMembership = async () => {
            try {
                const { data } = await api.get(
                    `memberships/users/${memberId}`,
                    { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
                );
                setMembership({
                    membershipId: data.membershipId,
                    planType    : data.planType,
                    isActive    : data.isActive,
                    startDate   : data.startDate,
                    endDate     : data.endDate
                });
            } catch (err) {
                console.error('Failed to fetch membership via user endpoint', err);
            }
        };
        if (memberId) fetchMembership();
    }, [memberId]);

    // Notification fetching logic
    const fetchNotifications = async () => {
        try {
            const res = await api.get('/notifications/unread');
            setNotifications(res.data);
        } catch (err) {
            console.error(err);
        }
    };
    const toggleNotify = () => {
        if (!showNotify) fetchNotifications();
        setShowNotify(prev => !prev);
        setShowProfilePopup(false);
    };
    const toggleProfilePopup = () => {
        setShowProfilePopup(prev => !prev);
        setShowNotify(false);
    };

    return (
        <div className={styles.headcontainer}>
            {/* 左侧导航 */}
            <div className={styles.nextoverview01}>
                <div className={styles.overviewlogo}>
                    <h2 className={styles.overviewheader1}>Fitness</h2>
                    <img src={logoviews} alt='' />
                </div>
                <div className={styles.menuItemdb1}>
                    <img src={overviewimg} alt='' className={styles.menuicon} />
                    <Link to= "/overviews" className={styles.menulinksdb}> Overview </Link>
                </div>

                <div className={styles.menuItemdb1}>
                    <img src={workoutimg} alt='' className={styles.menuicon} />
                    <Link to= "/history" className={styles.menulinksdb}> My Training History </Link>
                </div>
                <div className={styles.menuItemdb1}>
                    <img src={trainerimg} alt='' className={styles.menuicon} />
                    <Link to= "/memberlist" className={styles.menulinksdb}> Trainers </Link>
                </div>
                <div className={styles.menuItemdb1}>
                    <img src={schedualimg} alt='' className={styles.menuicon}/>
                    <Link to="/schedualcalmember" className={styles.menulinksdb}>My Schedule</Link>
                </div>

                <div className={styles.nextsection02}>
                    <div className={styles.menuItemdb01}>
                        <img src={profileimg} alt='' className={styles.menuicon}/>
                        <Link to="/myprofile" className={styles.menulinksdb}>My Profile</Link>
                    </div>
                    <div className={styles.menuItemdb01}>
                        <img src={logoutimg} alt='' className={styles.menuicon}/>
                        <Link to="/" className={styles.menulinksdb}>Logout</Link>
                    </div>
                </div>
            </div>

            {/* 右侧内容 */}
            <div className={styles.nextoverview02}>
                <div className={styles.topbarover}>
                    <div className={styles.topbarover01}>
                        <p className={styles.bar01}>Good Morning</p>
                        <p className={styles.bar02}>Welcome Back!</p>
                    </div>
                <div className={styles.topbarover02}>
                  {/* Notification icon and popup */}
                  <img src={notify} alt='notifications' className={styles.topnotifyimg}
                      onClick={toggleNotify} />
                  {showNotify && (
                    <div className={styles.notifypopup1}>
                      <h3>Notifications</h3>
                      {notifications.length ? notifications.map(n => (
                        <div key={n.notificationId} className={styles.notificationItem}>
                          <div className={styles.textContent}>
                            <p>{n.message}</p>
                            <button className={styles.viewLink} onClick={() => {/* mark read */}}>View</button>
                            <span className={styles.timestamp}>
                              {/* time ago */}
                            </span>
                          </div>
                        </div>
                      )) : <p>No new notifications</p>}
                    </div>
                  )}
                  <div className={styles.profileTrigger} onClick={toggleProfilePopup}>
                    <img src={defaultUser} alt='User avatar' />
                    <span className={styles.bar03}>{currentUser?.name || 'Member'}</span>
                  </div>
                  {showProfilePopup && (
                    <div className={styles.notifypopup1} style={{ right: '20px', top: '60px' }}>
                      <h3>Member Info</h3>
                      <p><strong>Name:</strong> {currentUser?.name}</p>
                      <p><strong>Email:</strong> {currentUser?.email}</p>
                      <hr className={styles.divider}/>
                      {membership && (
                        <div className={styles.membershipInfo}>
                          <h4>Membership Details</h4>
                          <p><strong>ID:</strong> {membership.membershipId}</p>
                          <p><strong>Plan:</strong> {membership.planType}</p>
                          <button
                            className={styles.membershipBtn}
                            onClick={() => setShowPlanModal(true)}
                          >
                            Manage Plan
                          </button>
                          <p><strong>Active:</strong> {membership.isActive ? 'Yes' : 'No'}</p>
                          <p>
                            <strong>Start:</strong> {membership.startDate ? new Date(membership.startDate).toLocaleDateString() : ''}
                          </p>
                          <p>
                            <strong>End:</strong> {membership.endDate ? new Date(membership.endDate).toLocaleDateString() : ''}
                          </p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
                </div>

                <div className={styles.Memberlistsection}>
                    <h2 className={styles.memberheader01}>Session List</h2>
                    <div className={styles.membertwobtns}>
                        <div className={styles.membertwobtns02}>
                        </div>
                        <div className={styles.membertwobtns01}>
                            <input className={styles.memberinput} type='text' placeholder='Search' />
                            <img src={searchicon} alt='' />
                        </div>
                    </div>

                    {/* 请求列表表格，只保留四列，平均分布 */}
                    <div className={styles.membertablesection}>
                        <table className={styles.membermaintable}>
                            <thead className={styles.membermainthread}>
                            <tr className={styles.membertr1}>
                                <th
                                    className={styles.memberth}
                                    style={{ width: '25%', textAlign: 'center' }}
                                >
                                    Session ID
                                </th>
                                <th
                                    className={styles.memberth}
                                    style={{ width: '25%', textAlign: 'center' }}
                                >
                                    Session Description
                                </th>
                                <th
                                    className={styles.memberth}
                                    style={{ width: '25%', textAlign: 'center' }}
                                >
                                   Duration
                                </th>
                                <th
                                    className={styles.memberth}
                                    style={{ width: '25%', textAlign: 'center' }}
                                >
                                    Status
                                </th>

                            </tr>
                            </thead>
                            <tbody>
                            {requests.map(req => (
                                <tr key={req.sessionId} className={styles.membertr}>
                                    <td
                                        className={styles.membertd}
                                        style={{ textAlign: 'center' }}
                                    >
                                        {req.sessionId}
                                    </td>
                                    <td
                                        className={styles.membertd}
                                        style={{ textAlign: 'center' }}
                                    >
                                       {req.goalDescription}
                                    </td>
                                    <td
                                        className={styles.membertd}
                                        style={{ textAlign: 'center' }}
                                    >
                                       {req.duration}
                                    </td>
                                    <td
                                        className={styles.membertd}
                                        style={{ textAlign: 'center', display: 'flex', justifyContent: 'center', gap: '0.5rem' }}
                                    >
                                        {req.status}
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>

                </div>
            </div>
        {/* Plan Modal */}
        {showPlanModal && (
          <div className={styles.modalOverlay}>
            <div className={styles.modalContent}>
              <button
                className={styles.modalClose}
                onClick={() => setShowPlanModal(false)}
              >
                ×
              </button>
              <h3>Update Plan</h3>
              <div className={styles.planCards}>
                {['BASIC','GOLD','PREMIUM'].map(p => (
                  <div
                    key={p}
                    className={`${styles.planCard} ${
                      planType === p ? styles.planCardSelected : ''
                    }`}
                    onClick={() => setPlanType(p)}
                  >
                    <h3>{p.charAt(0)+p.slice(1).toLowerCase()}</h3>
                    <p className={styles.planDescription}>
                      {p === 'BASIC'
                        ? 'Access to gym equipment and group classes.'
                        : p === 'GOLD'
                        ? 'Includes Basic, one personal session per month.'
                        : 'All Premium benefits plus unlimited training.'}
                    </p>
                  </div>
                ))}
              </div>
              <p className={styles.upgradeNote}>
                  Note: The plan can only be upgraded and updated according to Basic-&gt; Gold-&gt; Premium. Downgrading is not possible
              </p>
              <button
                className={`${styles.signInButton} ${styles.fullWidthButton}`}
                onClick={async () => {
                  try {
                    await api.post('/memberships/update', { planType });
                    setShowPlanModal(false);
                    window.location.reload();
                  } catch (err) {
                    console.error('更新套餐失败', err);
                  }
                }}
              >
                Update Plan
              </button>
            </div>
          </div>
        )}
    </div>
    );
};

export default History;
