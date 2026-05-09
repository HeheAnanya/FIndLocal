import React, { useState, useEffect } from 'react'
import { useNavigate, useLocation } from "react-router-dom"
import "../css/navbar.css"

const Navbar = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const [role, setRole] = useState("")
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const user = localStorage.getItem("user")
    if (user) {
      const person = JSON.parse(user)
      setRole(person.role)
    }
  }, [location.pathname])

  const isAuthPage = location.pathname === '/login' || location.pathname === '/signup'
  if (isAuthPage) return null

  const handleLogoClick = () => {
    if (role === "Expert") navigate("/expert/dashboard")
    else if (role === "Client") navigate("/home")
    else navigate("/signup")
  }

  const handleLogout = () => {
    localStorage.removeItem("user")
    localStorage.removeItem("accesstoken")
    setMenuOpen(false)
    navigate("/login")
  }

  return (
    <nav className="navbar">
      <div className="logo" onClick={handleLogoClick}>
        FindLocal<span className="logo-dot"></span>
      </div>

      <div className="nav-mobile-toggle" onClick={() => setMenuOpen(!menuOpen)}>
        <span></span>
        <span></span>
        <span></span>
      </div>

      <div className={`navLink ${menuOpen ? 'open' : ''}`}>
        {role === "Expert" ? (
          <>
            <button onClick={() => { navigate("/expert/orders"); setMenuOpen(false) }}>My Orders</button>
            <button onClick={() => { navigate("/expert/profile"); setMenuOpen(false) }}>Profile</button>
            <button className="nav-btn-primary" onClick={handleLogout}>Logout</button>
          </>
        ) : role === "Client" ? (
          <>
            <button onClick={() => { navigate("/mybookings"); setMenuOpen(false) }}>My Bookings</button>
            <button onClick={() => { navigate("/profile"); setMenuOpen(false) }}>Profile</button>
            <button className="nav-btn-primary" onClick={handleLogout}>Logout</button>
          </>
        ) : (
          <>
            <button className="nav-btn-primary" onClick={() => { navigate("/login"); setMenuOpen(false) }}>Login</button>
          </>
        )}
      </div>
    </nav>
  )
}

export default Navbar
