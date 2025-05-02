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
import Myprofile from "./dashboardcomponents/pages/myprofile/Myprofile";
import Schedualcalendrsone from "./dashboardcomponents/pages/member/Schedualcalendrsone";

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

          <Route path="/myprofile" element={<Myprofile />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
};

export default App;
