import { useState, useEffect } from 'react';
import api from '../../../api';
import styles from "./Myprofile.module.css";
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


const Myprofile = () => {
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
              <Link to="/overviews" className={styles.menulinksdb}> Workout </Link>
            </div>
            <div className={styles.menuItemdb1}>
              <img src={trainerimg} alt='' className={styles.menuicon}/>
              <Link to="/memberlist" className={styles.menulinksdb}> Trainers </Link>
            </div>
            <div className={styles.menuItemdb1}>
              <img src={schedualimg} alt='' className={styles.menuicon}/>
              <Link to="/schedual" className={styles.menulinksdb}> My Schedule </Link>
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
              <img src={notify} alt=''></img>
              <img src={imgprofile} alt=''></img>
              <span className={styles.bar03}>Member name</span>
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
              <div className={styles.sectiontitle}>Update Password</div>
              <div className={styles.formactions}>
                <Link to="/updateaccount">
                  <button className={styles.accountbtns1}>Change Password</button>
                </Link>
              </div>

            </div>
          </div>

        </div>
      </div>
  )
}

export default Myprofile