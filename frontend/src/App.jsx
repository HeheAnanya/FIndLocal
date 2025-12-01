import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./components/Login";
import SignUp from "./components/SignUp";
import Home from "./pages/Home";
import Navbar from "./components/Navbar";
import Expert from "./components/Expert";
import Services from "./pages/Services";
import Bookings from "./pages/Bookings";
import MyBooking from "./pages/MyBooking";
import Profile from "./components/Profile";
import ProtectedRoute from "./ProtectedRoute";

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
        <Route path="/expert" element={
          <ProtectedRoute role="Expert">
            <Expert />
          </ProtectedRoute>
        } />

        <Route path="/profile" element={
          <ProtectedRoute role="Client">
            <Profile />
          </ProtectedRoute>
        } />
        <Route path="/services/:type" element={<Services />} />
        <Route path="/bookings/:expertId" element={<Bookings />} />
        <Route path="/mybookings" element={<MyBooking />} />
        <Route path="/expert/orders" element={<MyBooking />} />



      </Routes>
    </BrowserRouter>
  );
}

export default App;