// import React, { useState, useEffect } from 'react'
// import { api } from "../api"
// import "../css/profile.css"

// const Profile = () => {
//     const [userData, setUserData] = useState({
//         username: "",
//         email: "",
//         phoneNumber: ""
//     })
//     const [passwords, setPasswords] = useState({
//         curr: "",
//         latest: ""
//     })
//     useEffect(() => {
//         async function fetchProfile() {
//             try {
//                 const res = await api.get("/profile")
//                 if (res.data.user) {
//                     setUserData({
//                         username: res.data.user.username,
//                         email: res.data.user.email,
//                         phoneNumber: res.data.user.phoneNumber || ""
//                     })
//                 }
//             } catch (er) {
//                 console.log("Error fetching profile:", er)
//             }
//         }
//         fetchProfile()
//     }, [])

//     function handlePassChange(e) {
//         setPasswords({ ...passwords, [e.target.name]: e.target.value })
//     }

//     async function handleUpdatePassword(e) {
//         e.preventDefault()

//         if (!passwords.curr || !passwords.latest) {
//             alert("Please fill in both password fields")
//             return
//         }

//         try {
//             await api.put("/user/change_password", {
//                 curr: passwords.curr,
//                 latest: passwords.latest
//             })
//             alert("✅ Password updated successfully!")
//             setPasswords({ curr: "", latest: "" })
//         } catch (err) {
//             console.error(err)
//             alert("❌ " + (err.response?.data?.error || "Failed to update password"))
//         }
//     }

//     return (
//         <div className='profile-page'>
//             <div className="profile-view">
//                 <div className="profile-header-banner"></div>
//                 <div className="profile-content">
//                     <div className="profile-left">
//                         <div className="profile-avatar-section">
//                             <img
//                                 className='person'
//                                 src="https://cdn-icons-png.flaticon.com/512/1077/1077114.png"
//                                 alt="User"
//                             />
//                             <h2>{userData.username || 'User'}</h2>
//                             <button className="manage-btn" disabled>
//                                 Client Account
//                             </button>
//                         </div>

//                         <div className="profile-section">
//                             <h3>CONTACT</h3>
//                             <div className="about-item">
//                                 <span className="icon">✉️</span>
//                                 <div>
//                                     <div className="label">Email</div>
//                                     <div className="value">{userData.email}</div>
//                                 </div>
//                             </div>
//                             <div className="about-item">
//                                 <span className="icon">📱</span>
//                                 <div>
//                                     <div className="label">Phone Number</div>
//                                     <div className="value">{userData.phoneNumber}</div>
//                                 </div>
//                             </div>
//                             <div className="about-item">
//                                 <span className="icon">👤</span>
//                                 <div>
//                                     <div className="label">Username</div>
//                                     <div className="value">{userData.username}</div>
//                                 </div>
//                             </div>
//                         </div>

//                         <div className="profile-section">
//                             <h3>SECURITY</h3>
//                             <form onSubmit={handleUpdatePassword}>
//                                 <div className="password-field">
//                                     <label>Current Password</label>
//                                     <input
//                                         type='password'
//                                         name="curr"
//                                         placeholder='Enter current password'
//                                         value={passwords.curr}
//                                         onChange={handlePassChange}
//                                         required
//                                     />
//                                 </div>
//                                 <div className="password-field">
//                                     <label>New Password</label>
//                                     <input
//                                         type='password'
//                                         name="latest"
//                                         placeholder='Enter new password'
//                                         value={passwords.latest}
//                                         onChange={handlePassChange}
//                                         required
//                                     />
//                                 </div>
//                                 <button type="submit" className="change-password-btn">
//                                     Change Password
//                                 </button>
//                             </form>
//                         </div>
//                     </div>
//                 </div>
//             </div>
//         </div>
//     )
// }

import React, { useState, useEffect } from 'react'
import { api } from "../api"
import "../css/expert.css" // Reuse expert styling for consistency

const Profile = () => {
    // State for User Details
    const [userData, setUserData] = useState({
        username: "",
        email: "",
        phoneNumber: ""
    })

    // State for Password Change
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

    // Handle Password Inputs
    function handlePassChange(e) {
        setPasswords({ ...passwords, [e.target.name]: e.target.value })
    }

    // Submit Password Change
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

                    {/* --- PERSONAL DETAILS (Read Only) --- */}
                    <div style={{ textAlign: 'center', marginBottom: '20px' }}>
                        <img
                            className='person'
                            src="https://cdn-icons-png.flaticon.com/512/1077/1077114.png"
                            alt="Profile"
                            style={{ width: '100px', height: '100px', margin: '0 auto' }}
                        />
                    </div>

                    <label>Username:</label>
                    <input type='text' value={userData.username} readOnly disabled style={{ background: '#f0f0f0' }} />

                    <label>Email:</label>
                    <input type='text' value={userData.email} readOnly disabled style={{ background: '#f0f0f0' }} />

                    <label>Phone Number:</label>
                    <input type='text' value={userData.phoneNumber} readOnly disabled style={{ background: '#f0f0f0' }} />
                </form>

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