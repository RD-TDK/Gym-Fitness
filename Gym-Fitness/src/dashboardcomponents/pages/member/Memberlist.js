import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../../api';
import qs from 'qs';
import styles from './Member.module.css';

/* ----- assets ----- */
import logoviews     from '../../../../src/assets/fitnessWorkout-iconsorange.png';
import overviewimg   from '../../../../src/assets/Dashbaord-icons.png';
import workoutimg    from '../../../../src/assets/Workout-icons.png';
import trainerimg    from '../../../../src/assets/trainer-icons.png';
import schedualimg   from '../../../../src/assets/Schedule-icons.png';
import profileimg    from '../../../../src/assets/profile-icons.png';
import logoutimg     from '../../../../src/assets/Logout-icons.png';
import notify        from '../../../../src/assets/notification-icon.png';
import avatarTopbar  from '../../../../src/assets/Avatar-photo.png';
import searchicon    from '../../../../src/assets/search-icons.png';
import arrowdown     from '../../../../src/assets/downarrow-icon.png';
import traineravatar from '../../../../src/assets/trainer-avatar.png';
import arrowSort     from '../../../../src/assets/NewArrow - Down.png';
import notifyIcon from "../../../../src/assets/notification-icon.png";
import defaultUser from '../../../../src/assets/default-user.png';


/* 列⇆后端字段映射 */
const COLS = [
  { title: 'Name',        key: 'name'        },
  { title: 'Gender',      key: 'gender'      },
  { title: 'Specialty',   key: 'specialty'   },
  { title: 'Experience',  key: 'experience'  },
  { title: 'Certified',   key: 'isCertified' }
];

// Backend column names mapping
const SORT_FIELD_MAP = {
  name       : 'trainerName',  // adjust to actual column in DB
  gender     : 'gender',
  specialty  : 'specialty',
  experience : 'experience',
  isCertified: 'is_certified'  // example, adjust as needed
};

export default function Memberlist() {
  /* ---------- UI / 查询条件 ---------- */
  const [query, setQuery] = useState({
    keyword   : '',
    gender    : '',
    expMin    : '',
    expMax    : '',
    page      : 1,
    size      : 10,
    sortBy    : '',
    sortOrder : 'asc'
  });

  /* ---------- 数据 & 分页 ---------- */
  const [rows,  setRows]  = useState([]);
  const [total, setTotal] = useState(0);

  /* ---------- 固定侧边栏 ---------- */
  const [sticky, setSticky] = useState(false);
  // notification & profile popup
  const [showNotifPopup, setShowNotifPopup] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [loadingNotifs, setLoadingNotifs] = useState(false);
  const [showProfilePopup, setShowProfilePopup] = useState(false);
  // membership plan modal
  const [membership, setMembership] = useState(null);
  const [showPlanModal, setShowPlanModal] = useState(false);
  const [planType, setPlanType] = useState('BASIC');
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  useEffect(() => {
    const onScroll = () => setSticky(window.scrollY > 60);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Fetch membership info
  useEffect(() => {
    if (!user.userId) return;
    api.get(`memberships/users/${user.userId}`)
      .then(({ data }) => {
        setMembership({
          membershipId: data.membershipId,
          planType: data.planType,
          isActive: data.isActive,
          startDate: data.startDate,
          endDate: data.endDate
        });
      })
      .catch(console.error);
  }, [user.userId]);

  /* ---------- 拉取数据 ---------- */
  useEffect(() => {
    (async () => {
      try {
        const params = {
          keyword : query.keyword,
          current : query.page,
          size    : query.size,
          sortOrder: query.sortOrder
        };

        // optional filters
        if (query.sortBy) {
          const backendField = SORT_FIELD_MAP[query.sortBy];
          if (backendField) params.sortBy = backendField;
        }
        if (query.gender)     params.gender    = query.gender;
        if (query.expMin !== '' || query.expMax !== '') {
          const min = query.expMin === '' ? 0 : Number(query.expMin);
          const max = query.expMax === '' ? 100 : Number(query.expMax);
          params.experienceRange = [min, max];
        }

        const { data } = await api.get('/trainers/search', {
          params,
          paramsSerializer: p => qs.stringify(p, { arrayFormat: 'repeat' })
        });
        setRows(data.records || []);
        setTotal(data.total ?? data.totalElements ?? 0);
      } catch (e) {
        console.error('Error loading trainers:', e);
      }
    })();
  }, [query]);

  const totalPages = Math.max(1, Math.ceil(total / query.size));
  const prevPage   = () => setQuery(q => ({ ...q, page: Math.max(1, q.page - 1) }));
  const nextPage   = () => setQuery(q => ({ ...q, page: Math.min(totalPages, q.page + 1) }));

  /* ---------- 渲染 ---------- */
  return (
    <div className={styles.headcontainer}>
      {/* -------- sidebar -------- */}
      <aside className={`${styles.nextoverview01} ${sticky ? styles.stickySidebar : ''}`}>
        <div className={styles.overviewlogo}>
          <h2 className={styles.overviewheader1}>Fitness</h2><img src={logoviews} alt="" />
        </div>
        <div className={styles.nextsection01}>
          {[
            { to:'/overviews', icon:overviewimg , text:'Overview' },
            { to:'/history', icon:workoutimg  , text:'My Training History'  },
            { to:'/memberlist',icon:trainerimg  , text:'Trainers' },
            { to:'/schedualcalmember'  , icon:schedualimg, text:'My Schedule'}
          ].map(m=>(
            <div key={m.text} className={styles.menuItemdb1}>
              <img src={m.icon} className={styles.menuicon} alt="" /><Link to={m.to} className={styles.menulinksdb}>{m.text}</Link>
            </div>
          ))}
          <div className={styles.nextsection02}>
            <div className={styles.menuItemdb01}>
              <img src={profileimg} className={styles.menuicon} alt="" /><Link to="/myprofile" className={styles.menulinksdb}>My Profile</Link>
            </div>
            <div className={styles.menuItemdb01}>
              <img src={logoutimg}  className={styles.menuicon} alt="" /><Link to="/signin"    className={styles.menulinksdb}>Logout</Link>
            </div>
          </div>
        </div>
      </aside>

      {/* -------- main -------- */}
      <main className={styles.nextoverview02}>
        {/* topbar */}
        <header className={styles.topbarover}>
          <div className={styles.topbarover01}>
            <p className={styles.bar01}>Good Morning</p>
            <p className={styles.bar02}>Welcome Back!</p>
          </div>
          <div className={styles.topbarover02}>
            {/* Notification icon */}
            <div className={styles.notifypopcontainer}>
              <img src={notify} className={styles.topnotifyimg} alt=""
                onClick={() => setShowNotifPopup(v => !v)} />
              {showNotifPopup && (
                <div className={styles.notifypopup1}>
                  <h3>Notifications</h3>
                  {loadingNotifs ? <p>Loading...</p>
                    : notifications.length
                      ? notifications.map(n => (
                          <div key={n.notificationId} className={styles.notificationItem}>
                            <p>{n.message}</p>
                            <button onClick={() => {/* mark read logic */}} className={styles.viewLink}>View</button>
                          </div>
                        ))
                      : <p>No new notifications</p>}
                </div>
              )}
            </div>
            {/* Profile trigger */}
            <div className={styles.profileTrigger} onClick={() => setShowProfilePopup(v => !v)}>
              <img src={defaultUser} alt="Avatar" />
              <span className={styles.bar03}>{user.name || 'Member'}</span>
            </div>
            {showProfilePopup && (
              <div className={styles.notifypopup1} style={{ right: '20px', top: '60px' }}>
                <h3>Member Info</h3>
                <p><strong>Name:</strong> {user.name}</p>
                <p><strong>Email:</strong> {user.email}</p>
                <hr className={styles.divider}/>
                {membership && (
                  <div className={styles.membershipInfo}>
                    <h4>Membership Details</h4>
                    <p><strong>ID:</strong> {membership.membershipId}</p>
                    <p><strong>Plan:</strong> {membership.planType}</p>
                    <button className={styles.membershipBtn} onClick={() => setShowPlanModal(true)}>Manage Plan</button>
                    <p><strong>Active:</strong> {membership.isActive ? 'Yes':'No'}</p>
                    <p><strong>Start:</strong> {new Date(membership.startDate).toLocaleDateString()}</p>
                    <p><strong>End:</strong> {new Date(membership.endDate).toLocaleDateString()}</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </header>

        {/* list */}
        <section className={styles.Memberlistsection}>

          {/* ------ search + basic filter ------ */}
          <div className={styles.membertwobtns}>
            <div className={styles.membertwobtns01}>
              <input className={styles.memberinput} placeholder="Search"
                value={query.keyword}
                onChange={e=>setQuery({...query, keyword:e.target.value, page:1})}/>
            </div>
          </div>

          {/* ------ extra filters ------ */}
          <div className={styles.filterRow}>
            <select className={styles.genderSelect}
                    value={query.gender}
                    onChange={e=>setQuery({...query, gender:e.target.value, page:1})}>
              <option value=''>All Gender</option><option value='MALE'>Male</option><option value='FEMALE'>Female</option><option value='OTHER'>Other</option>
            </select>
            <input type="number" placeholder="Min Exp" className={styles.expInput}
                   value={query.expMin}
                   onChange={e=>setQuery({...query, expMin:e.target.value, page:1})}/>
            <span className={styles.expDash}>-</span>
            <input type="number" placeholder="Max Exp" className={styles.expInput}
                   value={query.expMax}
                   onChange={e=>setQuery({...query, expMax:e.target.value, page:1})}/>
          </div>

          {/* ------ table ------ */}
          <div className={styles.membertablesection}>
            <table className={styles.membermaintable}>
              <thead className={styles.membermainthread}>
                <tr className={styles.membertr1}>
                  {COLS.map(col=>{
                    const sorted = query.sortBy===col.key;
                    return (
                      <th
                        key={col.key}
                        className={`${styles.memberth} ${sorted ? styles.sorted : ''}`}
                        onClick={()=>setQuery(q=>({
                          ...q,
                          sortBy   : col.key,
                          sortOrder: sorted && q.sortOrder==='asc' ? 'desc':'asc',
                          page     : 1
                        }))}>
                        <div className={styles.newmembrth}>
                          <span className={styles.newmembspn}>{col.title}</span>
                          <img
                            src={arrowSort}
                            className={`${styles.sortArrow} ${
                              sorted && query.sortOrder === 'desc' ? styles.rotate180 : ''
                            }`}
                            alt=""
                          />
                        </div>
                      </th>
                    );
                  })}
                  <th className={styles.memberth}></th>
                </tr>
              </thead>
              <tbody>
                {rows.map(tr=>(
                  <tr className={styles.membertr} key={tr.trainerId}>
                    <td className={styles.membertd}>
                      <div className={styles.profile}><img src={tr.photo||traineravatar} className={styles.avatar} alt=""/>{tr.name}</div>
                    </td>
                    <td className={styles.membertd}>{tr.gender}</td>
                    <td className={styles.membertd}>{tr.specialty}</td>
                    <td className={styles.membertd}>{tr.experience}</td>
                    <td className={styles.membertd}>{tr.isCertified}</td>
                    <td className={styles.membertd}><button className={styles.membertablebtns}>Connect</button></td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* pagination */}
            <div className={styles.pagination}>
              <button disabled={query.page===1} onClick={prevPage} className={styles.pageBtn}>Prev</button>
              <span className={styles.pageInfo}>{query.page} / {totalPages}</span>
              <button disabled={query.page===totalPages} onClick={nextPage} className={styles.pageBtn}>Next</button>
            </div>
          </div>
        </section>
    {/* Plan Modal */}
    {showPlanModal && (
      <div className={styles.modalOverlay}>
        <div className={styles.modalContent}>
          <button className={styles.modalClose} onClick={() => setShowPlanModal(false)}>×</button>
          <h3>Update Plan</h3>
          <div className={styles.planCards}>
            {['BASIC','GOLD','PREMIUM'].map(p => (
              <div key={p}
                   className={`${styles.planCard} ${planType===p?styles.planCardSelected:''}`}
                   onClick={()=>setPlanType(p)}>
                <h3>{p}</h3>
                <p className={styles.planDescription}>
                  {p==='BASIC'
                    ? 'Access to gym equipment and group classes.'
                    : p==='GOLD'
                    ? 'Includes Basic, one personal session per month.'
                    : 'All Premium benefits plus unlimited training.'}
                </p>
              </div>
            ))}
          </div>
          <p className={styles.upgradeNote}>
            Note: The plan can only be upgraded according to Basic → Gold → Premium. Downgrading not possible.
          </p>
          <button className={`${styles.signInButton} ${styles.fullWidthButton}`}
            onClick={async ()=>{
              try {
                await api.post('/memberships/update',{ planType });
                setShowPlanModal(false);
                window.location.reload();
              } catch(e){console.error(e);}
            }}>
            Update Plan
          </button>
        </div>
      </div>
    )}
    </main>
  </div>
);
}