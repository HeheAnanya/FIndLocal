import React, { useState, useEffect } from 'react'
import { useNavigate, useLocation } from "react-router-dom"
import "../css/navbar.css"


const Navbar = () => {
    const navigate = useNavigate()
    const location = useLocation()
    let [role, setRole] = useState("")
    const [user, setUser] = useState(null)

    useEffect(() => {
        const found = localStorage.getItem("user")
        if (found) {
            const person = JSON.parse(found)
            setUser(person)
            setRole(person.role)
        }
    }, [location.pathname])
    const isAuthPage = location.pathname === '/login' || location.pathname === '/signup'
    let services = ["Plumber", "Electrician", "Cleaner", "Painter"]
    function logout(){
        localStorage.removeItem("user")
        localStorage.removeItem("accesstoken")
        setUser(null)
        setRole("")
        navigate("/login")
    }
    if (isAuthPage){
        return null
    }    return (
        <nav className="navbar">
            <div className="logo" onClick={() => {
                if(!user){
                    navigate("/signup")
                }
                else if (role==="Expert"){
                    navigate("/expert/dashboard")
                }
                else if (role === "Client"){ navigate("/home")}
                else navigate("/signup")
            }}>FindLocal</div>
            {user?.role==="Client" &&
            <div className='navMain'>
                {services.map((e)=>(
                    <span key={e} onClick={()=>(navigate(`/services/${e}`))} style={{cursor:'pointer',fontWeight:500}}>{e}</span>
                ))}
                </div>}
            <div className='navLink'>
                {!user && (
                    <>
                    <button onClick={()=>(navigate("/login"))}>Login</button>
                    <button onClick={()=>(navigate("/signup"))}>Sign Up</button>
                    </>
                )}
                {user?.role==="Client" && (
                    <>
                    <button onClick={()=>(navigate("/mybookings"))}>My Bookings</button>
                    <button onClick={()=>(navigate("/profile"))}>Profile</button>
                    <button onClick={logout}>Logout</button>
                    </>
                )}
                {user?.role==="Expert" && (
                    <>
                    <button onClick={()=>(navigate("/expert/orders"))}>My Orders</button>
                    <button onClick={()=>(navigate("/expert/profile"))}>Profile</button>
                    <button onClick={logout}>Logout</button>
                    
                    </>
                )}
            </div>
        </nav>
    )
}

export default Navbar