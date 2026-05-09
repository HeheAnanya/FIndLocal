import React, { useState, useEffect } from 'react'
import { api } from "../api"
import "../css/profile.css"

const Profile = () => {
  const [userData, setUserData] = useState({ username: "", email: "", phoneNumber: "" })
  const [passwords, setPasswords] = useState({ curr: "", latest: "" })
  const [profileMsg, setProfileMsg] = useState({ text: "", type: "" })
  const [passMsg, setPassMsg] = useState({ text: "", type: "" })

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

  function handlePassChange(e) {
    setPasswords({ ...passwords, [e.target.name]: e.target.value })
  }

  async function handleUpdateProfile(e) {
    e.preventDefault()
    try {
      await api.put("/user/update", userData)
      setProfileMsg({ text: "Profile updated successfully.", type: "success" })
    } catch (err) {
      setProfileMsg({ text: err.response?.data?.error || "Update failed", type: "error" })
    }
  }

  async function handleUpdatePassword(e) {
    e.preventDefault()
    try {
      await api.put("/user/change_password", { curr: passwords.curr, latest: passwords.latest })
      setPassMsg({ text: "Password updated successfully.", type: "success" })
      setPasswords({ curr: "", latest: "" })
    } catch (err) {
      setPassMsg({ text: err.response?.data?.error || "Failed to update password", type: "error" })
    }
  }

  const msgStyle = (type) => ({
    fontSize: '13px',
    padding: '10px 14px',
    borderRadius: 'var(--radius-sm)',
    background: type === 'success' ? 'var(--confirmed-bg)' : 'var(--rejected-bg)',
    color: type === 'success' ? 'var(--confirmed-color)' : 'var(--rejected-color)',
    border: `1px solid ${type === 'success' ? '#a8dfbf' : '#f5c0be'}`,
    marginTop: '4px'
  })

  return (
    <div className="profile-page">
      <div className="profile-page-header">
        <h1>My Profile</h1>
        <p>Manage your personal information and account security.</p>
      </div>

      <div className="profile-card">
        <div className="profile-card-banner"></div>
        <div className="profile-card-body">
          <div className="profile-avatar-section">
            <div className="profile-avatar">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
              </svg>
            </div>
          </div>

          <p className="profile-section-title">Personal Information</p>

          <form onSubmit={handleUpdateProfile}>
            <div className="profile-fields">
              <div className="profile-field-group">
                <label>Full name</label>
                <input type="text" value={userData.username} name="username" onChange={handleChanges} />
              </div>
              <div className="profile-field-group">
                <label>Email address</label>
                <input type="email" value={userData.email} name="email" onChange={handleChanges} />
              </div>
              <div className="profile-field-group">
                <label>Phone number</label>
                <input type="text" value={userData.phoneNumber} name="phoneNumber" onChange={handleChanges} maxLength={10} />
              </div>
            </div>
            {profileMsg.text && <div style={msgStyle(profileMsg.type)}>{profileMsg.text}</div>}
            <button type="submit" className="profile-update-btn" style={{ marginTop: '20px' }}>
              Save Changes
            </button>
          </form>
        </div>
      </div>

      <div className="security-card">
        <h3>Change Password</h3>
        <form onSubmit={handleUpdatePassword}>
          <div className="password-fields">
            <div className="password-field-group">
              <label>Current password</label>
              <input type="password" name="curr" placeholder="Enter current password" value={passwords.curr} onChange={handlePassChange} required />
            </div>
            <div className="password-field-group">
              <label>New password</label>
              <input type="password" name="latest" placeholder="Enter new password" value={passwords.latest} onChange={handlePassChange} required />
            </div>
          </div>
          {passMsg.text && <div style={{ ...msgStyle(passMsg.type), marginBottom: '16px' }}>{passMsg.text}</div>}
          <button type="submit" className="password-update-btn">Update Password</button>
        </form>
      </div>
    </div>
  )
}

export default Profile
