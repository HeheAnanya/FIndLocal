import React, { useState, useEffect } from 'react'
import { api } from "../api.js"
import "../css/expert.css"

const Expert = () => {
    let [categories, setCategories] = useState([])
    const [hasProfile, setHasProfile] = useState(false)
    const [isEditing, setIsEditing] = useState(false)
    const [profileData, setProfileData] = useState(null)
    const [forms, setForms] = useState({
        bio: "",
        city: "",
        categoryId: "",
        experience: "",
        priceStart: ""
    })
    function handleChange(e) {
        setForms({
            ...forms,
            [e.target.name]: e.target.value
        })
    }

    async function handleSubmit(e) {
        e.preventDefault()
        try {
            await api.put("/expert/profile", {
                ...forms,
                // Ensure numbers are sent as numbers, not strings
                priceStart: Number(forms.priceStart),
                experience: Number(forms.experience),
                categoryId: Number(forms.categoryId)
            })
            alert("Profile Updated Successfully!")
            setHasProfile(true)
            setIsEditing(false)
            // Refresh profile data
            const profileRes = await api.get("/expert/profile")
            setProfileData(profileRes.data)
        } catch (err) {
            console.error(err)
            alert("Failed to update profile")
        }
    }
    useEffect(() => {
        async function fetchData() {
            try {
                // Fetch categories
                const categoriesRes = await api.get("/categories")
                setCategories(categoriesRes.data)

                // Fetch expert profile
                const profileRes = await api.get("/expert/profile")
                if (profileRes.data) {
                    setHasProfile(true)
                    setProfileData(profileRes.data)
                    setForms({
                        bio: profileRes.data.bio,
                        city: profileRes.data.city,
                        categoryId: profileRes.data.categoryId,
                        experience: profileRes.data.experience,
                        priceStart: profileRes.data.priceStart
                    })
                } else {
                    setHasProfile(false)
                    setIsEditing(true) // Show form if no profile
                }
            }
            catch (er) {
                console.log(er)
                setIsEditing(true) // Show form on error
            }
        }
        fetchData()
    }, [])
    return (
        <div className='expert'>
            {hasProfile && !isEditing ? (
                // Profile View Mode - Jira Style
                <div className="profile-view">
                    <div className="profile-header-banner"></div>
                    <div className="profile-content">
                        <div className="profile-left">
                            <div className="profile-avatar-section">
                                <img className='person' alt="Profile" />
                                <h2>{categories.find(cat => cat.id === profileData?.categoryId)?.name || 'Expert'}</h2>
                                <button className="manage-btn" onClick={() => setIsEditing(true)}>
                                    Manage your account
                                </button>
                            </div>

                            <div className="profile-section">
                                <h3>ABOUT</h3>
                                <div className="about-item">
                                    <span className="icon">💼</span>
                                    <div>
                                        <div className="label">Service Category</div>
                                        <div className="value">{categories.find(cat => cat.id === profileData?.categoryId)?.name || 'N/A'}</div>
                                    </div>
                                </div>
                                <div className="about-item">
                                    <span className="icon">📍</span>
                                    <div>
                                        <div className="label">City</div>
                                        <div className="value">{profileData?.city}</div>
                                    </div>
                                </div>
                                <div className="about-item">
                                    <span className="icon">⭐</span>
                                    <div>
                                        <div className="label">Experience</div>
                                        <div className="value">{profileData?.experience} years</div>
                                    </div>
                                </div>
                                <div className="about-item">
                                    <span className="icon">💰</span>
                                    <div>
                                        <div className="label">Starting Price</div>
                                        <div className="value">₹{profileData?.priceStart}</div>
                                    </div>
                                </div>
                            </div>

                            <div className="profile-section">
                                <h3>BIO</h3>
                                <p className="bio-text">{profileData?.bio}</p>
                            </div>
                        </div>
                    </div>
                </div>
            ) : (
                // Edit Form Mode
                <div className="expert-form-wrapper">
                    <form onSubmit={handleSubmit}>
                        <img className='person' alt="Profile" />
                        <label>Bio:</label>
                        <textarea placeholder='Write something about you' value={forms.bio} name="bio" onChange={handleChange} />
                        <label> City:</label>
                        <input type='text' name='city' required placeholder='City' value={forms.city} onChange={handleChange} />
                        <label>Experience:</label>
                        <input type='text' name="experience" value={forms.experience} placeholder='Experience in years' required onChange={handleChange} />
                        <label>Price:</label>
                        <input
                            type='number'
                            name="priceStart"
                            placeholder='e.g. 500'
                            value={forms.priceStart}
                            onChange={handleChange}
                            required
                        />
                        <label>Service Category:</label>
                        <select name="categoryId" onChange={handleChange} value={forms.categoryId} required>
                            <option value="">Select a Service</option>
                            {categories.map((work) => (
                                <option key={work.id} value={work.id}>
                                    {work.name}
                                </option>
                            ))}
                        </select>
                        <button type="submit">Save Profile</button>
                        {hasProfile && (
                            <button type="button" onClick={() => setIsEditing(false)} className="cancel-btn">
                                Cancel
                            </button>
                        )}
                    </form>
                </div>
            )}
        </div>
    )
}

export default Expert