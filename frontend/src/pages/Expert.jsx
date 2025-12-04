import React, { useEffect, useState } from "react";
import { api } from "../api";
import "../css/dashboard.css";

const Expert = () => {
    const [bookings, setBookings] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                let res = await api.get("/mybookings");
setBookings(res.data.bookings);
            } catch (err) {
                console.error(err);
            }
        };
        fetchData();
    }, []);

    return (
        <div className="expert-container">

            <h1 className="expert-title">Expert Dashboard</h1>

            <div className="expert-stats">
                <div className="stat-card">
                    <h2>{bookings.length}</h2>
                    <p>Total Requests</p>
                </div>

                <div className="stat-card">
                    <h2>{bookings.filter(b => b.status === "CONFIRMED").length}</h2>
                    <p>Upcoming Jobs</p>
                </div>

                <div className="stat-card">
                    <h2>{bookings.filter(b => b.status === "COMPLETED").length}</h2>
                    <p>Completed</p>
                </div>
            </div>

            <h2 className="section-title">Incoming Orders</h2>
            <div className="orders-list">
                {bookings.map((b) => (
                    <div key={b.id} className="order-card">
                        <h3>{b.client?.username}</h3>
                        <p>📞 {b.client?.phoneNumber}</p>
                        <p>📝 {b.description}</p>
                        <p>📅 {new Date(b.date).toLocaleString()}</p>
                        <p>Status: <b className={`tag-${b.status}`}>{b.status}</b></p>

                        {b.status === "PENDING" && (
                            <div className="expert-buttons">
                                <button className="accept">Accept</button>
                                <button className="reject">Reject</button>
                            </div>
                        )}
                    </div>
                ))}
            </div>

        </div>
    );
};

export default Expert;
