import React,{useState,useEffect} from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar' 
import { api } from '../api'
import '../css/home.css' 

const Home = () => {
  const navigate = useNavigate()
  const [categories, setCategories] = useState([])
    const services = [
    { name: "Plumber", icon: "🔧" },
    { name: "Electrician", icon: "💡" },
    { name: "Cleaner", icon: "🧹" },
    { name: "Painter", icon: "🎨" },
    { name: "Carpenter", icon: "🔨" },
    { name: "Pest Control", icon: "🕷️" }
  ]
  useEffect(()=>{
    async function fetching(){
        try{
            const res= await api.get("/categories")
            setCategories(res.data)
        }
        catch(er){
            console.log(er)
        }
    }
    fetching()
  },[])
  return (
    <div className="home-container">
      <div className="hero-section">
        <h1>Find the right professional for you</h1>
      </div>
      <div className="services-section">
        <h2>What are you looking for?</h2>
        <div className="category-grid">
          {services.map((cat, index) => (
            <div key={index} className="category-card" onClick={() => navigate(`/services/${cat.name}`)}>
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