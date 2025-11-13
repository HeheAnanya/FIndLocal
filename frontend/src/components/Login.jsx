import React, { useState } from 'react'
import "../css/auth.css"
import { api } from "../api"
import {useNavigate} from "react-router-dom"


const Login = () => {
  const [form, setForm] = useState(
    { email: "", password: "" }
  )
  const navigate = useNavigate()
  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value })
  }
  async function handleSubmit(e) {
    e.preventDefault()
    try {
      const res = await api.post("/login", {
        email: form.email,
        password: form.password
      })
      const {users,token} = res.data
      localStorage.setItem("user", JSON.stringify(users))
      localStorage.setItem("accesstoken", JSON.stringify(token))
      alert(`👋 Welcome back, ${users.username}!`)

      const profile = await api.get("/profile");
      console.log("Profile data:", profile.data);
    } catch (err) {
      console.error("Login error:", err)
       if (err.response && err.response.data && err.response.data.error) {
            alert(err.response.data.error);
        } else if (err.response && err.response.data && err.response.data.message) {
            alert(err.response.data.message);
        } else {
            alert("Something went wrong, try again later");
        }
    }
  }
  return (
    <div className='login '>
      <div className='left'>
        <div className="overlay"></div>
        <div className='left-content'>
          <h1>Connect with trusted local professionals</h1>
          <p>FindLocal helps you discover, book, and review skilled serviceproviders near you — fast, easy, and reliable.</p>
          <div className="stats">
            <p>👷‍♂️ 10,000+ Verified Experts</p>
            <p>⭐ 5,000+ 5-Star Reviews</p>
            <p>🏙️ 100+ Cities Served</p>
          </div>
        </div>
      </div>
      <div className='right'>
      <div className='login-box' >
        <h1>Welcome Back!</h1>
        {/* <p>Connect with trusted local professionals</p> */}
        <form classusername='loginForm' onSubmit={handleSubmit}>
          <label>Email
            
          </label>
          <input type='email' placeholder='Email' required name='email' value={form.email} onChange={handleChange} />
          <label>Password
            
          </label>
          <input type='password' placeholder='Password' required name='password' value={form.password} onChange={handleChange} />
          <button>Login</button>
          </form>
          <p className='switch-text'>
            Don't have an account?
            <span onClick={()=>(navigate("/signup"))}>SIGN UP</span>
          </p>
      </div>
        


      </div>
    </div>
  )
}

export default Login