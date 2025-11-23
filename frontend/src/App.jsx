import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./components/Login";
import SignUp from "./components/SignUp";
import Home from "./pages/Home";
import Navbar from "./components/Navbar";
import Expert from "./components/Expert"; 

function App() {
  return (
    <BrowserRouter>
    <Routes>
       <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
    </Routes>
      <Navbar /> 
      <Routes>
        <Route path="/" element={<Home />} /> 
        <Route path="/expert/profile" element={<Expert />} />
        
      </Routes>
    </BrowserRouter>
  );
}

export default App;