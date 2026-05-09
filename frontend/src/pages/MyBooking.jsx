import React, { useState, useEffect } from 'react'
import { api } from "../api"
import "../css/bookings.css"

const MyBooking = () => {
  const [role, setRole] = useState("")
  const [bookings, setBookings] = useState([])
  const [reviewData, setReviewData] = useState({ rating: "", comment: "" })
  const [reviewingId, setReviewingId] = useState(null)

  useEffect(() => {
    const fetching = async () => {
      const user = localStorage.getItem("user")
      if (user) {
        const person = JSON.parse(user)
        setRole(person.role)
      }
      try {
        const res = await api.get("/mybookings")
        if (!res.data || !Array.isArray(res.data.bookings)) {
          setBookings([])
          return
        }
        setBookings(res.data.bookings)
      } catch (er) {
        console.log(er)
      }
    }
    fetching()
  }, [])

  async function handleStatus(bookingId, newStatus) {
    try {
      await api.put(`/bookings/${bookingId}`, { status: newStatus })
      setBookings(bookings.map(task =>
        task.id === bookingId ? { ...task, status: newStatus } : task
      ))
    } catch (er) {
      console.log(er)
    }
  }

  async function handleCancel(bookingId) {
    if (!window.confirm("Cancel this booking?")) return
    try {
      await api.delete(`/bookings/${bookingId}`)
      setBookings(bookings.filter(task => task.id !== bookingId))
    } catch (er) {
      console.log(er)
    }
  }

  async function handleDelete(id) {
    if (!window.confirm("Delete this booking record?")) return
    try {
      await api.delete(`/bookings/${id}`)
      setBookings(bookings.filter(task => task.id !== id))
    } catch (er) {
      console.log(er)
    }
  }

  async function submitReview(e, expertId) {
    e.preventDefault()
    try {
      await api.post("/reviews", {
        expertId,
        rating: reviewData.rating,
        comment: reviewData.comment
      })
      setReviewingId(null)
      setReviewData({ rating: "", comment: "" })
      const res = await api.get("/mybookings")
      setBookings(res.data.bookings)
    } catch (er) {
      console.log(er)
    }
  }

  async function deleteReview(reviewId) {
    try {
      await api.delete(`/reviews/${reviewId}`)
      const res = await api.get("/mybookings")
      setBookings(res.data.bookings)
    } catch (er) {
      console.log(er)
    }
  }

  return (
    <div className="bookings-page">
      <div className="bookings-page-header">
        <h1>{role === "Client" ? "My Bookings" : "Incoming Orders"}</h1>
        <p>{role === "Client" ? "Manage and track your service bookings." : "Review and respond to incoming service requests."}</p>
      </div>

      <div className="bookings-list">
        {bookings.length === 0 ? (
          <div className="empty-state">
            <svg className="empty-state-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
            </svg>
            <h3>{role === "Client" ? "No bookings yet" : "No orders yet"}</h3>
            <p>{role === "Client" ? "Your bookings will appear here once you schedule a service." : "Incoming requests will appear here."}</p>
          </div>
        ) : (
          bookings.map((task) => (
            <div key={task.id} className="booking-card">
              {role === "Client" && (
                <>
                  <div className="booking-card-header">
                    <div>
                      <div className="booking-card-title">
                        {task.expert?.category?.name || "Expert Service"}
                      </div>
                      <div className="booking-card-sub">
                        Expert: {task.expert?.user?.username}
                      </div>
                    </div>
                    <span className={`status-badge status-${task.status}`}>{task.status}</span>
                  </div>

                  <div className="booking-info-row">
                    <div className="booking-info-item">
                      <svg className="booking-info-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="3" y1="10" x2="21" y2="10"/>
                      </svg>
                      {new Date(task.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </div>
                  </div>

                  {task.description && (
                    <div className="booking-description">"{task.description}"</div>
                  )}

                  <div className="booking-actions">
                    {task.status === "PENDING" && (
                      <button className="btn-cancel" onClick={() => handleCancel(task.id)}>
                        Cancel Booking
                      </button>
                    )}
                    {task.status === "CONFIRMED" && (
                      <button className="btn-complete" onClick={() => handleStatus(task.id, "COMPLETED")}>
                        Mark as Completed
                      </button>
                    )}
                    {(task.status === "COMPLETED" || task.status === "REJECTED") && (
                      <button className="btn-delete" onClick={() => handleDelete(task.id)}>
                        Delete Record
                      </button>
                    )}
                  </div>

                  {task.status === "COMPLETED" && (
                    <div className="review-section">
                      <button
                        className="review-toggle-btn"
                        onClick={() => setReviewingId(task.id === reviewingId ? null : task.id)}
                      >
                        {reviewingId === task.id ? "Cancel" : "Leave a review"}
                      </button>

                      {reviewingId === task.id && (
                        <form className="review-form" onSubmit={(e) => submitReview(e, task.expertId)}>
                          <input
                            type="number"
                            placeholder="Rating 1-5"
                            min="1"
                            max="5"
                            required
                            value={reviewData.rating}
                            onChange={(e) => setReviewData({ ...reviewData, rating: e.target.value })}
                          />
                          <input
                            type="text"
                            placeholder="Share your experience..."
                            required
                            value={reviewData.comment}
                            onChange={(e) => setReviewData({ ...reviewData, comment: e.target.value })}
                          />
                          <button type="submit">Submit</button>
                        </form>
                      )}

                      {task.review && (
                        <div className="existing-review">
                          <div className="review-stars">
                            {task.review.rating}/5 stars
                          </div>
                          <div className="review-comment">"{task.review.comment}"</div>
                          <button
                            className="btn-delete"
                            onClick={() => deleteReview(task.review.id)}
                          >
                            Delete Review
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </>
              )}

              {role === "Expert" && (
                <>
                  <div className="booking-card-header">
                    <div>
                      <div className="booking-card-title">Request from {task.client?.username}</div>
                      <div className="booking-card-sub">{task.client?.phoneNumber}</div>
                    </div>
                    <span className={`status-badge status-${task.status}`}>{task.status}</span>
                  </div>

                  {task.description && (
                    <div className="booking-description">"{task.description}"</div>
                  )}

                  <div className="booking-info-row">
                    <div className="booking-info-item">
                      <svg className="booking-info-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="3" y1="10" x2="21" y2="10"/>
                      </svg>
                      {new Date(task.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })} at {new Date(task.date).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>

                  {task.status === "PENDING" && (
                    <div className="booking-actions">
                      <button className="btn-accept" style={{ background: 'var(--success)', color: 'white', flex: 1, padding: '10px' }} onClick={() => handleStatus(task.id, "CONFIRMED")}>Accept</button>
                      <button className="btn-reject" onClick={() => handleStatus(task.id, "REJECTED")}>Reject</button>
                    </div>
                  )}
                </>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  )
}

export default MyBooking
