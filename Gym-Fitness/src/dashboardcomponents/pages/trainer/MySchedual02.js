import { useState } from "react";
import styles from "./Trainer.module.css";

import { Link } from 'react-router-dom';
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
 import  arrowlefts from "../../../../src/assets/Arrow - lefts2.png";
 import  arrowrights from "../../../../src/assets/Arrow -rights2.png";
 import  arrowedits from "../../../../src/assets/Edit-icons.png";
 import  arrowdelete from "../../../../src/assets/Delete-icos.png";

 


const MySchedual02 = () => {

  const [isOpen, setIsOpen] = useState(false);

  const handleToggle = () => {
    setIsOpen(!isOpen);
  };


  // popup-view
  const members = [
    { name: 'Eddie Lobanovskiy', email: 'laboanovskiy@gmail.com' },
    { name: 'Alexey Stave', email: 'alexeyst@gmail.com' },
    { name: 'Eddie Lobanovskiy', email: 'laboanovskiy@gmail.com' },
    { name: 'Alexey Stave', email: 'alexeyst@gmail.com' },
    { name: 'Eddie Lobanovskiy', email: 'laboanovskiy@gmail.com' },
  ];


  const [showPopup, setShowPopup] = useState(false);

  const togglePopup = () => {
    setShowPopup(!showPopup);
  };


  // popup-edit

  const [isPopupOpen, setPopupOpen] = useState(false);

  const openPopup = () => setPopupOpen(true);
  const closePopup = () => setPopupOpen(false);


  // popup-delete

  const [showPopupss, setShowPopupss] = useState(false);

  const handleDeleteClick = () => {
    setShowPopupss(true);
  };

  const closePopups = () => {
    setShowPopupss(false);
  };

  const confirmDelete = () => {
    // Add deletion logic here
    console.log('Class deleted');
    setShowPopup(false);
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
      <Link to= "/memberlists" className={styles.menulinksdb}> Members </Link>
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
        
        <div>
      <div className={styles.dropdownItemcal} onClick={togglePopup}>
        <img src={arrowedits} alt="" />
        <Link to="" className={styles.dropdwncallink01}>View</Link>
      </div>

      {showPopup && (
        <div className={styles.popupOverlayview}>
          <div className={styles.popupview}>
            <div className={styles.headerview}>
              <h3 className={styles.titleview}>View Class details</h3>
              <button className={styles.closeBtnview} onClick={togglePopup}>✕</button>
            </div>
            <div className={styles.classTagview}>Fitness class</div>
            <div className={styles.classDetailsview}>
              <p className={styles.instructorview}>John Deo</p>
              <p>Thursday, December 5</p>
              <p>12:00pm - 1:00pm</p>
              <p>Time zone - Original time</p>
            </div>
            <div className={styles.membersSectionview}>
              <input className={styles.searchInputview} placeholder="Search" />
              <div className={styles.membersListview}>
                {members.map((member, index) => (
                  <div key={index} className={styles.memberRowview}>
                    <div className={styles.memberInfoview}>
                      <img className={styles.avatarview} src={`https://ui-avatars.com/api/?name=${member.name}`} alt="" />
                      <div>
                        <div className={styles.memberNameview}>{member.name}</div>
                        <div className={styles.memberEmailview}>{member.email}</div>
                      </div>
                    </div>
                    <button className={styles.reportBtnview}>Add report</button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>




    <div className={styles.containeredit}>
      <div className={styles.dropdownItemcal}>
      <img src={arrowedits} alt="" />
      <Link to="" className={styles.dropdwncallink01} onClick={openPopup}>Edit</Link>
      </div>

      {isPopupOpen && (
        <div className={styles.popupOverlayedit}>
          <div className={styles.popupedit}>
            <div className={styles.headeredit}>
              <h2>View Class details</h2>
              <button className={styles.closeBtnedit} onClick={closePopup}>X</button>
            </div>
            <div className={styles.sectionedit}>
              <span className={styles.tagedit}>Fitness class</span>
              <p>John Deo</p>
              <p>Thursday, December 5 | 12:00pm - 1:00pm</p>
              <p>Time zone - Original time</p>
            </div>
            <div className={styles.memberedit}>
              <img src="/profile.png" alt="" />
              <div>
                <p>Eddie Lobanovsky</p>
                <p>laboanovsky@gmail.com</p>
              </div>
              <button className={styles.editBtnedit}>Edit</button>
            </div>
            <div className={styles.formedit}>
              <select className={styles.selectedit}><option>Select workout type</option></select>
              <input type="text" placeholder="Push ups" className={styles.inputTextedit} />
              <select className={styles.select}><option>Select workout duration</option></select>

              <div className={styles.gridedit}>
                <div className={styles.inputGroupedit}><label>Reps:</label><input value="7 reps" readOnly /></div>
                <div className={styles.inputGroupedit}><label>Sets:</label><input value="10 sets" readOnly /></div>
                <div className={styles.inputGroupedit}><label>Weight:</label><input value="150 lbs" readOnly /></div>
                <div className={styles.inputGroupedit}><label>Rest timer:</label><input value="80s" readOnly /></div>
              </div>

              <input className={styles.inputTextedit} placeholder="Add calories burned" />
              <input className={styles.inputTextedit} placeholder="Add Water consumed" />
            </div>

            <div className={styles.actionsedit}>
              <button className={styles.closeBtnBottomedit} onClick={closePopup}>Close</button>
              <button className={styles.submitBtnedit}>Submit</button>
            </div>
          </div>
        </div>
      )}
    </div>


    <div>
      <div className={styles.dropdownItemcal} onClick={handleDeleteClick}>
        <img src={arrowdelete} alt='' />
        <Link className={styles.dropdwncallink01} to="">Delete</Link>
      </div>

      {showPopupss && (
        <div className={styles.popupOverlaydelete}>
          <div className={styles.popupdelete}>
            <div className={styles.headerdelete}>
              <h2>Delete class</h2>
              <button className={styles.closeButtondelete} onClick={closePopups}>X</button>
            </div>
            <div className={styles.tagdelete}>Fitness class</div>
            <div className={styles.detailsdelete}>
              <div className={styles.icondelete}>🕒</div>
              <div>
                <p>John Deo</p>
                <p>Thursday, December 5</p>
                <p>12:00pm - 1:00pm</p>
                <p>Time zone - Original time</p>
              </div>
            </div>
            <p className={styles.confirmTextdelete}>
              Are you sure, you want delete this class permanently?
            </p>
            <div className={styles.buttonsdelete}>
              <button className={styles.closebtndelete} onClick={closePopup}>Close</button>
              <button className={styles.deletebtndelete} onClick={confirmDelete}>Yes, Delete</button>
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

export default MySchedual02