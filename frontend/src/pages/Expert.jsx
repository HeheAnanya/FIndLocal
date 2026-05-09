import React, { useEffect, useState } from "react"
import { api } from "../api"
import "../css/dashboard.css"

const ExpertDashboard = () => {
  const [bookings, setBookings] = useState([])
  const user = JSON.parse(localStorage.getItem("user") || "{}")

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await api.get("/mybookings")
        setBookings(res.data.bookings || [])
      } catch (err) {
        console.error(err)
      }
    }
    fetchData()
  }, [])

  async function handleStatus(bookingId, newStatus) {
    try {
      await api.put(`/bookings/${bookingId}`, { status: newStatus })
      setBookings(bookings.map(b =>
        b.id === bookingId ? { ...b, status: newStatus } : b
      ))
    } catch (err) {
      console.error(err)
    }
  }

  const pendingOrders = bookings.filter(b => b.status === "PENDING")
  const confirmedOrders = bookings.filter(b => b.status === "CONFIRMED")
  const completedOrders = bookings.filter(b => b.status === "COMPLETED")

  return (
    <div className="dashboard-page">
      <div className="dashboard-header">
        <h1>Welcome back, {user.username || "Expert"}</h1>
        <p>Here is a summary of your current activity.</p>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-number">{bookings.length}</div>
          <div className="stat-label">Total Requests</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">{confirmedOrders.length}</div>
          <div className="stat-label">Upcoming Jobs</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">{completedOrders.length}</div>
          <div className="stat-label">Completed</div>
        </div>
      </div>

      <div className="dashboard-section-title">
        Incoming Orders
        {pendingOrders.length > 0 && (
          <span style={{ background: 'var(--pending-bg)', color: 'var(--pending-color)', fontSize: '12px', padding: '2px 10px', borderRadius: 'var(--radius-full)', fontWeight: '700' }}>
            {pendingOrders.length} pending
          </span>
        )}
      </div>

      {bookings.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--text-muted)' }}>
          <p style={{ fontSize: '16px' }}>No orders yet. Complete your profile to start receiving requests.</p>
        </div>
      ) : (
        <div className="orders-grid">
          {bookings.map((b) => (
            <div key={b.id} className="order-card">
              <div className="order-client-name">{b.client?.username}</div>
              <div className="order-detail-row">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.61 3.42 2 2 0 0 1 3.6 1h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.6a16 16 0 0 0 6 6l.91-.91a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/>
                </svg>
                {b.client?.phoneNumber}
              </div>
              <div className="order-detail-row">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="3" y1="10" x2="21" y2="10"/>
                </svg>
                {new Date(b.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
              </div>
              {b.description && (
                <div className="order-desc">"{b.description}"</div>
              )}
              <div className="order-footer">
                <span className={`tag-${b.status}`}>{b.status}</span>
                {b.status === "PENDING" && (
                  <div className="order-actions">
                    <button
                      style={{ background: 'var(--success)', color: 'white' }}
                      onClick={() => handleStatus(b.id, "CONFIRMED")}
                    >Accept</button>
                    <button
                      style={{ background: 'transparent', color: 'var(--danger)', border: '1.5px solid var(--danger)' }}
                      onClick={() => handleStatus(b.id, "REJECTED")}
                    >Reject</button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default ExpertDashboard
