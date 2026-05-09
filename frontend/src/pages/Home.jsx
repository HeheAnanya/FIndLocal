import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { api } from '../api'
import '../css/home.css'

const services = [
  {
    name: "Plumber",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 15h12a3 3 0 0 0 0-6H3"/><circle cx="18" cy="12" r="3"/><path d="M5 8V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v3"/>
      </svg>
    )
  },
  {
    name: "Electrician",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/>
      </svg>
    )
  },
  {
    name: "Cleaner",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>
      </svg>
    )
  },
  {
    name: "Painter",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M19 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2z"/><path d="M9 8h6M9 12h6M9 16h4"/>
      </svg>
    )
  },
  {
    name: "Carpenter",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14.5 10c-.83 0-1.5-.67-1.5-1.5v-5c0-.83.67-1.5 1.5-1.5s1.5.67 1.5 1.5v5c0 .83-.67 1.5-1.5 1.5z"/><path d="M20.5 10H19V8.5c0-.83.67-1.5 1.5-1.5s1.5.67 1.5 1.5-.67 1.5-1.5 1.5z"/><path d="M9.5 14.5c0 .83-.67 1.5-1.5 1.5s-1.5-.67-1.5-1.5V9c0-.83.67-1.5 1.5-1.5S9.5 8.17 9.5 9v5.5z"/><path d="M3.5 14H5v1.5c0 .83-.67 1.5-1.5 1.5S2 16.33 2 15.5 2.67 14 3.5 14z"/><path d="M9.5 9l5 5"/><path d="M14.5 9l-5 5"/>
      </svg>
    )
  },
  {
    name: "Pest Control",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22a7 7 0 0 1-7-7c0-2.38 1.19-4.47 3-5.74V4a2 2 0 0 1 4 0v5.26C13.81 10.53 15 12.62 15 15a7 7 0 0 1-3 5.83"/><path d="M8 14h8"/><path d="M12 22v-3"/>
      </svg>
    )
  }
]

const Home = () => {
  const navigate = useNavigate()
  const user = JSON.parse(localStorage.getItem("user") || "{}")

  return (
    <div className="home-container">
      <div className="hero-section">
        <div className="hero-content">
          <div className="hero-eyebrow">Trusted by 10,000+ customers</div>
          <h1>Home services, <span>done right</span></h1>
          <p className="hero-subtitle">Book verified local professionals for any home service — fast, reliable, and affordable.</p>
        </div>
      </div>

      <div className="services-section">
        <p className="services-section-title">Browse services</p>
        <div className="category-grid">
          {services.map((cat, index) => (
            <div
              key={index}
              className="category-card"
              onClick={() => navigate(`/services/${cat.name}`)}
            >
              <div className="category-icon-wrap">
                {cat.icon}
              </div>
              <p>{cat.name}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="how-section">
        <div className="how-inner">
          <p className="section-label">How it works</p>
          <h2>Get help in 3 simple steps</h2>
          <div className="steps-grid">
            <div className="step-item">
              <div className="step-number">1</div>
              <h3>Choose a service</h3>
              <p>Browse categories and find the exact type of professional you need.</p>
            </div>
            <div className="step-item">
              <div className="step-number">2</div>
              <h3>Book an expert</h3>
              <p>Review profiles, check ratings, and schedule a time that works for you.</p>
            </div>
            <div className="step-item">
              <div className="step-number">3</div>
              <h3>Job done</h3>
              <p>Your expert arrives, completes the work, and you rate the experience.</p>
            </div>
          </div>
        </div>
      </div>

      <div className="trust-bar">
        <div className="trust-inner">
          <div className="trust-stat">
            <h3>10K+</h3>
            <p>Satisfied customers</p>
          </div>
          <div className="trust-stat">
            <h3>500+</h3>
            <p>Verified experts</p>
          </div>
          <div className="trust-stat">
            <h3>4.8</h3>
            <p>Average rating</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Home
