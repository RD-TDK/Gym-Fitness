import React from "react";
import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Webpage from "./websitecomponents/webpage/Webpage";
import Signup from "./dashboardcomponents/pages/admin/Signup";
import Createaccount from "./dashboardcomponents/pages/admin/Createaccount";
import Overview from "./dashboardcomponents/pages/admin/Overview";
import Trainers from "./dashboardcomponents/pages/admin/Trainers";
import Schedualcalender from "./dashboardcomponents/pages/admin/Schedualcalender";
import Signin from "./dashboardcomponents/pages/member/signin";
import Createacc from "./dashboardcomponents/pages/member/Createacc";
import Memberlist from "./dashboardcomponents/pages/member/Memberlist";
import Overviews from "./dashboardcomponents/pages/member/Overviews";
import Schedual from "./dashboardcomponents/pages/member/Schedual";
import Login from "./dashboardcomponents/pages/trainer/Login";
import Memberlists from "./dashboardcomponents/pages/trainer/Memberlists";
import Overviews1 from "./dashboardcomponents/pages/trainer/Overviews1";
import Myprofile from "./dashboardcomponents/pages/myprofile/Myprofile";
import Openaccount from "./dashboardcomponents/pages/trainer/Openaccount";
import Schedualcalendrsone from "./dashboardcomponents/pages/member/Schedualcalendrsone";
import MemberList01 from "./dashboardcomponents/pages/trainer/MemberList01";
import MySchedual01 from "./dashboardcomponents/pages/trainer/MySchedual01";
import MySchedual02 from "./dashboardcomponents/pages/trainer/MySchedual02";

const App = () => {
  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Webpage />} />
          {/* admin-db */}
          <Route path="/signup" element={<Signup />} />
          <Route path="/createaccount" element={<Createaccount />} />
          <Route path="/overview" element={<Overview />} />
          <Route path="/trainer" element={<Trainers />} />
          <Route path="/scheduale" element={<Schedualcalender />} />

          {/* member-db */}

          <Route path="/signin" element={<Signin />} />
          <Route path="/createacc" element={<Createacc />} />
          <Route path="/memberlist" element={<Memberlist />} />
          <Route path="/overviews" element={<Overviews />} />
          <Route path="/schedual" element={<Schedual />} />
          <Route path="/schedualcalmember" element={<Schedualcalendrsone />} />

          {/* trainer-db */}

          <Route path="/login" element={<Login />} />
          <Route path="/openaccount" element={<Openaccount />} />
          <Route path="/memberlists" element={<Memberlists />} />
          <Route path="/overviews1" element={<Overviews1 />} />
          <Route path="/memberList01" element={<MemberList01 />} />
          <Route path="/myschedual01" element={<MySchedual01 />} />
          <Route path="/myschedual02" element={<MySchedual02 />} />

          <Route path="/myprofile" element={<Myprofile />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
};

export default App;
