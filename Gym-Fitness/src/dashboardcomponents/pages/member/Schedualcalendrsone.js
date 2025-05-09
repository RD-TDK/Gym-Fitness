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

const Schedualcalendrsone = () => {
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
                        <img src={workoutimg} className={styles.menuicon} alt="" />
                        <Link to="/overviews" className={styles.menulinksdb}>Workout</Link>
                    </div>
                    <div className={styles.menuItemdb1}>
                        <img src={trainerimg} className={styles.menuicon} alt="" />
                        <Link to="/memberlist" className={styles.menulinksdb}>Trainers</Link>
                    </div>
                    <div className={styles.menuItemdb1}>
                        <img src={schedualimg} className={styles.menuicon} alt="" />
                        <Link to="/schedual" className={styles.menulinksdb}>My Schedule</Link>
                    </div>
                    <div className={styles.nextsection02}>
                        <div className={styles.menuItemdb01}>
                            <img src={profileimg} className={styles.menuicon} alt="" />
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
                        <img src={notify} alt="" />
                        <img src={imgprofile} alt="" />
                        <span className={styles.bar03}>Member name</span>
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
                            style={{ cursor: "pointer" }}
                        />
                        <span className={styles.weekRange}>
              {format(currentWeekStart, "MMM d")} –{" "}
                            {format(endOfWeek(currentWeekStart, { weekStartsOn: 1 }), "MMM d")}
            </span>
                        <img
                            src={arrowrights}
                            alt="Next Week"
                            onClick={showNextWeek}
                            style={{ cursor: "pointer" }}
                        />
                    </div>

                    <div className={styles.createSchedule}>
                        <img src={arrowplus} alt="" />
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
                                                                    onClick={() =>
                                                                        handleJoin(session.sessionId)
                                                                    }
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
        </div>
    );
};

export default Schedualcalendrsone;
