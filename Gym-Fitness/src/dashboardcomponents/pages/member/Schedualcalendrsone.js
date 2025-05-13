import React, { useState, useEffect } from "react";
import {
    startOfWeek,
    endOfWeek,
    addWeeks,
    format,
    parseISO,
    getDay,
    getHours
} from "date-fns";
import styles from "./Member.module.css";
import { Link } from "react-router-dom";
import api from "../../../api";
import { getCurrentUser } from '../../../utils/auth'
import logoviews    from "../../../../src/assets/fitnessWorkout-iconsorange.png";
import overviewimg  from "../../../../src/assets/Dashbaord-icons.png";
import workoutimg   from "../../../../src/assets/Workout-icons.png";
import trainerimg   from "../../../../src/assets/trainer-icons.png";
import schedualimg  from "../../../../src/assets/Schedule-icons.png";
import profileimg   from "../../../../src/assets/profile-icons.png";
import logoutimg    from "../../../../src/assets/Logout-icons.png";
import notify       from "../../../../src/assets/notification-icon.png";
import imgprofile   from "../../../../src/assets/Avatar-photo.png";
import arrowdown    from "../../../../src/assets/downarrow-icon.png";
import arrowplus    from "../../../../src/assets/plus-icon.png";
import arrowlefts   from "../../../../src/assets/Arrow - lefts2.png";
import arrowrights  from "../../../../src/assets/Arrow -rights2.png";
import badgeIcon    from "../../../../src/assets/popup-badge.png";
import notifyIcon from "../../../../src/assets/notification-icon.png";
import defaultUser from "../../../../src/assets/default-user.png";

const Schedualcalendrsone = () => {
    // 当前登录用户
    const user = JSON.parse(localStorage.getItem('user'));

// 通知弹窗
    const [notifications, setNotifications] = useState([]);
    const [loadingNotifications, setLoadingNotifications] = useState(false);
    const [showNotifyPopup, setShowNotifyPopup] = useState(false);

// 个人信息弹窗 & 套餐管理弹窗
    const [showProfilePopup, setShowProfilePopup] = useState(false);
    const [membership, setMembership] = useState(null);
    const [showPlanModal, setShowPlanModal] = useState(false);
    const [planType, setPlanType] = useState('BASIC');
    // —— 弹窗和菜单状态 ——
    const [isOpen, setIsOpen]         = useState(false);
    const [showPopups, setShowPopups] = useState(false);
    const [showPopup2, setShowPopup2] = useState(false);
    const [showPopup, setShowPopup]   = useState(false);
    const [showPopup1, setShowPopup1] = useState(false);
    const [isOpens, setIsOpens]       = useState(false);
    const [openMenuSessionId, setOpenMenuSessionId] = useState(null);
    const currentUser = getCurrentUser();
    const memberId = currentUser ? currentUser.userId : null;

    // —— 新增：加入课程理由弹窗状态 ——
    const [showJoinModal, setShowJoinModal] = useState(false);
    const [joinReason, setJoinReason] = useState("");
    const [joinSessionId, setJoinSessionId] = useState(null);

    // —— 翻周状态 ——
    const [currentWeekStart, setCurrentWeekStart] = useState(
        startOfWeek(new Date(), { weekStartsOn: 1 })
    );

    // —— 本周课程列表 ——
    const [sessions, setSessions] = useState([]);
    //const memberId = parseInt(localStorage.getItem("memberId"), 10);

    // —— 星期和时段定义 ——
    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const timeSlots = [
        { label: "10AM-11AM", startHour: 10, endHour: 11 },
        { label: "11AM-12PM", startHour: 11, endHour: 12 },
        { label: "12PM-1PM",  startHour: 12, endHour: 13 },
        { label: "1PM-2PM",   startHour: 13, endHour: 14 },
        { label: "2PM-3PM",   startHour: 14, endHour: 15 },
        // …如有更多时段请继续补充
    ];

    // —— 每次 currentWeekStart 改变时，拉取那一周的数据 ——
    useEffect(() => {
        const weekStart = currentWeekStart;
        const weekEnd   = endOfWeek(currentWeekStart, { weekStartsOn: 1 });
        const startStr  = weekStart.toISOString();
        const endStr    = weekEnd.toISOString();

        api.get("/sessions", {
            params: { start: startStr, end: endStr }
        })
            .then(res => setSessions(res.data))
            .catch(err => console.error("Failed to get this week's lesson", err));
    }, [currentWeekStart]);
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

    // —— 翻到上一周/下一周 ——
    const showPrevWeek = () => setCurrentWeekStart(w => addWeeks(w, -1));
    const showNextWeek = () => setCurrentWeekStart(w => addWeeks(w, +1));

    // —— 加入课程 ——
    const handleJoin = sessionId => {
        api.post(`/requests/sessions/${sessionId}`, { memberId })
            .then(() => alert("Request sent, awaiting tutor review"))
            .catch(err => {
                console.error("Join request failed:", err.response || err);
                alert(`Failed to send request：${err.response?.status} ${err.response?.data?.message || ""}`);
            });
    };

    const submitJoinRequest = async () => {
        try {
            await api.post(
                `/requests/sessions/${joinSessionId}`,
                { memberId, reason: joinReason }
            );
            alert("Request sent, awaiting tutor review");
            setShowJoinModal(false);
            setJoinReason("");
        } catch (err) {
            console.error("Join request failed:", err.response || err);
            alert(`Failed to send request：${err.response?.status} ${err.response?.data?.message || ""}`);
        }
    };

    // —— 弹窗逻辑 ——
    const handleReportClick   = () => setShowPopups(true);
    const handleClosePopup    = () => { setShowPopups(false); setShowPopup2(false); };
    const togglePopup         = () => setShowPopup2(prev => !prev);
    const handlePopupOpen     = () => setShowPopup(true);
    const handlePopupClose    = () => setShowPopup(false);
    const handleCancelClick   = () => setShowPopup1(true);
    const handleClose1        = () => setShowPopup1(false);
    const handleDeleteClick   = () => setIsOpens(true);
    const handleCloseDelete   = () => setIsOpens(false);
    const handleConfirmDelete = () => { setIsOpens(false); };

    return (
        <div className={styles.headcontainer}>
            {/* —— 左侧导航栏 —— */}
            <div className={styles.nextoverview01}>
                <div className={styles.overviewlogo}>
                    <h2 className={styles.overviewheader1}>Fitness</h2>
                    <img src={logoviews} alt="" />
                </div>
                <div className={styles.nextsection01}>
                    <div className={styles.menuItemdb1}>
                        <img src={overviewimg} className={styles.menuicon} alt="" />
                        <Link to="/overviews" className={styles.menulinksdb}>Overview</Link>
                    </div>
                    <div className={styles.menuItemdb1}>
                        <img src={workoutimg} alt='' className={styles.menuicon}/>
                        <Link to="/history" className={styles.menulinksdb}> My Training History </Link>
                    </div>
                    <div className={styles.menuItemdb1}>
                        <img src={trainerimg} className={styles.menuicon} alt=""/>
                        <Link to="/memberlist" className={styles.menulinksdb}>Trainers</Link>
                    </div>
                    <div className={styles.menuItemdb1}>
                        <img src={schedualimg} alt='' className={styles.menuicon}/>
                        <Link to="/schedualcalmember" className={styles.menulinksdb}>My Schedule</Link>
                    </div>
                    <div className={styles.nextsection02}>
                        <div className={styles.menuItemdb01}>
                            <img src={profileimg} className={styles.menuicon} alt=""/>
                            <Link to="/myprofile" className={styles.menulinksdb}>My Profile</Link>
                        </div>
                        <div className={styles.menuItemdb01}>
                            <img src={logoutimg} className={styles.menuicon} alt="" />
                            <Link to="/" className={styles.menulinksdb}>Logout</Link>
                        </div>
                    </div>
                </div>
            </div>

            {/* —— 右侧内容区 —— */}
            <div className={styles.nextoverview02}>
                {/* 顶部栏 */}
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
                                        <p><strong>Start:</strong> {new Date(membership.startDate).toLocaleDateString()}
                                        </p>
                                        <p><strong>End:</strong> {new Date(membership.endDate).toLocaleDateString()}</p>
                                    </>
                                )}
                            </div>
                        )}
                    </div>
                </div>

                {/* —— 日历头 & 翻周 —— */}
                <div className={styles.mainschedual}>
                    <h2 className={styles.schedualheader01}>Calendar</h2>

                    <div className={styles.calendarNav}>
                        <img
                            src={arrowlefts}
                            alt="Prev Week"
                            onClick={showPrevWeek}
                            style={{cursor: "pointer"}}
                        />
                        <span className={styles.weekRange}>
              {format(currentWeekStart, "MMM d")} –{" "}
                            {format(endOfWeek(currentWeekStart, {weekStartsOn: 1}), "MMM d")}
            </span>
                        <img
                            src={arrowrights}
                            alt="Next Week"
                            onClick={showNextWeek}
                            style={{cursor: "pointer"}}
                        />
                    </div>

                    <div className={styles.createSchedule}>
                        <img src={arrowplus} alt=""/>
                        <Link to="/schedual" className={styles.schedualtext02}>
                            Create Schedule
                        </Link>
                    </div>
                </div>

                {/* —— 周视图主体 —— */}
                <div className={styles.schedualparttwomain}>
                    <div className={styles.schedualpartcaltwo}>
                        <div className={styles.calendarparttwo}>
                            {/* 星期标题 */}
                            <div className={styles.headerparttwo}>
                                {days.map(d => (
                                    <div key={d}>{d}</div>
                                ))}
                            </div>

                            {/* 时段 × 星期 */}
                            <div className={styles.timeSlotstwo}>
                                {timeSlots.map(({ label, startHour, endHour }) => (
                                    <div key={label} className={styles.timeSlotcaltwo}>
                                        <div className={styles.timeparttwo}>{label}</div>
                                        <div className={styles.eventsparttwo}>
                                            {days.map((_, dayIdx) => {
                                                const matches = sessions.filter(sess => {
                                                    const dt = parseISO(sess.sessionDatetime);
                                                    return (
                                                        getDay(dt) === dayIdx &&
                                                        getHours(dt) >= startHour &&
                                                        getHours(dt) < endHour
                                                    );
                                                });
                                                return (
                                                    <div key={dayIdx} className={styles.eventItem}>
                                                        {matches.map(session => (
                                                            <div
                                                                key={session.sessionId}
                                                                className={styles.eventCard}
                                                            >
                                                                <div className={styles.cardHeader}>
                                  <span>
                                    {session.goalDescription ||
                                    "Fitness class"}
                                  </span>
                                                                    <div
                                                                        onClick={() =>
                                                                            setOpenMenuSessionId(
                                                                                openMenuSessionId === session.sessionId ? null : session.sessionId
                                                                            )
                                                                        }
                                                                        style={{ cursor: 'pointer' }}
                                                                    >
                                                                        …
                                                                    </div>
                                                                    {openMenuSessionId === session.sessionId && (
                                                                        <div
                                                                            className={styles.dropdownMenucal}
                                                                        >
                                                                            <div onClick={handleReportClick}>
                                                                                Report
                                                                            </div>
                                                                            <div onClick={handlePopupOpen}>
                                                                                Reschedule
                                                                            </div>
                                                                            <div onClick={handleCancelClick}>
                                                                                Cancel
                                                                            </div>
                                                                            <div onClick={handleDeleteClick}>
                                                                                Delete
                                                                            </div>
                                                                        </div>
                                                                    )}
                                                                </div>
                                                                <p className={styles.trainerparttwo}>
                                                                    Coach: {session.trainerId}
                                                                </p>
                                                                <button
                                                                    className={styles.joinparttwo}
                                                                    onClick={() => {
                                                                        // 修改：点击按钮先打开输入理由弹窗，而非直接调用 API
                                                                        setJoinSessionId(session.sessionId);
                                                                        setShowJoinModal(true);
                                                                    }}
                                                                >
                                                                    Join class
                                                                </button>
                                                            </div>
                                                        ))}
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {showJoinModal && (
                            <div
                                className={styles.modalOverlay}  // 需要在 Member.module.css 中新增样式
                                onClick={() => setShowJoinModal(false)}
                            >
                                <div
                                    className={styles.modalContent}  // 需要在 Member.module.css 中新增样式
                                    onClick={e => e.stopPropagation()}
                                >
                                    <h3 style={{ color: '#333' }}>Please enter your training objectives</h3>
                                    <textarea
                                        value={joinReason}
                                        onChange={e => setJoinReason(e.target.value)}
                                        placeholder="For example, I want to improve my back strength"
                                    />
                                    <div className={styles.modalActions}>
                                        <button onClick={() => setShowJoinModal(false)}>Cancel</button>
                                        <button
                                            disabled={!joinReason.trim()}
                                            onClick={submitJoinRequest}
                                        >
                                            Submit
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}
                        {/* —— 弹窗部分（保留原逻辑） —— */}
                        {showPopups && (
                            <div
                                className={styles.popupOverlayreport}
                                onClick={handleClosePopup}
                            >
                                <div
                                    className={styles.popupCardreport}
                                    onClick={e => e.stopPropagation()}
                                >
                                    <img
                                        src={badgeIcon}
                                        className={styles.badgeIconreport}
                                        alt=""
                                    />
                                    <h2 className={styles.popupheadreport}>
                                        Workout Complete
                                    </h2>
                                    {/* …详情略… */}
                                    <button onClick={togglePopup}>
                                        See full Summary
                                    </button>
                                    {showPopup2 && (
                                        <div
                                            className={styles.popupOverlaysummary}
                                            onClick={e => e.stopPropagation()}
                                        >
                                            {/* …Full Summary … */}
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                        {showPopup && (
                            <div className={styles.popupOverlayreshedual}>
                                {/* …Reschedule 弹窗… */}
                                <button onClick={handlePopupClose}>Close</button>
                            </div>
                        )}
                        {showPopup1 && (
                            <div className={styles.popupOverlaycancle}>
                                {/* …Cancel 弹窗… */}
                                <button onClick={handleClose1}>Close</button>
                            </div>
                        )}
                        {isOpens && (
                            <div className={styles.popupOverlaydelete}>
                                {/* …Delete 确认弹窗… */}
                                <button onClick={handleCloseDelete}>Close</button>
                                <button onClick={handleConfirmDelete}>
                                    Yes, Delete
                                </button>
                            </div>
                        )}
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
    );
};

export default Schedualcalendrsone;
