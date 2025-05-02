import { useState } from "react";
import styles from "./Member.module.css";
import { Link } from 'react-router-dom';
import logoviews from "../../../../src/assets/fitnessWorkout-iconsorange.png";
import overviewimg from "../../../../src/assets/Dashbaord-icons.png";
import workoutimg from "../../../../src/assets/Workout-icons.png";
import  trainerimg from "../../../../src/assets/trainer-icons.png";
import  schedualimg from "../../../../src/assets/Schedule-icons.png";
import  profileimg  from "../../../../src/assets/profile-icons.png";
import  logoutimg from "../../../../src/assets/Logout-icons.png";
import  notify from "../../../../src/assets/notification-icon.png";
import  imgprofile from "../../../../src/assets/Avatar-photo.png";
import  arrowdown from "../../../../src/assets/downarrow-icon.png";
 import  arrowplus from "../../../../src/assets/plus-icon.png";
 import  arrowlefts from "../../../../src/assets/Arrow - lefts2.png";
 import  arrowrights from "../../../../src/assets/Arrow -rights2.png";
 import  arrowedits from "../../../../src/assets/Edit-icons.png";
 import  arrowdelete from "../../../../src/assets/Delete-icos.png";
 import   badgeIcon from "../../../../src/assets/popup-badge.png";

 


 const Schedualcalendrsone = () => {
  const [isOpen, setIsOpen] = useState(false);

  const handleToggle = () => {
    setIsOpen(!isOpen);
  };

  // report & summary

  const [showPopups, setShowPopups] = useState(false);
  const [showPopup2, setShowPopup2] = useState(false);

  const handleReportClick = (e) => {
    e.preventDefault(); // prevent Link navigation
    setShowPopups(true);
  };

  const handleClosePopup = () => {
    setShowPopups(false);
    setShowPopup2(false); // ensure inner popup is also closed
  };

  const togglePopup = () => {
    setShowPopup2((prev) => !prev);
  };






  //  reshedual


  const [showPopup, setShowPopup] = useState(false);

  const handlePopupOpen = (e) => {
    e.preventDefault();
    setShowPopup(true);
  };

  const handlePopupClose = () => {
    setShowPopup(false);
  };

  // cancle

  const [showPopup1, setShowPopup1] = useState(false);

  const handleCancelClick = () => {
    setShowPopup1(true);
  };

  const handleClose1 = () => {
    setShowPopup1(false);
  };


  // Delete

    const [isOpens, setIsOpens] = useState(false);
  
    const handleDeleteClick = () => {
      setIsOpens(true);
    };
  
    const handleClose = () => {
      setIsOpens(false);
    };
  
    const handleConfirmDelete = () => {
      // Handle actual delete logic here
      setIsOpens(false);
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
<div className={styles.mainschedual11} >
      <div className={styles.smallminischedual}>
        <p className={styles.schedualtext01}> Weekly</p>
        <img src={arrowdown} alt=''></img>
        </div>
        <div className={styles.smallminicalender01}>
      <img src={arrowplus} alt=''></img>
        <Link to="/" className={styles.schedualtext02}> Create Schedual</Link>
        </div>
        </div>
    </div>

    <div className={styles.maincalende12}>
    <div>
<p className={styles.calparatxt}>December 2, 2021</p>
</div>
<div className={styles.nav}>
        <img src={arrowlefts} alt=''></img>
        <img src={arrowrights} alt=''></img>
        </div>
  </div>
  
  <div  className={styles.schedualparttwomain}>
  <div className={styles.schedualpartcaltwo}>
  <div className={styles.calendarparttwo}>
    <div className={styles.headerparttwo}>
      <div>Sun</div>
      <div>Mon</div>
      <div>Tue</div>
      <div>Wed</div>
      <div>Thu</div>
      <div>Fri</div>
      <div>Sat</div>
    </div>

    <div className={styles.timeSlotstwo}>
      {["9AM-10AM", "10AM-11AM", "11AM-12PM", "12PM-1PM", "1PM-2PM"].map((time, idx) => (
        <div key={idx} className={styles.timeSlotcaltwo}>
          <div className={styles.timeparttwo}>{time}</div>
          <div className={styles.eventsparttwo}>
            {/* Placing events manually based on the time */}
            {time === "9AM-10AM" && (
              <>
                <div className={`${styles.eventparttwos} ${styles.mon}`}>
                <div className={styles.dropdownContainercal}>
      <div className={styles.titleparts01} onClick={handleToggle}>
        ...
      </div>

      {isOpen && (
        <div className={styles.dropdownMenucal}>
        <>
      <div className={styles.dropdownItemcal}>
        <img src={arrowedits} alt='' />
        <Link to="/" className={styles.dropdwncallink01} onClick={handleReportClick}>
          Report
        </Link>
      </div>

      {showPopups && (
        <div className={styles.popupOverlayreport}>
          <div className={styles.popupCardreport} onClick={handleClosePopup}>
            <img src={badgeIcon} alt="Badge" className={styles.badgeIconreport} />
            <h2 className={styles.popupheadreport}>Workout Complete</h2>
            <p className={styles.streakreport}><span className={styles.streakspanreport}>Streak:</span> 10 days</p>

            <div className={styles.progressBarContainerreport}>
              <div className={styles.progressBarreport}>
                <div className={styles.progressreport} style={{ width: '70%' }}></div>
              </div>
              <span className={styles.progressTextreport}>70%</span>
            </div>

            <div className={styles.detailsreport}>
              <div className={styles.textreporttwo}><p className={styles.popuptxtsreport}>Exercise Completed:</p> <strong className={styles.popupstrongreport}>6</strong></div>
              <div className={styles.textreporttwo}><p className={styles.popuptxtsreport}>Duration:</p> <strong className={styles.popupstrongreport}>45 minutes</strong></div>
              <div className={styles.textreporttwo}><p className={styles.popuptxtsreport}>Calories burned:</p> <strong className={styles.popupstrongreport}>356 kcal</strong></div>
              <div className={styles.textreporttwo}><p className={styles.popuptxtsreport}>Weight lifted:</p> <strong className={styles.popupstrongreport}>1000 lbs</strong></div>
              <div className={styles.textreporttwo}><p className={styles.popuptxtsreport}>TUT accuracy:</p> <strong className={styles.popupstrongreport}>68%</strong></div>
            </div>

            <div>
              <button className={styles.summaryButtonreport} onClick={(e) => {
                e.stopPropagation(); // prevent closing parent popup
                togglePopup();
              }}>
                See full Summary
              </button>
            </div>

            {showPopup2 && (
              <div className={styles.popupOverlaysummary} onClick={(e) => e.stopPropagation()}>
                <div className={styles.popupsummary} onClick={togglePopup}>
                  <h2 className={styles.popupheadsummary}>Workout summary</h2>
                  <div className={styles.progressBarContainersummary}>
                    <div className={styles.progressBarsummary} style={{ width: '70%' }} />
                  </div>
                  <p className={styles.progressTextsummary}>70%</p>

                  <div className={styles.textreporttwo}><p className={styles.popuptxtsreport}>Overall reps:</p> <strong className={styles.popupstrongreport}>20 reps</strong></div>
                  <div className={styles.textreporttwo}><p className={styles.popuptxtsreport}>Overall sets:</p> <strong className={styles.popupstrongreport}>45 minutes</strong></div>
                  <div className={styles.textreporttwo}><p className={styles.popuptxtsreport}>Total calories count:</p> <strong className={styles.popupstrongreport}>356 kcal</strong></div>
                  <div className={styles.textreporttwo}><p className={styles.popuptxtsreport}>TUT accuracy</p> <strong className={styles.popupstrongreport}>68%</strong></div>
                  <h3 className={styles.popupheadsummary01}>Exercises completed</h3>
                  {[1, 2, 3].map((_, i) => (
                    <div className={styles.exerciseCardsummary} key={i}>
                      <h4 className={styles.popupheadsummary01}>Push ups</h4>
                      <div className={styles.textreporttwo}>
                        <div>
                        <p className={styles.popuptxtsreport}>Day:</p> 
                        <strong className={styles.popupstrongreport}>Monday</strong>  </div>
                        <div>
                        <p className={styles.popuptxtsreport}>Duration:</p> 
                        <strong className={styles.popupstrongreport}>115</strong>  </div>
                        <div>
                        <p className={styles.popuptxtsreport}>Exercise:</p> 
                        <strong className={styles.popupstrongreport}>5</strong>  </div>
                        <div>
                        <p className={styles.popuptxtsreport}>TUT:</p> 
                        <strong className={styles.popupstrongreport}>60%</strong>  </div>
                        {/* <div>
                        <p className={styles.popuptxtsreport}>Calories count:</p> 
                        <strong className={styles.popupstrongreport}>3 kcal</strong>  </div> */}
                        </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </>

    <div className={styles.reshedualcontainer}>
      <div className={styles.dropdownItemcal}>
        <img src={arrowedits} alt="" />
        <Link className={styles.dropdwncallink01} to="/" onClick={handlePopupOpen}>
          Reschedule
        </Link>
      </div>

      {showPopup && (
        <div className={styles.popupOverlayreshedual}>
          <div className={styles.popupContentreshedual}>
            <div className={styles.headerreshedual}>
              <h2>Reschedule class</h2>
              <button className={styles.closeButtonreshedual} onClick={handlePopupClose}>×</button>
            </div>

            <div className={styles.badgereshedual}>Fitness class</div>

            <div className={styles.classInforeshedual}>
              <h3>John Deo</h3>
              <p>Thursday, December 5<br />12:00pm - 1:00pm<br />Time zone - Original time</p>
            </div>

            <input
              className={styles.inputFieldreshedual}
              type="text"
              placeholder="Reschedule reason"
            />
            <input
              className={styles.inputFieldreshedual}
              type="text"
              placeholder="Select reschedule date & time"
            />

            <div className={styles.availabilitySectionreshedual}>
              <h4>John Deo : Classes availability</h4>
              <p>Friday, December 5 &nbsp; 12:00pm - 1:00pm</p>
              <p>Friday, December 5 &nbsp; 5:00pm - 6:00pm</p>
            </div>

            <div className={styles.buttonGroupreshedual}>
              <button className={styles.closeButtonSecondaryreshedual} onClick={handlePopupClose}>
                Close
              </button>
              <button className={styles.submitButtonreshedual}>Submit</button>
            </div>
          </div>
        </div>
      )}
    </div>


    <div className={styles.dropdownItemcal}>
    <img src={arrowedits} alt="" />
    <button className={styles.dropdwncallink01} onClick={handleCancelClick}>
        Cancel
      </button>

      {showPopup1 && (
        <div className={styles.popupOverlaycancle}>
          <div className={styles.popupBoxcancle}>
            <div className={styles.headercancle}>
              <h2>Cancel class</h2>
              <button className={styles.closeButtoncancle} onClick={handleClose1}>×</button>
            </div>
            <div className={styles.tagcancle}>Fitness class</div>
            <div className={styles.detailscancle}>
              <p className={styles.namecancle}>John Doe</p>
              <p>Thursday, December 5</p>
              <p>12:00pm - 1:00pm</p>
              <p>Time zone - Original time</p>
            </div>
            <p className={styles.confirmTextcancle}>Are you sure, you want cancel this class today?</p>
            <div className={styles.buttonGroupcancle}>
              <button className={styles.noButtoncancle} onClick={handleClose1}>No</button>
              <button className={styles.yesButtoncancle}>Yes, Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>


          <div className={styles.dropdownItemcal}>
          <img src={arrowdelete} alt=''></img>
      <button className={styles.dropdwncallink01} onClick={handleDeleteClick}>Delete</button>

      {isOpens && (
        <div className={styles.popupOverlaydelete}>
          <div className={styles.popupContainerdelete}>
            <div className={styles.popupHeaderdelete}>
              <h3>Delete class</h3>
              <button className={styles.closeButtondelete} onClick={handleClose}>×</button>
            </div>
            <div className={styles.popupContentdelete}>
              <span className={styles.classTagdelete}>Fitness class</span>
              <p className={styles.instructordelete}>John Deo</p>
              <p>Thursday, December 5 &nbsp; 12:00pm - 1:00pm</p>
              <p>Time zone - Original time</p>
              <p className={styles.confirmText}>Are you sure, you want delete this class permanently?</p>
              <div className={styles.buttonGroupdelete}>
                <button className={styles.closeBtndelete} onClick={handleClose}>Close</button>
                <button className={styles.deleteBtndelete} onClick={handleConfirmDelete}>Yes, Delete</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>

        </div>
      )}
    </div>
                  <div className={styles.titleparttwo}>Fitness class</div>
                  <div className={styles.trainerparttwo}>Sarah Anderson</div>
                  <button className={styles.joinparttwo}>Join class</button>
                </div>

                <div className={`${styles.eventparttwo} ${styles.wed}`}>
                <div className={styles.titleparts01}>...</div>
                  <div className={styles.titleparttwo}>Fitness class</div>
                  <div className={styles.trainerparttwo}>Sarah Anderson</div>
                  <button className={styles.joinparttwo}>Join class</button>
                </div>
              </>
            )}
            {time === "11AM-12PM" && (
              <div className={`${styles.eventparttwo} ${styles.mon}`}>
                                <div className={styles.titleparts01}>...</div>
                <div className={styles.titleparttwo}>Fitness class</div>
                <div className={styles.trainerparttwo}>Sarah Anderson</div>
                <button className={styles.joinparttwo}>Join class</button>
              </div>
            )}
            {time === "12PM-1PM" && (
              <div className={`${styles.eventparttwo} ${styles.tue}`}>
                                <div className={styles.titleparts01}>...</div>
                <div className={styles.titleparttwo}>Fitness class</div>
                <div className={styles.trainerparttwo}>Sarah Anderson</div>
                <button className={styles.joinparttwo}>Join class</button>
              </div>
            )}
            {time === "1PM-2PM" && (
              <div className={`${styles.eventparttwo} ${styles.thu}`}>
                                <div className={styles.titleparts01}>...</div>
                <div className={styles.titleparttwo}>Fitness class</div>
                <div className={styles.trainerparttwo}>Sarah Anderson</div>
                <button className={styles.joinparttwo}>Join class</button>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  </div>
</div>
</div>

      </div>
      </div>
    

  )
}

export default Schedualcalendrsone