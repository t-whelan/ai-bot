import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./Home";
import RegisterAndLogin from "./RegisterAndLogin"; 
// import ForgotPassword from "./ForgotPassword";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<RegisterAndLogin />} />
          <Route path="/home" element={<Home />} />
          {/* <Route path="/forgotpassword" element={< ForgotPassword />} /> */}

         </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;