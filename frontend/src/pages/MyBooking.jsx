import React, { useState, useEffect } from 'react'
import { api } from "../api"

const MyBooking = () => {
    let [role, setRole] = useState("")
    const [status, setStatus] = useState(true)
    const [bookings, setBookings] = useState([])
    useEffect(() => {
        const fetching = async () => {
            const user = localStorage.getItem("user")
            if (user) {
                const person = JSON.parse(user)
                setRole(person.role)
            }
            try {
                let res = await api.get("/mybookings")
                setBookings(res.data)
            }
            catch (er) {
                console.log(er)
            }
        }
        fetching()

    }, [])
    async function handleStatus(bookingId, newStatus) {
        try {
            await api.put(`/bookings/${bookingId}`, { status: newStatus })
            alert(`Booking ${newStatus}!`)
            setBookings(bookings.map((task) =>
                task.id === bookingId ? { ...task, status: newStatus } : task
            ))
        }
        catch (Er) {
            console.lpg(Er)
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

    return (
        <div className='booking'>
            <h1>{role === "Client" ? "My Bookings" : "Incoming Orders"}</h1>
            <div className='list'>
                {bookings.length === 0 ?
                    (<p>No bookings found.</p>) :
                    (bookings.map((task) => (
                        <div key={task.id} className="card">
                            {role === "Client" && (
                                <>
                                    <h3>Service: {task.expert?.category?.name || "Expert Service"}</h3>
                                    <p>👨‍🔧 Expert: <b>{task.expert?.user?.username}</b></p>
                                    <p>📅 Date: {new Date(task.date).toLocaleDateString()}</p>
                                    <p>ℹ️ Status: <span className={`status-${task.status}`}>{task.status}</span></p>
                                    {task.status === "PENDING" && (
                                        <button className='cancel' onClick={() => (handleCancel(task.id))}
                                            style={{ backgroundColor: '#ff4d4d', color: 'white', border: 'none', padding: '5px 10px', marginTop: '10px', borderRadius: '5px', cursor: 'pointer' }}
                                        >
                                            Cancel Booking

                                        </button>
                                    )}
                                </>
                            )}
                            {task.status === "CONFIRMED" && (
                                <button
                                    onClick={() => handleStatus(task.id, "COMPLETED")}
                                    style={{ backgroundColor: '#28a745', color: 'white', padding: '5px 10px', border: 'none', cursor: 'pointer' }}
                                >
                                    Mark as Completed
                                </button>
                            )}
                            {task.status === "COMPLETED" && (
                                <div>
                                    <button>

                                    </button>
                                </div>
                            )}
                            {role === "Expert" && (
                                <>
                                    <h3>Request from: {task.client?.username}</h3>
                                    <p>📞 Phone: {task.client?.phoneNumber}</p>
                                    <p>📝 Task: "{task.description}"</p>
                                    <p>📅 Date: {new Date(task.date).toLocaleDateString()}</p>
                                    <div className="actions">
                                        <button className="accept-btn" onClick={() => (handleStatus(task.id, "CONFIRMED"))}>Accept</button>
                                        <button className="reject-btn" onClick={() => (handleStatus(task.id, "REJECTED"))}>Reject</button>
                                    </div>
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



// import React, { useState, useEffect } from 'react'
// import { api } from "../api"

// const MyBooking = () => {
//     let [role, setRole] = useState("")
//     const [bookings, setBookings] = useState([])
    
//     // NEW: State for Review Form
//     const [reviewData, setReviewData] = useState({ rating: "", comment: "" })
//     const [reviewingId, setReviewingId] = useState(null) // Which booking is being reviewed?

//     useEffect(() => {
//         const fetching = async () => {
//             const user = localStorage.getItem("user")
//             if (user) {
//                 const person = JSON.parse(user)
//                 setRole(person.role)
//             }
//             try {
//                 let res = await api.get("/mybookings")
//                 setBookings(res.data)
//             } catch (er) {
//                 console.log(er)
//             }
//         }
//         fetching()
//     }, [])

//     // Shared function for changing status (Used for Accept, Reject, AND Completed)
//     async function handleStatus(bookingId, newStatus) {
//         try {
//             await api.put(`/bookings/${bookingId}`, { status: newStatus })
//             alert(`Status updated to ${newStatus}!`)
//             setBookings(bookings.map((task) =>
//                 task.id === bookingId ? { ...task, status: newStatus } : task
//             ))
//         } catch (Er) {
//             console.log(Er)
//             alert("Failed to update status")
//         }
//     }

//     async function handleCancel(bookingId) {
//         if (!window.confirm("Are you sure you want to cancel this booking?")) return;
//         try {
//             await api.delete(`/bookings/${bookingId}`)
//             alert("Booking Cancelled")
//             setBookings(bookings.filter((task) => task.id !== bookingId))
//         } catch (er) {
//             console.log(er)
//             alert(er.response?.data?.error || "Failed to cancel")
//         }
//     }

//     // NEW: Submit Review Function
//     async function submitReview(e, expertId) {
//         e.preventDefault()
//         try {
//             await api.post("/reviews", {
//                 expertId: expertId,
//                 rating: reviewData.rating,
//                 comment: reviewData.comment
//             })
//             alert("Review Submitted!")
//             setReviewingId(null) // Hide form
//             setReviewData({ rating: "", comment: "" }) // Reset form
//         } catch (er) {
//             console.log(er)
//             alert("Failed to submit review")
//         }
//     }

//     return (
//         <div className='booking'>
//             <h1>{role === "Client" ? "My Bookings" : "Incoming Orders"}</h1>
//             <div className='list'>
//                 {bookings.length === 0 ? (<p>No bookings found.</p>) : (
//                     bookings.map((task) => (
//                         <div key={task.id} className="card" style={{border:'1px solid #ccc', padding:'15px', margin:'10px', borderRadius:'8px'}}>
                            
//                             {/* --- CLIENT VIEW --- */}
//                             {role === "Client" && (
//                                 <>
//                                     <h3>Service: {task.expert?.category?.name || "Expert Service"}</h3>
//                                     <p>👨‍🔧 Expert: <b>{task.expert?.user?.username}</b></p>
//                                     <p>📅 Date: {new Date(task.date).toLocaleDateString()}</p>
//                                     <p>ℹ️ Status: <span className={`status-${task.status}`}>{task.status}</span></p>
                                    
//                                     {/* 1. CANCEL Button (Only if Pending) */}
//                                     {task.status === "PENDING" && (
//                                         <button 
//                                             className='cancel' 
//                                             onClick={() => handleCancel(task.id)} // <--- FIXED BUG HERE
//                                             style={{ backgroundColor: '#ff4d4d', color: 'white', padding: '5px 10px', border:'none', cursor:'pointer' }}
//                                         >
//                                             Cancel Booking
//                                         </button>
//                                     )}

//                                     {/* 2. MARK COMPLETED Button (Only if Confirmed) */}
//                                     {task.status === "CONFIRMED" && (
//                                         <button 
//                                             onClick={() => handleStatus(task.id, "COMPLETED")}
//                                             style={{ backgroundColor: '#28a745', color: 'white', padding: '5px 10px', border:'none', cursor:'pointer' }}
//                                         >
//                                             Mark as Completed
//                                         </button>
//                                     )}

//                                     {/* 3. REVIEW FORM (Only if Completed) */}
//                                     {task.status === "COMPLETED" && (
//                                         <div style={{marginTop:'10px', borderTop:'1px dashed #ccc', paddingTop:'10px'}}>
//                                             <button onClick={() => setReviewingId(task.id)}>
//                                                 {reviewingId === task.id ? "Cancel Review" : "★ Leave a Review"}
//                                             </button>
                                            
//                                             {/* Show Form only if this specific card is being reviewed */}
//                                             {reviewingId === task.id && (
//                                                 <form onSubmit={(e) => submitReview(e, task.expertId)} style={{marginTop:'10px'}}>
//                                                     <input 
//                                                         type="number" 
//                                                         placeholder="Rating (1-5)" 
//                                                         min="1" max="5" 
//                                                         required
//                                                         value={reviewData.rating}
//                                                         onChange={(e) => setReviewData({...reviewData, rating: e.target.value})}
//                                                         style={{width: '60px', marginRight:'10px'}}
//                                                     />
//                                                     <input 
//                                                         type="text" 
//                                                         placeholder="Comment" 
//                                                         required
//                                                         value={reviewData.comment}
//                                                         onChange={(e) => setReviewData({...reviewData, comment: e.target.value})}
//                                                     />
//                                                     <button type="submit" style={{marginLeft:'5px'}}>Submit</button>
//                                                 </form>
//                                             )}
//                                         </div>
//                                     )}
//                                 </>
//                             )}

//                             {/* --- EXPERT VIEW (Unchanged) --- */}
//                             {role === "Expert" && (
//                                 <>
//                                     <h3>Request from: {task.client?.username}</h3>
//                                     <p>📞 Phone: {task.client?.phoneNumber}</p>
//                                     <p>📝 Task: "{task.description}"</p>
//                                     <p>📅 Date: {new Date(task.date).toLocaleDateString()}</p>
//                                     {task.status === "PENDING" ? (
//                                         <div className="actions">
//                                             <button className="accept-btn" onClick={() => handleStatus(task.id, "CONFIRMED")}>Accept</button>
//                                             <button className="reject-btn" onClick={() => handleStatus(task.id, "REJECTED")}>Reject</button>
//                                         </div>
//                                     ) : (
//                                         <p><b>Status: {task.status}</b></p>
//                                     )}
//                                 </>
//                             )}
//                         </div>
//                     ))
//                 )}
//             </div>
//         </div>
//     )
// }

// export default MyBooking