import React from "react";
import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Webpage from "./websitecomponents/webpage/Webpage";
import Signup from "./dashboardcomponents/pages/admin/Signup";
import Signin from "./dashboardcomponents/pages/member/signin";
import Login from "./dashboardcomponents/pages/trainer/Login";
import Myprofile from "./dashboardcomponents/pages/myprofile/Myprofile";

const App = () => {
  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Webpage />} />
          {/* admin-db */}
          <Route path="/signup" element={<Signup />} />

          {/* member-db */}

          <Route path="/signin" element={<Signin />} />

          {/* trainer-db */}

          <Route path="/login" element={<Login />} />
          <Route path="/myprofile" element={<Myprofile />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
};

export default App;
