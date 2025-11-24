import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom' 
import { api } from '../api'
// import "../css/ser,vices.css" 

const Services = () => {
    const { type } = useParams() 
    const [experts, setExperts] = useState([])

    useEffect(() => {
        const fetchExperts = async () => {
            try {
                const res = await api.get(`/experts/${type}`)
                setExperts(res.data)
            } catch (err) {
                console.log(err)
            }
        }
        fetchExperts()
    }, [type])

    return (
        <div className="services-page">
            <h1>Best {type}s Near You</h1>
            
            <div className="experts-list">
                {experts.length === 0 ? (
                    <p>No experts found in this category yet.</p>
                ) : (
                    experts.map((expert) => (
                        <div key={expert.id} className="expert-card">
                            <h3>{expert.user.username}</h3>
                            <p>📍 {expert.city}</p>
                            <p>💰 Starts at ₹{expert.priceStart}</p>
                            <p>⭐ Rating: {expert.rating}</p>
                            <button>Book Now</button>
                        </div>
                    ))
                )}
            </div>
        </div>
    )
}

export default Services