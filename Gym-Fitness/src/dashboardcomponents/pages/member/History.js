import React, { useState, useEffect } from 'react';
import styles from "../trainer/Trainer.module.css";
import { Link } from 'react-router-dom';
import api from '../../../api';
import logoviews from "../../../../src/assets/fitnessWorkout-iconsorange.png";
import overviewimg from "../../../../src/assets/Dashbaord-icons.png";
import trainerimg from "../../../../src/assets/trainer-icons.png";
import schedualimg from "../../../../src/assets/Schedule-icons.png";
import profileimg from "../../../../src/assets/profile-icons.png";
import logoutimg from "../../../../src/assets/Logout-icons.png";
import notify from "../../../../src/assets/notification-icon.png";
import imgprofile from "../../../../src/assets/Avatar-photo.png";
import searchicon from "../../../../src/assets/search-icons.png";
import { getCurrentUser } from '../../../utils/auth';

const History = () => {
    const [requests, setRequests] = useState([]);
    const currentUser = getCurrentUser();
    const memberId = currentUser ? currentUser.userId : null;

    useEffect(() => {
        if (!memberId) return;
        api.get(`/sessions/history/${memberId}`)
            .then(res => setRequests(res.data))
            .catch(err => console.error('Failed to fetch session history', err));
    }, [memberId]);

    return (
        <div className={styles.headcontainer}>
            {/* 左侧导航 */}
            <div className={styles.nextoverview01}>
                <div className={styles.overviewlogo}>
                    <h2 className={styles.overviewheader1}>Fitness</h2>
                    <img src={logoviews} alt='' />
                </div>
                <div className={styles.nextsection01}>
                    <div className={styles.menuItemdb1}>
                        <img src={overviewimg} alt='' className={styles.menuicon} />
                        <Link to="/overviews1" className={styles.menulinksdb}>Overview</Link>
                    </div>
                    <div className={styles.menuItemdb1}>
                        <img src={trainerimg} alt='' className={styles.menuicon} />
                        <Link to="/memberlists" className={styles.menulinksdb}>Member</Link>
                    </div>
                    <div className={styles.menuItemdb1}>
                        <img src={schedualimg} alt='' className={styles.menuicon} />
                        <Link to="/myschedual01" className={styles.menulinksdb}>My Schedule</Link>
                    </div>
                </div>
                <div className={styles.nextsection02}>
                    <div className={styles.menuItemdb01}>
                        <img src={profileimg} alt='' className={styles.menuicon} />
                        <Link to="/myprofile" className={styles.menulinksdb}>My Profile</Link>
                    </div>
                    <div className={styles.menuItemdb01}>
                        <img src={logoutimg} alt='' className={styles.menuicon} />
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
                        <img src={notify} alt='' />
                        <img src={imgprofile} alt='' />

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
        </div>
    );
};

export default History;
