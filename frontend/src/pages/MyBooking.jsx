import React, { useState, useEffect } from 'react'
import { api } from "../api"

const MyBooking = () => {
    let [role, setRole] = useState("")
    const [status, setStatus]= useState(true)
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
    async function handleStatus(bookingId, newStatus){
        try{
            await api.put(`/bookings/${bookingId}`, {status:newStatus})
            alert(`Booking ${newStatus}!`)
            setBookings(bookings.map((task)=>
            task.id===bookingId ? {...task,status:newStatus} :task
        ))
        }
        catch(Er){
            console.lpg(Er)
            alert("Failed to update status")
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
                                </>
                            )}
                            {role === "Expert" && (
                                <>
                                    <h3>Request from: {task.client?.username}</h3>
                                    <p>📞 Phone: {task.client?.phoneNumber}</p>
                                    <p>📝 Task: "{task.description}"</p>
                                    <p>📅 Date: {new Date(task.date).toLocaleDateString()}</p>
                                    <div className="actions">
                                        <button className="accept-btn" onClick={()=>(handleStatus(task.id,"CONFIRMED"))}>Accept</button>
                                        <button className="reject-btn" onClick={()=>(handleStatus(task.id,"REJECTED"))}>Reject</button>
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