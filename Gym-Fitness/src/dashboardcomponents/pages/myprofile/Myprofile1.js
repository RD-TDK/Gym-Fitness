import React, { useState, useEffect, useCallback } from 'react';
import api from '../../../api';
import styles from "./Myprofile.module.css";
import { Link, useNavigate } from 'react-router-dom';
import logoviews from "../../../../src/assets/fitnessWorkout-iconsorange.png";
import overviewimg from "../../../../src/assets/Dashbaord-icons.png";
import workoutimg from "../../../../src/assets/Workout-icons.png";
import  trainerimg from "../../../../src/assets/trainer-icons.png";
import  schedualimg from "../../../../src/assets/Schedule-icons.png";
import  profileimg  from "../../../../src/assets/profile-icons.png";
import  logoutimg from "../../../../src/assets/Logout-icons.png";
import  notify from "../../../../src/assets/notification-icon.png";
import  imgprofile from "../../../../src/assets/Avatar-photo.png";
import notifyIcon from "../../../../src/assets/notification-icon.png";
import defaultUser from "../../../../src/assets/default-user.png";


const Myprofile1 = () => {
// 通知弹窗
    const [notifications, setNotifications] = useState([]);
    const [loadingNotifications, setLoadingNotifications] = useState(false);
    const [showNotifyPopup, setShowNotifyPopup] = useState(false);

// 个人信息弹窗 & 套餐管理弹窗
    const [showProfilePopup, setShowProfilePopup] = useState(false);
    const [membership, setMembership] = useState(null);
    const [showPlanModal, setShowPlanModal] = useState(false);
    const [planType, setPlanType] = useState('BASIC');
    // Form state matches UserUpdateDTO
    const user = JSON.parse(localStorage.getItem('user')) || {};
    const storedUserId = localStorage.getItem('userId') || user.userId;
    console.log('storedUserId =', storedUserId);
    const [formData, setFormData] = useState({
        name: user.name || '',
        gender: user.gender || '',
        phoneNumber: user.phoneNumber || user.phone || '',
        address: user.address || '',
        birthday: user.birthday || ''
    });
    const [email, setEmail] = useState(user.email || '');
    const [pwData, setPwData] = useState({
        oldPassword: '',
        newPassword: '',
        confirmPassword: '',
        verificationCode: ''
    });
    // Send verification code to user's email
    const sendCode = useCallback(async () => {
        if (!email) {
            alert('Email is missing');
            return;
        }
        try {
            await api.post(`/users/sendVerificationCode?email=${encodeURIComponent(email)}`);
            alert('Verification code sent');
        } catch (err) {
            console.error('Failed to send code', err);
            alert('Error sending code: ' + (err.response?.data || err.message));
        }
    }, [email]);
    const navigate = useNavigate();

    useEffect(() => {
        async function fetchUser() {
            if (!storedUserId) return;
            try {
                const resp = await api.get(`/users/${storedUserId}`);
                const data = resp.data || {};
                console.log('fetchUser resp.data =', resp.data);
                setFormData({
                    name: data.name ?? '',
                    gender: data.gender ?? '',
                    phoneNumber: data.phoneNumber ?? data.phone ?? '',
                    address: data.address ?? '',
                    birthday: data.birthday ?? ''
                });
                // update localStorage copy so future visits have fresh data
                localStorage.setItem('user', JSON.stringify(data));
            } catch (err) {
                console.error('Failed to fetch user info', err);
            }
        }

        fetchUser();
    }, [storedUserId]);
// —— 获取通知 ——
    async function loadNotifications() {
        setLoadingNotifications(true);
        try {
            const { data } = await api.get('/notifications/unread');
            setNotifications(data);
        } catch (e) {
            console.error('通知获取失败', e);
        } finally {
            setLoadingNotifications(false);
        }
    }
    function toggleNotifyPopup() {
        if (!showNotifyPopup) loadNotifications();
        setShowNotifyPopup(v => !v);
    }
    async function markRead(notif) {
        try {
            const { data } = await api.post(`/notifications/${notif.notificationId}/read`);
            setNotifications(ns => ns.filter(n => n.notificationId !== data.notificationId));
        } catch (e) {
            console.error('标记已读失败', e);
        }
    }

// —— 获取会员信息 ——
    useEffect(() => {
        if (!user?.userId) return;
        (async () => {
            try {
                const { data } = await api.get(`memberships/users/${user.userId}`);
                setMembership({
                    membershipId: data.membershipId,
                    planType:    data.planType,
                    isActive:    data.isActive,
                    startDate:   data.startDate,
                    endDate:     data.endDate,
                });
            } catch (e) {
                console.error('拉取会员信息失败', e);
            }
        })();
    }, [user?.userId]);

    return (
        <div className={styles.headcontainer}>
            {/* Left-part */}

            <div className={styles.nextoverview01}>
                <div className={styles.overviewlogo}>
                    <h2 className={styles.overviewheader1}>Fitness</h2>
                    <img src={logoviews} alt=''></img>
                </div>
                <div className={styles.nextsection01}>

                    <div className={styles.menuItemdb1}>
                        <img src={overviewimg} alt='' className={styles.menuicon}/>
                        <Link to="/overviews" className={styles.menulinksdb}> Overview </Link>
                    </div>

                    <div className={styles.menuItemdb1}>
                        <img src={workoutimg} alt='' className={styles.menuicon}/>
                        <Link to="/history" className={styles.menulinksdb}> My Training History </Link>
                    </div>
                    <div className={styles.menuItemdb1}>
                        <img src={trainerimg} alt='' className={styles.menuicon}/>
                        <Link to="/memberlist" className={styles.menulinksdb}> Trainers </Link>
                    </div>
                    <div className={styles.menuItemdb1}>
                        <img src={schedualimg} alt='' className={styles.menuicon}/>
                        <Link to="/schedualcalmember" className={styles.menulinksdb}>My Schedule</Link>
                    </div>


                    <div className={styles.nextsection02}>

                        <div className={styles.menuItemdb01}>
                            <img src={profileimg} alt='' className={styles.menuicon}/>
                            <Link to="/myprofile" className={styles.menulinksdb}> My Profile </Link>
                        </div>
                        <div className={styles.menuItemdb01}>
                            <img src={logoutimg} alt='' className={styles.menuicon}/>
                            <Link to="/" className={styles.menulinksdb}> Logout </Link>
                        </div>
                    </div>
                </div>
            </div>
            {/* right-part */}

            <div className={styles.nextoverview02}>

                <div className={styles.topbarover}>
                    <div className={styles.topbarover01}>
                        <p className={styles.bar01}>Good Morning</p>
                        <p className={styles.bar02}>Welcome Back!</p>
                    </div>

                    <div className={styles.topbarover02}>
                        {/* 通知图标 */}
                        <img
                            src={notifyIcon}
                            alt="Notify"
                            className={styles.topnotifyimg}
                            onClick={toggleNotifyPopup}
                            style={{cursor: 'pointer'}}
                        />
                        {showNotifyPopup && (
                            <div className={styles.notifypopup1}>
                                <h3>Notifications</h3>
                                {loadingNotifications
                                    ? <p>Loading...</p>
                                    : notifications.length
                                        ? notifications.map(n => (
                                            <div key={n.notificationId} className={styles.notificationItem}>
                                                <p>{n.message}</p>
                                                <button onClick={() => markRead(n)} className={styles.viewLink}>
                                                    View
                                                </button>
                                            </div>
                                        ))
                                        : <p>No new notifications</p>}
                            </div>
                        )}

                        {/* 头像 + 昵称，触发个人信息弹窗 */}
                        <div className={styles.profileTrigger} onClick={() => setShowProfilePopup(v => !v)}>
                            <img src={defaultUser} alt="Avatar"/>
                            <span className={styles.bar03}>{user?.name || 'Member'}</span>
                        </div>
                        {showProfilePopup && (
                            <div className={styles.notifypopup1} style={{top: '60px', right: '20px'}}>
                                <h3>Member Info</h3>
                                <p><strong>Name:</strong> {user.name}</p>
                                <p><strong>Email:</strong> {user.email}</p>
                                <hr className={styles.divider}/>
                                {membership && (
                                    <>
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
                                        <p><strong>Start:</strong> {new Date(membership.startDate).toLocaleDateString()}</p>
                                        <p><strong>End:</strong> {new Date(membership.endDate).toLocaleDateString()}</p>
                                    </>
                                )}
                            </div>
                        )}
                    </div>
                </div>
                <div>
                    <h2 className={styles.profileheader}>My Profile</h2>
                </div>

                <div
                    className={styles.profilesection}
                    style={{display: 'block', width: '100%', padding: '1.5rem'}}
                >
                    <div className={styles.profilesec02}>

                        <div className={styles.accountsectitle}>General info</div>
                        <div className={styles.accountnxt1}>
                            <div className={styles.formgroupacc}>
                                <label className={styles.formlabelacc} htmlFor="fullName">Full name</label>
                                <input
                                    className={styles.forminputacc}
                                    type="text"
                                    id="fullName"
                                    value={formData.name}
                                    onChange={e => setFormData({...formData, name: e.target.value})}
                                />
                            </div>
                            <div className={styles.formgroupacc}>
                                <label className={styles.formlabelacc} htmlFor="email">Email id</label>
                                <input
                                    className={styles.forminputacc}
                                    type="email"
                                    id="email"
                                    value={email}
                                    readOnly
                                />
                            </div>
                        </div>
                        <div className={styles.accountnxt1}>
                            <div className={styles.formgroupacc}>
                                <label className={styles.formlabelacc} htmlFor="phone">Phone number</label>
                                <input
                                    className={styles.forminputacc}
                                    type="text"
                                    id="phone"
                                    value={formData.phoneNumber}
                                    onChange={e => setFormData({...formData, phoneNumber: e.target.value})}
                                />
                            </div>
                            <div className={styles.formgroupacc}>
                                <label className={styles.formlabelacc} htmlFor="address">Address</label>
                                <input
                                    className={styles.forminputacc}
                                    type="text"
                                    id="address"
                                    value={formData.address}
                                    onChange={e => setFormData({...formData, address: e.target.value})}
                                />
                            </div>
                        </div>
                        <div className={styles.accountnxt1}>
                            <div className={styles.formgroupacc}>
                                <label className={styles.formlabelacc} htmlFor="birthday">Birthday</label>
                                <input
                                    className={styles.forminputacc}
                                    type="date"
                                    id="birthday"
                                    value={formData.birthday}
                                    onChange={e => setFormData({...formData, birthday: e.target.value})}
                                />
                            </div>
                            <div className={styles.formgroupacc}>
                                <label className={styles.formlabelacc} htmlFor="gender">Gender</label>
                                <select
                                    id="gender"
                                    className={styles.forminputacc}
                                    value={formData.gender}
                                    onChange={e => setFormData({ ...formData, gender: e.target.value })}
                                >
                                    <option value="">Select Gender</option>
                                    <option value="MALE">Male</option>
                                    <option value="FEMALE">Female</option>
                                    <option value="PREFER_NOT_TO_SAY">Prefer not to say</option>
                                </select>
                            </div>
                        </div>
                        <div className={styles.formactionsCenter}>
                            <button
                                type="button"
                                className={styles.accountbtnsCenter}
                                onClick={async () => {
                                    if (!storedUserId) {
                                        alert('Cannot determine user id — please login again.');
                                        return;
                                    }
                                    // build DTO exactly as defined
                                    const updateDTO = {
                                        name: formData.name,
                                        gender: formData.gender,
                                        phoneNumber: formData.phoneNumber,
                                        address: formData.address,
                                        birthday: formData.birthday
                                    };
                                    await api.put(`/users/${storedUserId}`, updateDTO);
                                    alert('Profile updated successfully');
                                }}
                            >
                                Save Changes
                            </button>
                        </div>
                        <div className={styles.divider}></div>

                        <div className={styles.sectiontitle}>Change Password</div>

                        {/* Row 1: Old Password (half width) */}
                        <div className={styles.accountnxt1}>
                            <div className={styles.formgroupacc}>
                                <label className={styles.formlabelacc} htmlFor="oldPassword">Old Password</label>
                                <input
                                    className={styles.forminputacc}
                                    type="password"
                                    id="oldPassword"
                                    value={pwData.oldPassword}
                                    onChange={e => setPwData({ ...pwData, oldPassword: e.target.value })}
                                />
                            </div>
                            <div className={styles.formgroupacc}>
                                {/* empty to align with second column */}
                            </div>
                        </div>

                        {/* Row 2: New Password & Confirm Password */}
                        <div className={styles.accountnxt1}>
                            <div className={styles.formgroupacc}>
                                <label className={styles.formlabelacc} htmlFor="newPassword">New Password</label>
                                <input
                                    className={styles.forminputacc}
                                    type="password"
                                    id="newPassword"
                                    value={pwData.newPassword}
                                    onChange={e => setPwData({ ...pwData, newPassword: e.target.value })}
                                />
                            </div>
                            <div className={styles.formgroupacc}>
                                <label className={styles.formlabelacc} htmlFor="confirmPassword">Confirm Password</label>
                                <input
                                    className={styles.forminputacc}
                                    type="password"
                                    id="confirmPassword"
                                    value={pwData.confirmPassword}
                                    onChange={e => setPwData({ ...pwData, confirmPassword: e.target.value })}
                                />
                            </div>
                        </div>

                        {/* Row 3: Verification Code + Send Code (simpler button) */}
                        <div className={styles.accountnxt1}>
                            <div className={styles.formgroupacc}>
                                <label className={styles.formlabelacc} htmlFor="verificationCode">Verification Code</label>
                                <input
                                    className={styles.forminputacc}
                                    type="text"
                                    id="verificationCode"
                                    value={pwData.verificationCode}
                                    onChange={e => setPwData({ ...pwData, verificationCode: e.target.value })}
                                />
                            </div>
                            <div className={styles.formgroupacc}>
                                <button
                                    type="button"
                                    className={styles.accountbtns2}
                                    onClick={sendCode}
                                >
                                    Send Code
                                </button>
                            </div>
                        </div>

                        {/* Row 4: Update Password button */}
                        <div className={styles.formactionsCenter}>
                            <button
                                type="button"
                                className={styles.accountbtnsCenter}
                                onClick={async () => {
                                    if (!storedUserId) {
                                        alert('User ID missing');
                                        return;
                                    }
                                    try {
                                        await api.put(`/users/${storedUserId}/password`, pwData);
                                        alert('Password changed successfully, please login again');
                                        // Redirect to sign-in so user can re-login
                                        navigate('/signin');
                                    } catch (err) {
                                        console.error('Password change failed', err);
                                        // Display exact server error (e.g., "Old password is incorrect")
                                        const serverMsg = err.response?.data?.message || err.response?.data || err.message;
                                        alert(serverMsg);
                                    }
                                }}
                            >
                                Update Password
                            </button>
                        </div>

                    </div>
                </div>

            </div>
            {showPlanModal && (
                <div className={styles.modalOverlay}>
                    <div className={styles.modalContent}>
                        <button className={styles.modalClose} onClick={() => setShowPlanModal(false)}>×</button>
                        <h3>Update Plan</h3>
                        <div className={styles.planCards}>
                            {['BASIC','GOLD','PREMIUM'].map(p => (
                                <div
                                    key={p}
                                    className={`${styles.planCard} ${planType === p ? styles.planCardSelected : ''}`}
                                    onClick={() => setPlanType(p)}
                                >
                                    <h3>{p}</h3>
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
                            Note: The plan can only be upgraded and updated according to Basic→Gold→Premium. Downgrading is not possible
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
    )
}

export default Myprofile1