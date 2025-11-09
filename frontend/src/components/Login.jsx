import React, { useState } from 'react'
import "../css/login.css"
import { api } from "../api"

const Login = () => {
  const [form, setForm] = useState(
    { email: "", password: "" }
  )
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
      const {user,token} = res.data
      localStorage.setItem("user", JSON.stringify(user))
      localStorage.setItem("token", JSON.stringify(token))
      alert(`👋 Welcome back, ${user.username}!`)
    } catch (err) {
      console.error("Login error:", err)
      if (err.response?.data?.error) alert(err.response.data.error)
      else alert("Login failed")
    }
  }
  return (
    <div className='login '>
      <div className='login-box' >
        <h1>Welcome to Find Local</h1>
        <p>Connect with trusted local professionals</p>
        <form classusername='loginForm' onSubmit={handleSubmit}>
          <label>Email
            <input type='email' placeholder='Email' required name='email' value={form.email} onChange={handleChange} />
          </label>
          <label>Password
            <input type='password' placeholder='Password' required name='password' value={form.password} onChange={handleChange} />
          </label>
          <button>Login</button>
        </form>


      </div>
    </div>
  )
}

export default Login