import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import qs from 'qs';
import api from '../../../api';
import styles from "./Admin.module.css";

/* ----- assets ----- */
import logoviews     from "../../../../src/assets/fitnessWorkout-iconsorange.png";
import overviewimg   from "../../../../src/assets/Dashbaord-icons.png";
import trainerimg    from "../../../../src/assets/trainer-icons.png";
import schedualimg   from "../../../../src/assets/Schedule-icons.png";
import workoutimg    from "../../../../src/assets/Workout-icons.png";
import profileimg    from "../../../../src/assets/profile-icons.png";
import logoutimg     from "../../../../src/assets/Logout-icons.png";
import notify        from "../../../../src/assets/notification-icon.png";
import defaultUser   from "../../../../src/assets/default-user.png";
import searchicon    from "../../../../src/assets/search-icons.png";
import traineravatar from "../../../../src/assets/trainer-avatar.png";
import arrowSort     from "../../../../src/assets/NewArrow - Down.png";

/* ---- 列头定义 ---- */
const COLS = [
  { title:'Name',      key:'name'      },
  { title:'Email',     key:'email'     },
  { title:'Specialty', key:'specialty' },
  { title:'Gender',    key:'gender'    }
];

/** 映射可排序字段（如需后端排序可调整） */
const SORT_FIELD_MAP = {
  name: 'name',
  email: 'email',
  specialty: 'specialty',
  gender: 'gender'
};

export default function Trainers() {
  /* -------- 查询条件 & 数据 -------- */
  const [query, setQuery] = useState({
    keyword:'',  page:1, size:10, sortBy:'', sortOrder:'asc'
  });
  const [rows,  setRows]  = useState([]);
  const [total, setTotal] = useState(0);

  /* -------- 侧边栏固定 -------- */
  const [sticky, setSticky] = useState(false);
  useEffect(()=>{
    const handler=()=>setSticky(window.scrollY>60);
    window.addEventListener('scroll',handler);
    return ()=>window.removeEventListener('scroll',handler);
  },[]);

  /* -------- 拉取未认证教练 -------- */
  useEffect(()=>{
    const params = {
      certificationStatus:'UNVERIFIED',
      keyword:query.keyword,
      current:query.page,
      size:query.size
    };
    if(query.sortBy){
      params.sortBy = SORT_FIELD_MAP[query.sortBy];
      params.sortOrder = query.sortOrder;
    }
    api.get('/trainers/search', {
      params,
      paramsSerializer: p=>qs.stringify(p,{arrayFormat:'repeat'})
    }).then(({data})=>{
      setRows(data.records||[]);
      setTotal(data.total ?? data.totalElements ?? 0);
    }).catch(err=>console.error('加载教练失败',err));
  },[query]);

  /* -------- 执行认证 -------- */
  const handleVerify=id=>{
    api.put(`/admin/trainers/${id}/verify`)
      .then(()=>setRows(list=>list.filter(t=>t.trainerId!==id)))
      .catch(err=>alert(err.response?.data?.message||'Verify failed'));
  };

  /* -------- 分页 -------- */
  const totalPages=Math.max(1,Math.ceil(total/query.size));
  const prevPage = ()=>setQuery(q=>({...q,page:Math.max(1,q.page-1)}));
  const nextPage = ()=>setQuery(q=>({...q,page:Math.min(totalPages,q.page+1)}));

  /* -------- 渲染 -------- */
  return (
    <div className={styles.headcontainer}>
      {/* -------- sidebar -------- */}
      <aside className={`${styles.nextoverview01} ${sticky ? styles.stickySidebar : ''}`}>
        <div className={styles.overviewlogo}>
          <h2 className={styles.overviewheader1}>Fitness</h2>
          <img src={logoviews} alt="" />
        </div>
        <div className={styles.nextsection01}>
          {[
            {to:'/overview', icon:overviewimg, text:'Overview'},
            {to:'/scheduale',   icon:workoutimg,  text:'Members'},
            {to:'/memberlist',icon:trainerimg,  text:'Trainers'},
          ].map(m=>(
            <div key={m.text} className={styles.menuItemdb1}>
              <img src={m.icon} alt="" className={styles.menuicon}/>
              <Link to={m.to} className={styles.menulinksdb}>{m.text}</Link>
            </div>
          ))}
          <div className={styles.nextsection02}>
            <div className={styles.menuItemdb01}>
              <img src={profileimg} alt="" className={styles.menuicon}/>
              <Link to="/myprofile" className={styles.menulinksdb}>My Profile</Link>
            </div>
            <div className={styles.menuItemdb01}>
              <img src={logoutimg} alt="" className={styles.menuicon}/>
              <Link to="/signin" className={styles.menulinksdb}>Logout</Link>
            </div>
          </div>
        </div>
      </aside>

      {/* -------- main -------- */}
      <main className={styles.nextoverview02}>
        {/* top bar */}
        <header className={styles.topbarover}>
          <div className={styles.topbarover01}>
            <p className={styles.bar01}>Hello Admin</p>
            <p className={styles.bar02}>Trainer Verification</p>
          </div>
          <div className={styles.topbarover02}>
            <img src={notify} alt="" className={styles.topnotifyimg}/>
            <img src={defaultUser} alt="" />
            <span className={styles.bar03}>Admin</span>
          </div>
        </header>

        {/* search bar */}
        <section className={styles.Memberlistsection}>
          <div className={styles.membertwobtns}>
            <div className={styles.membertwobtns01}>
              <input
                className={styles.memberinput}
                placeholder="Search"
                value={query.keyword}
                onChange={e=>setQuery({...query, keyword:e.target.value, page:1})}
              />
            </div>
          </div>

          {/* trainers table */}
          <div className={styles.membertablesection}>
            <table className={styles.membermaintable}>
              <thead className={styles.membermainthread}>
                <tr className={styles.membertr1}>
                  {COLS.map(col=>{
                    const sorted=query.sortBy===col.key;
                    return (
                      <th key={col.key}
                          className={`${styles.memberth} ${sorted?styles.sorted:''}`}
                          onClick={()=>setQuery(q=>({
                            ...q,
                            sortBy:col.key,
                            sortOrder: sorted && q.sortOrder==='asc'?'desc':'asc',
                            page:1
                          }))}>
                        <div className={styles.newmembrth}>
                          <span className={styles.newmembspn}>{col.title}</span>
                          <img src={arrowSort}
                               className={`${styles.sortArrow} ${sorted&&query.sortOrder==='desc'?styles.rotate180:''}`}
                               alt="sort"/>
                        </div>
                      </th>
                    );
                  })}
                  <th className={styles.memberth}></th>
                </tr>
              </thead>
              <tbody>
                {rows.map(tr=>(
                  <tr key={tr.trainerId} className={styles.membertr}>
                    <td className={styles.membertd}>
                      <div className={styles.profile}>
                        <img src={tr.photoUrl||traineravatar} className={styles.avatar} alt=""/>
                        {tr.name}
                      </div>
                    </td>
                    <td className={styles.membertd}>{tr.email}</td>
                    <td className={styles.membertd}>{tr.specialty}</td>
                    <td className={styles.membertd}>{tr.gender}</td>
                    <td className={styles.membertd}>
                      <button className={styles.membertablebtns}
                              onClick={()=>handleVerify(tr.trainerId)}>Verify</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* pagination */}
            <div className={styles.pagination}>
              <button disabled={query.page===1}
                      onClick={prevPage}
                      className={styles.pageBtn}>Prev</button>
              <span className={styles.pageInfo}>{query.page} / {totalPages}</span>
              <button disabled={query.page===totalPages}
                      onClick={nextPage}
                      className={styles.pageBtn}>Next</button>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}