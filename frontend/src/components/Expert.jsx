import React, { useState, useEffect } from 'react'
import { api } from "../api.js"
import "../css/expert.css"

const Expert = () => {
  const [categories, setCategories] = useState([])
  const [hasProfile, setHasProfile] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [profileData, setProfileData] = useState(null)
  const [msg, setMsg] = useState({ text: "", type: "" })
  const [forms, setForms] = useState({
    bio: "", city: "", categoryId: "", experience: "", priceStart: ""
  })

  function handleChange(e) {
    setForms({ ...forms, [e.target.name]: e.target.value })
  }

  async function handleSubmit(e) {
    e.preventDefault()
    try {
      await api.put("/expert/profile", {
        ...forms,
        priceStart: Number(forms.priceStart),
        experience: Number(forms.experience),
        categoryId: Number(forms.categoryId)
      })
      setMsg({ text: "Profile updated successfully.", type: "success" })
      setHasProfile(true)
      setIsEditing(false)
      const profileRes = await api.get("/expert/profile")
      setProfileData(profileRes.data)
    } catch (err) {
      setMsg({ text: "Failed to update profile.", type: "error" })
    }
  }

  useEffect(() => {
    async function fetchData() {
      try {
        const categoriesRes = await api.get("/categories")
        setCategories(categoriesRes.data)
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
          setIsEditing(true)
        }
      } catch {
        setIsEditing(true)
      }
    }
    fetchData()
  }, [])

  const msgStyle = (type) => ({
    fontSize: '13px',
    padding: '10px 14px',
    borderRadius: 'var(--radius-sm)',
    background: type === 'success' ? 'var(--confirmed-bg)' : 'var(--rejected-bg)',
    color: type === 'success' ? 'var(--confirmed-color)' : 'var(--rejected-color)',
    border: `1px solid ${type === 'success' ? '#a8dfbf' : '#f5c0be'}`,
    marginBottom: '16px'
  })

  return (
    <div>
      {hasProfile && !isEditing ? (
        <div className="expert-profile-page">
          <div className="profile-view-card">
            <div className="profile-banner">
              <div className="profile-avatar-wrap">
                <svg viewBox="0 0 24 24" fill="none" stroke="var(--primary)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ width: '40px', height: '40px' }}>
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
                </svg>
              </div>
            </div>

            <div className="profile-body">
              <div className="profile-name-row">
                <span className="profile-category-tag">
                  {categories.find(cat => cat.id === profileData?.categoryId)?.name || 'Expert'}
                </span>
                <button className="manage-btn" onClick={() => setIsEditing(true)}>
                  Edit Profile
                </button>
              </div>

              <div className="profile-detail-grid">
                <div className="profile-detail-item">
                  <div className="detail-icon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="2" y="7" width="20" height="14" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/>
                    </svg>
                  </div>
                  <div>
                    <div className="detail-label">Category</div>
                    <div className="detail-value">{categories.find(cat => cat.id === profileData?.categoryId)?.name || 'N/A'}</div>
                  </div>
                </div>
                <div className="profile-detail-item">
                  <div className="detail-icon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>
                    </svg>
                  </div>
                  <div>
                    <div className="detail-label">City</div>
                    <div className="detail-value">{profileData?.city}</div>
                  </div>
                </div>
                <div className="profile-detail-item">
                  <div className="detail-icon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
                    </svg>
                  </div>
                  <div>
                    <div className="detail-label">Experience</div>
                    <div className="detail-value">{profileData?.experience} years</div>
                  </div>
                </div>
                <div className="profile-detail-item">
                  <div className="detail-icon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
                    </svg>
                  </div>
                  <div>
                    <div className="detail-label">Starting Price</div>
                    <div className="detail-value">Rs.{profileData?.priceStart}</div>
                  </div>
                </div>
              </div>

              <div className="profile-bio-section">
                <h4>About</h4>
                <p>{profileData?.bio || "No bio added yet."}</p>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="expert-form-wrapper">
          <div className="expert-form-card">
            <div className="avatar-placeholder">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
              </svg>
            </div>

            <h2>{hasProfile ? "Edit Your Profile" : "Set Up Your Profile"}</h2>

            {msg.text && <div style={msgStyle(msg.type)}>{msg.text}</div>}

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div className="expert-form-group">
                <label>Bio</label>
                <textarea
                  placeholder="Write a short introduction about yourself and your expertise..."
                  value={forms.bio}
                  name="bio"
                  onChange={handleChange}
                  style={{ minHeight: '90px', resize: 'vertical' }}
                />
              </div>

              <div className="form-row">
                <div className="expert-form-group">
                  <label>City</label>
                  <input type="text" name="city" required placeholder="e.g. Delhi" value={forms.city} onChange={handleChange} />
                </div>
                <div className="expert-form-group">
                  <label>Experience (years)</label>
                  <input type="number" name="experience" value={forms.experience} placeholder="e.g. 5" required onChange={handleChange} min="0" />
                </div>
              </div>

              <div className="form-row">
                <div className="expert-form-group">
                  <label>Starting Price (Rs.)</label>
                  <input type="number" name="priceStart" placeholder="e.g. 500" value={forms.priceStart} onChange={handleChange} required min="0" />
                </div>
                <div className="expert-form-group">
                  <label>Service Category</label>
                  <select name="categoryId" onChange={handleChange} value={forms.categoryId} required style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath d='M1 1l5 5 5-5' stroke='%238a93a3' stroke-width='1.5' fill='none' stroke-linecap='round'/%3E%3C/svg%3E\")", backgroundRepeat: 'no-repeat', backgroundPosition: 'right 14px center', paddingRight: '40px' }}>
                    <option value="">Select a service</option>
                    {categories.map((work) => (
                      <option key={work.id} value={work.id}>{work.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="expert-form-actions">
                <button type="submit" className="save-btn">Save Profile</button>
                {hasProfile && (
                  <button type="button" className="cancel-btn" onClick={() => setIsEditing(false)}>
                    Cancel
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default Expert
