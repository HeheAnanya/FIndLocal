import React from "react"
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom"
import Login from "./components/Login"
import SignUp from "./components/SignUp"
import Home from "./pages/Home"
import Navbar from "./components/Navbar"
import Expert from "./components/Expert"
import Services from "./pages/Services"
import Bookings from "./pages/Bookings"
import MyBooking from "./pages/MyBooking"
import Profile from "./components/Profile"
import ProtectedRoute from "./ProtectedRoute"
import ExpertDashboard from "./pages/Expert"

function Layout({ children }) {
  const location = useLocation()
  const hideNavbar = location.pathname === "/login" || location.pathname === "/signup" || location.pathname === "/"
  return (
    <>
      {!hideNavbar && <Navbar />}
      {children}
    </>
  )
}

function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/home" element={
            <ProtectedRoute role="Client"><Home /></ProtectedRoute>
          } />
          <Route path="/expert/dashboard" element={
            <ProtectedRoute role="Expert"><ExpertDashboard /></ProtectedRoute>
          } />
          <Route path="/expert/profile" element={
            <ProtectedRoute role="Expert"><Expert /></ProtectedRoute>
          } />
          <Route path="/profile" element={
            <ProtectedRoute role="Client"><Profile /></ProtectedRoute>
          } />
          <Route path="/services/:type" element={<Services />} />
          <Route path="/bookings/:expertId" element={<Bookings />} />
          <Route path="/mybookings" element={<MyBooking />} />
          <Route path="/expert/orders" element={
            <ProtectedRoute role="Expert"><MyBooking /></ProtectedRoute>
          } />
        </Routes>
      </Layout>
    </BrowserRouter>
  )
}

export default App
