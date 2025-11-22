import React from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar' 
import '../css/home.css' 

const Home = () => {
  const navigate = useNavigate()
    const services = [
    { name: "Plumber", icon: "🔧" },
    { name: "Electrician", icon: "💡" },
    { name: "Cleaner", icon: "🧹" },
    { name: "Painter", icon: "🎨" },
    { name: "Carpenter", icon: "🔨" },
    { name: "Pest Control", icon: "🕷️" }
  ]

  return (
    <div className="home-container">
      <div className="hero-section">
        <h1>Find the right professional for you</h1>
        <div className="search-bar-container">
          <input 
            type="text" 
            placeholder="Search for 'Plumber', 'Electrician'..." 
            className="main-search"
          />
          <button className="search-btn">Search</button>
        </div>
      </div>
      <div className="services-section">
        <h2>What are you looking for?</h2>
        <div className="category-grid">
          {services.map((cat, index) => (
            <div key={index} className="category-card" onClick={() => alert(`Clicked ${cat.name}`)}>
              <div className="icon">{cat.icon}</div>
              <p>{cat.name}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Home