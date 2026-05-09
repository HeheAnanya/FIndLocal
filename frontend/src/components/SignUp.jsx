import React, { useState } from 'react'
import "../css/auth.css"
import { api } from "../api.js"
import { useNavigate } from 'react-router-dom'

const SignUp = () => {
  const navigate = useNavigate()
  const [form, setForm] = useState({ username: "", email: "", phoneNumber: "", password: "", role: "" })
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [loading, setLoading] = useState(false)

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value })
    setError("")
    setSuccess("")
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setLoading(true)
    setError("")
    try {
      await api.post("/signup", {
        username: form.username,
        email: form.email,
        password: form.password,
        phoneNumber: String(form.phoneNumber),
        role: form.role
      })
      setSuccess("Account created successfully. Please sign in.")
      setForm({ username: "", email: "", phoneNumber: "", password: "", role: "" })
      setTimeout(() => navigate("/login"), 1500)
    } catch (err) {
      const msg = err.response?.data?.error || err.response?.data?.message || "Something went wrong, try again later"
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
          <h2>Join the platform people trust</h2>
          <p>Whether you are looking for help or offering your expertise, FindLocal connects you with the right people.</p>
          <div className="auth-features">
            <div className="auth-feature-item">
              <span className="auth-feature-dot"></span>
              Free to join as a client or expert
            </div>
            <div className="auth-feature-item">
              <span className="auth-feature-dot"></span>
              Manage bookings from one dashboard
            </div>
            <div className="auth-feature-item">
              <span className="auth-feature-dot"></span>
              Secure payments and reviews
            </div>
          </div>
        </div>
      </div>

      <div className="auth-right">
        <div className="auth-card">
          <div className="auth-card-header">
            <h1>Create your account</h1>
            <p>Get started in under two minutes</p>
          </div>

          <form className="auth-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Full name</label>
              <input
                type="text"
                placeholder="Your full name"
                required
                name="username"
                value={form.username}
                onChange={handleChange}
              />
            </div>

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
              <label>Phone number</label>
              <input
                type="text"
                placeholder="10-digit mobile number"
                required
                maxLength={10}
                name="phoneNumber"
                value={form.phoneNumber}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label>Password</label>
              <input
                type="password"
                placeholder="Create a strong password"
                required
                name="password"
                value={form.password}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label>I am joining as</label>
              <select name="role" value={form.role} onChange={handleChange} required>
                <option value="">Select your role</option>
                <option value="Expert">Expert — I provide services</option>
                <option value="Client">Client — I need services</option>
              </select>
            </div>

            {error && (
              <div style={{ color: 'var(--danger)', fontSize: '13px', background: 'var(--rejected-bg)', padding: '10px 14px', borderRadius: 'var(--radius-sm)', border: '1px solid #f5c0be' }}>
                {error}
              </div>
            )}

            {success && (
              <div style={{ color: 'var(--success)', fontSize: '13px', background: 'var(--confirmed-bg)', padding: '10px 14px', borderRadius: 'var(--radius-sm)', border: '1px solid #a8dfbf' }}>
                {success}
              </div>
            )}

            <button type="submit" className="auth-submit-btn" disabled={loading}>
              {loading ? "Creating account..." : "Create Account"}
            </button>
          </form>

          <p className="switch-text">
            Already have an account?
            <span onClick={() => navigate("/login")}>Sign in</span>
          </p>
        </div>
      </div>
    </div>
  )
}

export default SignUp
