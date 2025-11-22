import React,{useState,useEffect} from 'react'
// import { api } from "../api"
import {useNavigate} from "react-router-dom"


const Navbar = () => {
    const navigate = useNavigate()
    let[role,setRole]= useState("")
useEffect(() => {
        const user = localStorage.getItem("user")
        if (user) {
            const person = JSON.parse(user)
            setRole(person.role)
        }
    }, [])

    
  return (
    <nav>
        <div className="logo" onClick={() => navigate("/")}>FindLocal</div>
        <div className='navLink'>
            {role==="Expert" ? (
                <>
                <button onClick={() => navigate("/expert/orders")}>My Orders</button>
                <button onClick={() => navigate("/profile")}>Profile</button>
                </>
            ) : role==="Client" ? (
                <>
                <button onClick={() => navigate("/my-bookings")}>My Bookings</button>
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