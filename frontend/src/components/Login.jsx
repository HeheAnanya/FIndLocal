import React, { useState } from 'react'
import "../css/auth.css"
import { api } from "../api"
import { useNavigate } from "react-router-dom"

const Login = () => {
  const [form, setForm] = useState({ email: "", password: "" })
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value })
    setError("")
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setLoading(true)
    setError("")
    try {
      const res = await api.post("/login", { email: form.email, password: form.password })
      const { users, token } = res.data
      localStorage.setItem("user", JSON.stringify(users))
      localStorage.setItem("accesstoken", JSON.stringify(token))
      if (users.role === "Expert") {
        try {
          await api.get("/expert/profile")
          navigate("/expert/profile")
        } catch {
          navigate("/expert/profile")
        }
      } else {
        navigate("/home")
      }
    } catch (err) {
      const msg = err.response?.data?.error || err.response?.data?.message || "Invalid email or password"
      setError(msg)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-left">
        <div className="auth-brand">
          <div className="auth-brand-name">
            FindLocal<span className="dot"></span>
          </div>
          <div className="auth-tagline">Trusted home services, on demand</div>
        </div>
        <div className="auth-left-content">
          <h2>Book the right expert for every job</h2>
          <p>Thousands of verified professionals ready to help you with any home service need.</p>
          <div className="auth-features">
            <div className="auth-feature-item">
              <span className="auth-feature-dot"></span>
              Verified and background-checked experts
            </div>
            <div className="auth-feature-item">
              <span className="auth-feature-dot"></span>
              Transparent pricing, no hidden fees
            </div>
            <div className="auth-feature-item">
              <span className="auth-feature-dot"></span>
              Book instantly, track in real time
            </div>
          </div>
        </div>
      </div>

      <div className="auth-right">
        <div className="auth-card">
          <div className="auth-card-header">
            <h1>Welcome back</h1>
            <p>Sign in to your account to continue</p>
          </div>

          <form className="auth-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Email address</label>
              <input
                type="email"
                placeholder="you@example.com"
                required
                name="email"
                value={form.email}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label>Password</label>
              <input
                type="password"
                placeholder="Enter your password"
                required
                name="password"
                value={form.password}
                onChange={handleChange}
              />
            </div>

            {error && (
              <div style={{ color: 'var(--danger)', fontSize: '13px', background: 'var(--rejected-bg)', padding: '10px 14px', borderRadius: 'var(--radius-sm)', border: '1px solid #f5c0be' }}>
                {error}
              </div>
            )}

            <button type="submit" className="auth-submit-btn" disabled={loading}>
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </form>

          <p className="switch-text">
            Don't have an account?
            <span onClick={() => navigate("/signup")}>Create one</span>
          </p>
        </div>
      </div>
    </div>
  )
}

export default Login
