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
 import  trainerinfoprofile from "../../../../src/assets/trainer-info.png";
 import email from "../../../../src/assets/email.png";
 import phone from "../../../../src/assets/phone.png";
 import address from "../../../../src/assets/location.png";






const MemberList01 = () => {
    // 状态钩子：请求数据、搜索关键字和状态过滤
    const [rawRequests, setRawRequests] = useState([]);
    const [requests, setRequests] = useState([]);
    const [filter, setFilter] = useState('');
    const [statusFilter] = useState('APPROVED');
    const trainerId = parseInt(localStorage.getItem('trainerId'), 10);

    // 页面加载时获取请求列表
    useEffect(() => {
        if (!trainerId) return;
        api.get(`/requests/trainers/${trainerId}`)
            .then(res => setRawRequests(res.data))
            .catch(err => console.error('Failed to fetch requests', err));
    }, [trainerId]);

    const displayed = rawRequests
        .filter(r => r.status === statusFilter)
        .filter(r =>
            // 简单示例：在任一 ID 上包含搜索关键词
            filter === '' ||
            r.requestId.toString().includes(filter) ||
            r.memberId.toString().includes(filter) ||
            r.sessionId.toString().includes(filter)
        );


    return (
        <div className={styles.headcontainer}>
            {/* Left-part */}
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
            {/* Right-part */}
            <div className={styles.nextoverview02}>
                <div className={styles.topbarover}>
                    <div className={styles.topbarover01}>
                        <p className={styles.bar01}>Good Morning</p>
                        <p className={styles.bar02}>Welcome Back!</p>
                    </div>
                    <div className={styles.topbarover02}>
                        <img src={notify} alt='' />
                        <img src={imgprofile} alt='' />
                        <span className={styles.bar03}>Trainer Dashboard</span>
                    </div>
                </div>
                <div className={styles.mainmembertwos}>
                    <div className={styles.mainmembertwo01}>
                        <div className={styles.Memberlistsection01}>
                            <h2 className={styles.memberheader01}>Members List</h2>
                            <div className={styles.membertwobtns}>
                                <div className={styles.membertwobtns02}>
                                    <Link to="/memberlists" className={styles.Memberlinklist}>Members Requests</Link>
                                    <Link to="/memberlists" className={styles.Memberlinklist}>Approved members</Link>
                                    <Link to="/memberlists" className={styles.Memberlinklist}>Rejected members</Link>
                                </div>
                                <div className={styles.membertwobtns0101}>
                                    <input
                                        className={styles.memberinput}
                                        type='text'
                                        placeholder='Search'
                                        value={filter}
                                        onChange={e => setFilter(e.target.value)}
                                    />
                                    <img src={searchicon} alt='' />
                                </div>
                            </div>
                            {/* memberlist01-table */}
                            <div className={styles.member01tablenxtcontnr}>
                                <div className={styles.member01tableheader}>
                                    <div className={styles.member01tableheaderitem}>Name</div>
                                    <div className={styles.member01tableheaderitem}>Email</div>
                                    <div className={styles.member01tableheaderitem}>Number</div>
                                    <div className={styles.member01tableheaderitem}>Gender</div>
                                    <div className={styles.member01tableheaderitem}>Actions</div>
                                </div>
                                {displayed.map(req => (
                                    <div key={req.requestId} className={styles.member01tablerow}>
                                        <div className={styles.member01tablerowitemmember01tableuser}>
                                            <img src={trainerprofile} alt='avatar' className={styles.avatar} />
                                            <span className={styles.member01tableusername}>{req.requestId}</span>
                                        </div>
                                        <div className={styles.member01tablerowitem}>{req.memberId}</div>
                                        <div className={styles.member01tablerowitem}>{req.sessionId}</div>
                                        <div className={styles.member01tablerowitem}>{req.status}</div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                    <div className={styles.mainmembertwo02}>
                        <div className={styles.mainmembertwosub02}>
                            <img src={trainerinfoprofile} alt='avatar' className={styles.avtarinfos} />
                            <h2 className={styles.mebsubhead}>Arrora gaur</h2>
                            <p className={styles.mebsubpara}>Male</p>
                            <Link to='/' className={styles.mebsublink}>Approved</Link>
                        </div>
                        <div className={styles.mainmembertwosub03}>
                            <h2 className={styles.mebsubhead}>Profile Info</h2>
                            <div className={styles.mainmembertwosubs11}>
                                <img src={email} alt='avatar' className={styles.emailinfo} />
                                <p className={styles.mebsubtxtpara}><Link to='/' className={styles.mebsublinkmail}>Email:</Link> arroragaur@gmail.com</p>
                            </div>
                            <div className={styles.mainmembertwosubs11}>
                                <img src={phone} alt='avatar' className={styles.emailinfo} />
                                <p className={styles.mebsubtxtpara}><Link to='/' className={styles.mebsublinkmail}>Phone:</Link> +49 587 2547</p>
                            </div>
                            <div className={styles.mainmembertwosubs11}>
                                <img src={phone} alt='avatar' className={styles.emailinfo} />
                                <p className={styles.mebsubtxtpara}><Link to='/' className={styles.mebsublinkmail}>Date of Birth:</Link> 6 April 1997</p>
                            </div>
                            <div className={styles.mainmembertwosubs11}>
                                <img src={address} alt='avatar' className={styles.emailinfo} />
                                <p className={styles.mebsubtxtpara}><Link to='/' className={styles.mebsublinkmail}>Address:</Link> 2239 Hog Camp Road</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MemberList01