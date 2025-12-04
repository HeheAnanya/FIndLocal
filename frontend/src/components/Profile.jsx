import React, { useState, useEffect } from 'react'
import { api } from "../api"
import "../css/expert.css"

const Profile = () => {
    const [userData, setUserData] = useState({
        username: "",
        email: "",
        phoneNumber: ""
    })

    const [passwords, setPasswords] = useState({
        curr: "",
        latest: ""
    })

    useEffect(() => {
        async function fetchProfile() {
            try {
                const res = await api.get("/profile")
                if (res.data.user) {
                    setUserData({
                        username: res.data.user.username,
                        email: res.data.user.email,
                        phoneNumber: res.data.user.phoneNumber
                    })
                }
            } catch (er) {
                console.log("Error fetching profile:", er)
            }
        }
        fetchProfile()
    }, [])
    function handleChanges(e) {
        setUserData({ ...userData, [e.target.name]: e.target.value })
    }
    // Handle Password Inputs
    function handlePassChange(e) {
        setPasswords({ ...passwords, [e.target.name]: e.target.value })
    }
    async function handleUpdateProfile() {
    try {
        await api.put("/user/update", userData);
        alert("✅ Profile updated!");
    } catch (err) {
        console.log(err);
        alert("❌ " + (err.response?.data?.error || "Update failed"));
    }
}

    async function handleUpdatePassword(e) {
        e.preventDefault()
        try {
            await api.put("/user/change_password", {
                curr: passwords.curr,
                latest: passwords.latest
            })
            alert("✅ Password updated successfully!")
            setPasswords({ curr: "", latest: "" })
        } catch (err) {
            console.error(err)
            alert("❌ " + (err.response?.data?.error || "Failed to update password"))
        }
    }

    return (
        <div className='expert'>
            <div className="expert-form-wrapper" style={{ maxWidth: '600px', margin: '0 auto' }}>
                <form>
                    <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>My Profile</h2>
                    <div style={{ textAlign: 'center', marginBottom: '20px' }}>
                        <img
                            className='person'
                            src="https://png.pngtree.com/png-vector/20190909/ourmid/pngtree-outline-user-icon-png-image_1727916.jpg"
                            alt="Profile"
                            style={{ width: '100px', height: '100px', margin: '0 auto' }}
                        />
                    </div>

                    <label>Username:</label>
                    <input type='text' value={userData.username} style={{ background: '#f0f0f0' }} onChange={(handleChanges)}
                        name='username' />

                    <label>Email:</label>
                    <input type='text' value={userData.email} style={{ background: '#f0f0f0' }} onChange={(handleChanges)}
                        name='email' />

                    <label>Phone Number:</label>
                    <input type='text' value={userData.phoneNumber} style={{ background: '#f0f0f0' }} onChange={(handleChanges)}
                        name='phoneNumber' maxLength={10}/>
                </form>
                <button
                    type="button"
                    onClick={handleUpdateProfile}
                    style={{ marginTop: "15px", backgroundColor: "#4CAF50" }}
                >
                    Update Profile
                </button>

                {/* --- SECURITY SECTION --- */}
                <form onSubmit={handleUpdatePassword} style={{ marginTop: '30px', borderTop: '1px solid #ddd', paddingTop: '20px' }}>
                    <h3>Change Password</h3>

                    <label>Current Password:</label>
                    <input
                        type='password'
                        name="curr"
                        placeholder='Enter current password'
                        value={passwords.curr}
                        onChange={handlePassChange}
                        required
                    />

                    <label>New Password:</label>
                    <input
                        type='password'
                        name="latest"
                        placeholder='Enter new password'
                        value={passwords.latest}
                        onChange={handlePassChange}
                        required
                    />

                    <button type="submit" style={{ backgroundColor: '#ff4d4d', marginTop: '10px' }}>
                        Update Password
                    </button>
                </form>
            </div>
        </div>
    )
}

export default Profile