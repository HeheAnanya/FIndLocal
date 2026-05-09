import React, { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { api } from "../api"
import "../css/BookForm.css"

const Bookings = () => {
  const { expertId } = useParams()
  const navigate = useNavigate()
  const [forms, setForms] = useState({ description: "", date: "" })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  async function handleSubmit(e) {
    e.preventDefault()
    setLoading(true)
    setError("")
    try {
      await api.post("/bookings", {
        expertId: Number(expertId),
        description: forms.description,
        date: new Date(forms.date)
      })
      navigate("/mybookings")
    } catch (err) {
      setError(err.response?.data?.error || "Failed to book the slot. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  function handleChange(e) {
    setForms({ ...forms, [e.target.name]: e.target.value })
    setError("")
  }

  return (
    <div className="book-page">
      <div className="book-card">
        <div className="book-card-header">
          <div className="book-card-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
            </svg>
          </div>
          <h2>Book an Expert</h2>
          <p>Describe your task and choose a convenient time slot.</p>
        </div>

        <form className="book-form" onSubmit={handleSubmit}>
          <div className="book-form-group">
            <label>Describe the task</label>
            <textarea
              placeholder="What needs to be done? Be as specific as possible so the expert can prepare."
              required
              name="description"
              value={forms.description}
              onChange={handleChange}
            />
          </div>

          <div className="book-form-group">
            <label>Preferred date and time</label>
            <input
              type="datetime-local"
              value={forms.date}
              name="date"
              onChange={handleChange}
              required
            />
          </div>

          {error && (
            <div style={{ color: 'var(--danger)', fontSize: '13px', background: 'var(--rejected-bg)', padding: '10px 14px', borderRadius: 'var(--radius-sm)', border: '1px solid #f5c0be' }}>
              {error}
            </div>
          )}

          <button type="submit" className="book-submit-btn" disabled={loading}>
            {loading ? "Confirming booking..." : "Confirm Booking"}
          </button>
        </form>
      </div>
    </div>
  )
}

export default Bookings
