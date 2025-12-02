import React, { useState } from 'react'
import "../css/auth.css"
import { api } from "../api"
import { useNavigate } from "react-router-dom"


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
      const { users, token } = res.data
      localStorage.setItem("user", JSON.stringify(users))
      localStorage.setItem("accesstoken", JSON.stringify(token))
      alert(`👋 Welcome back, ${users.username}!`)
      // navigate("/")
      if (users.role === "Expert") {
        try {
          const expertProfile = await api.get("/expert/profile")

          if (expertProfile.data) {
            navigate("/expert/profile")
          } else {

            navigate("/expert/profile")
          }
        } catch (e) {
          console.log(e)
          navigate("/expert")
        }
      }
      else {

        navigate("/profile")
      }
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
    <div className='auth-container'>
      <div className='auth-card'>
        <div className="auth-header">
          <h1>Welcome Back</h1>
          <p>Login to continue managing your bookings</p>
        </div>

        <form className='auth-form' onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Email</label>
            <input
              type='email'
              placeholder='Enter your email'
              required
              name='email'
              value={form.email}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input
              type='password'
              placeholder='Enter your password'
              required
              name='password'
              value={form.password}
              onChange={handleChange}
            />
          </div>

          <button type="submit" className="auth-btn">Login</button>
        </form>

        <p className='switch-text'>
          Don't have an account?
          <span onClick={() => navigate("/signup")}>Sign Up</span>
        </p>
      </div>
    </div>
  )
}

export default Login