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
                
                let res = await api.get("/mybookings")
                setBookings(res.data.bookings.map((b)=>(
                    {
                        ...b,
                        review: b.reviews?.length ? b.reviews[0] : null
                    }
                )))
            } catch (er) {
                console.log(er)
            }
        }
        fetching()
    }, [])

    async function handleStatus(bookingId, newStatus) {
        try {
            await api.put(`/bookings/${bookingId}`, { status: newStatus })
            alert(`Status updated to ${newStatus}!`)
            setBookings(bookings.map((task) =>
                task.id === bookingId ? { ...task, status: newStatus } : task
            ))
        } catch (er) {
            console.log(er)
            alert("Failed to update status")
        }
    }

    async function handleCancel(bookingId) {
        if (!window.confirm("Are you sure you want to cancel this booking?")) return;

        try {
            await api.delete(`/bookings/${bookingId}`)
            alert("Booking Cancelled")
            setBookings(bookings.filter((task) => task.id !== bookingId))
        } catch (er) {
            console.log(er)
            alert(er.response?.data?.error || "Failed to cancel")
        }
    }

    async function handleDelete(id) {
        if (!window.confirm("Are you sure you want to delete this booking?")) return;

        try {
            await api.delete(`/bookings/${id}`);
            alert("Booking deleted successfully");
            setBookings(bookings.filter((task) => task.id !== id));
        } catch (er) {
            console.log(er)
            alert("Failed to delete booking");
        }
    }

    async function submitReview(e, expertId) {
        e.preventDefault()
        try {
            await api.post("/reviews", {
                expertId: expertId,
                rating: reviewData.rating,
                comment: reviewData.comment
            })
            alert("Review Submitted Successfully!")
            setReviewingId(null)
            setReviewData({ rating: "", comment: "" })
        } catch (er) {
            console.log(er)
            alert("Failed to submit review")
        }
    }
    async function deleteReview(reviewId) {
        try {
            await api.delete(`/reviews/${reviewId}`)
            alert("Review Deleted Successfully")
        }
        catch (er) {
            alert(er.response?.data?.error || "Can't Delete the Review, Please try again later")
            console.log(er)
        }


    }

    return (
        <div className='booking'>
            <h1>{role === "Client" ? "My Bookings" : "Incoming Orders"}</h1>
            <div className='list'>
                {bookings.length === 0 ? (
                    <p>No bookings found.</p>
                ) : (
                    bookings.map((task) => (
                        <div key={task.id} className="card"
                            style={{ border: '1px solid #ddd', padding: '15px', margin: '10px', borderRadius: '8px', background: 'white' }}>

                            {/* CLIENT UI */}
                            {role === "Client" && (
                                <>
                                    <h3>Service: {task.expert?.category?.name || "Expert Service"}</h3>
                                    <p>👨‍🔧 Expert: <b>{task.expert?.user?.username}</b></p>
                                    <p>📅 Date: {new Date(task.date).toLocaleDateString()}</p>
                                    <p>ℹ️ Status: <span className={`status-${task.status}`}>{task.status}</span></p>

                                    {task.status === "PENDING" && (
                                        <button
                                            onClick={() => handleCancel(task.id)}
                                            style={{ backgroundColor: '#ff4d4d', color: 'white', border: 'none', padding: '8px 12px', marginTop: '10px', borderRadius: '5px', cursor: 'pointer' }}>
                                            Cancel Booking
                                        </button>
                                    )}

                                    {task.status === "CONFIRMED" && (
                                        <button
                                            onClick={() => handleStatus(task.id, "COMPLETED")}
                                            style={{ backgroundColor: '#28a745', color: 'white', padding: '8px 12px', border: 'none', borderRadius: '5px', marginTop: '10px', cursor: 'pointer' }}>
                                            Mark as Completed
                                        </button>
                                    )}

                                    {/* Review Section */}
                                    {task.status === "COMPLETED" && (
                                        <div style={{ marginTop: '15px', borderTop: '1px dashed #ccc', paddingTop: '10px' }}>
                                            <button
                                                onClick={() => setReviewingId(task.id === reviewingId ? null : task.id)}
                                                style={{ background: 'none', border: 'none', color: '#007bff', cursor: 'pointer', textDecoration: 'underline' }}>
                                                {reviewingId === task.id ? "Cancel Review" : "★ Leave a Review"}
                                            </button>

                                            {reviewingId === task.id && (
                                                <form onSubmit={(e) => submitReview(e, task.expertId)}
                                                    style={{ marginTop: '10px', display: 'flex', gap: '10px' }}>
                                                    <input type="number" placeholder="Rating (1-5)" min="1" max="5" required
                                                        value={reviewData.rating}
                                                        onChange={(e) => setReviewData({ ...reviewData, rating: e.target.value })}
                                                        style={{ width: '80px', padding: '5px' }} />
                                                    <input type="text" placeholder="Write a comment..." required
                                                        value={reviewData.comment}
                                                        onChange={(e) => setReviewData({ ...reviewData, comment: e.target.value })}
                                                        style={{ flex: 1, padding: '5px' }} />
                                                    <button type="submit"
                                                        style={{ backgroundColor: '#007bff', color: 'white', padding: '5px 10px', border: 'none', borderRadius: '5px' }}>
                                                        Submit
                                                    </button>
                                                </form>
                                            )}
                                        </div>
                                    )}
                                    {task.review && (
                                        <div className='review'>
                                            <p style={{ fontSize: "14px", marginTop: "10px" }}>
                                                ⭐ {task.review.rating} / 5
                                                <br />
                                                "{task.review.comment}"
                                            </p>
                                            <button onClick={()=>deleteReview(task.review.id)} style={{ backgroundColor: '#333', color: 'white', border: 'none', padding: '8px 12px', marginTop: '10px', borderRadius: '5px', cursor: 'pointer' }}
                                                >Delete Review</button>

                                        </div>
                                    )}

                                    {/* DELETE Button */}
                                    {(task.status === "COMPLETED" || task.status === "REJECTED") && (
                                        <button
                                            onClick={() => handleDelete(task.id)}
                                            style={{ backgroundColor: '#333', color: 'white', border: 'none', padding: '8px 12px', marginTop: '10px', borderRadius: '5px', cursor: 'pointer' }}>
                                            Delete Booking
                                        </button>
                                    )}
                                </>
                            )}

                            {/* EXPERT UI */}
                            {role === "Expert" && (
                                <>
                                    <h3>Request from: {task.client?.username}</h3>
                                    <p>📞 Phone: {task.client?.phoneNumber}</p>
                                    <p>📝 Task: "{task.description}"</p>
                                    <p>📅 Date: {new Date(task.date).toLocaleDateString()}</p>

                                    {task.status === "PENDING" ? (
                                        <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                                            <button
                                                onClick={() => handleStatus(task.id, "CONFIRMED")}
                                                style={{ backgroundColor: '#28a745', color: 'white', padding: '8px 12px', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>
                                                Accept
                                            </button>
                                            <button
                                                onClick={() => handleStatus(task.id, "REJECTED")}
                                                style={{ backgroundColor: '#dc3545', color: 'white', padding: '8px 12px', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>
                                                Reject
                                            </button>
                                        </div>
                                    ) : (
                                        <p style={{ marginTop: '10px' }}>
                                            <b>Status: <span className={`status-${task.status}`}>{task.status}</span></b>
                                        </p>
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
