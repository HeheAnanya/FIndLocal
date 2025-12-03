import React, { useEffect, useState } from "react";
import { api } from "../api";
import "../css/reviews.css";

const MyReviews = () => {
    const [reviews, setReviews] = useState([]);
    useEffect(() => {
        const fetchReviews = async () => {
            try {
                const res = await api.get("/myreviews");
                setReviews(res.data);
            } catch (err) {
                console.log(err);
            }
        };
        fetchReviews();
    }, []);

    const deleteReview = async (id) => {
        if (!window.confirm("Delete this review?")) return;
        try {
            await api.delete(`/reviews/${id}`);
            setReviews(reviews.filter((r) => r.id !== id));
            alert("Review deleted");
        } catch (err) {
            console.log(err);
        }
    };
    return (
        <div className="reviews-page">
            <h2>My Reviews</h2>
            {reviews.length === 0 ? (
                <p>You haven’t written any reviews yet.</p>
            ) : (
                reviews.map((r) => (
                    <div key={r.id} className="review-card">
                        <h3>{r.expert.user.username}</h3>
                        <p>{r.expert.category.name}</p>
                        <p>⭐ {r.rating}</p>
                        <p>"{r.comment}"</p>
                        <button onClick={() => deleteReview(r.id)} className="delete-btn">
                            Delete Review
                        </button>
                    </div>
                ))
            )}
        </div>
    );
};

export default MyReviews;
