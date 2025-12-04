import React, { useState, useEffect } from 'react'
import { useNavigate, useLocation } from "react-router-dom"
import "../css/navbar.css"


const Navbar = () => {
    const navigate = useNavigate()
    const location = useLocation()
    let [role, setRole] = useState("")

    useEffect(() => {
        const user = localStorage.getItem("user")
        if (user) {
            const person = JSON.parse(user)
            setRole(person.role)
        }
    }, [])
    const isAuthPage = location.pathname === '/login' || location.pathname === '/signup'
    const viewer = JSON.parse(localStorage.getItem("user") || "{}");


    return (
        <nav className={`navbar ${isAuthPage ? 'navbar-hidden' : ''}`}>
            <div className="logo" onClick={() => {
                if (role==="Expert"){
                    navigate("/expert/dashboard")
                }
                else if (role === "Client") navigate("/home")
                else navigate("/signup")
            }}>FindLocal</div>
            <div className='navLink'>
                {role === "Expert" ? (
                    <>
                        <button onClick={() => navigate("/expert/orders")}>My Orders</button>
                        <button onClick={() => navigate("/expert/profile")}>Profile</button>
                    </>
                ) : role === "Client" ? (
                    <>
                        <button onClick={() => navigate("/mybookings")}>My Bookings</button>
                        <button onClick={() => navigate("/profile")}>Profile</button>
                    </>
                ) : (
                    <>
                        <button onClick={() => navigate("/login")}>Login</button>
                    </>
                )}
            </div>
        </nav>
    )
}

export default Navbar