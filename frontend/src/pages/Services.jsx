// import React, { useEffect, useState } from 'react'
// import { useParams } from 'react-router-dom' 
// import { api } from '../api'
// // import "../css/ser,vices.css" 

// const Services = () => {
//     const { type } = useParams() 
//     const [experts, setExperts] = useState([])

//     useEffect(() => {
//         const fetchExperts = async () => {
//             try {
//                 const res = await api.get(`/experts/${type}`)
//                 setExperts(res.data)
//             } catch (err) {
//                 console.log(err)
//             }
//         }
//         fetchExperts()
//     }, [type])

//     return (
//         <div className="services-page">
//             <h1>Best {type}s Near You</h1>
            
//             <div className="experts-list">
//                 {experts.length === 0 ? (
//                     <p>No experts found in this category yet.</p>
//                 ) : (
//                     experts.map((expert) => (
//                         <div key={expert.id} className="expert-card">
//                             <h3>{expert.user.username}</h3>
//                             <p>📍 {expert.city}</p>
//                             <p>💰 Starts at ₹{expert.priceStart}</p>
//                             <p>⭐ Rating: {expert.rating}</p>
//                             <button>Book Now</button>
//                         </div>
//                     ))
//                 )}
//             </div>
//         </div>
//     )
// }

// export default Services


import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { api } from '../api'
import "../css/expert.css" // Reusing your clean CSS

const Services = () => {
    const { type } = useParams() // e.g., "Plumber"
    const [experts, setExperts] = useState([])
    
    // Search States
    const [search, setSearch] = useState("")
    const [city, setCity] = useState("")
    const [sort, setSort] = useState("")

    // Debounce Logic (Optional but good): Only search after user stops typing
    useEffect(() => {
        const fetchExperts = async () => {
            try {
                // Build the query string dynamically
                // e.g. /experts/Plumber?search=Mario&city=Delhi&sort=price_asc
                const res = await api.get(`/experts/${type}?search=${search}&city=${city}&sort=${sort}`)
                setExperts(res.data)
            } catch (err) {
                console.error(err)
            }
        }
        
        // Small delay to prevent too many API calls while typing
        const timeoutId = setTimeout(() => {
            fetchExperts()
        }, 500)

        return () => clearTimeout(timeoutId)

    }, [type, search, city, sort]) // Re-run whenever any filter changes

    // Handle Booking (Simple Navigation)
    const handleBook = (id) => {
        window.location.href = `/book/${id}`
    }

    return (
        <div className="expert">
            <div className="expert-form-wrapper" style={{ maxWidth: '1000px' }}>
                <h2 style={{ textAlign: 'center' }}>Best {type}s in Your Area</h2>

                {/* --- FILTER BAR --- */}
                <div style={{ display: 'flex', gap: '10px', marginBottom: '30px', flexWrap: 'wrap' }}>
                    <input 
                        type="text" 
                        placeholder="Search by name..." 
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        style={{ flex: 1, minWidth: '200px' }}
                    />
                    <input 
                        type="text" 
                        placeholder="Filter by City (e.g. Delhi)" 
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        style={{ flex: 1, minWidth: '200px' }}
                    />
                    <select 
                        value={sort} 
                        onChange={(e) => setSort(e.target.value)}
                        style={{ flex: 0.5, minWidth: '150px' }}
                    >
                        <option value="">Sort By</option>
                        <option value="price_asc">Price: Low to High</option>
                        <option value="price_desc">Price: High to Low</option>
                        <option value="rating">Top Rated</option>
                    </select>
                </div>

                {/* --- EXPERTS GRID --- */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px' }}>
                    {experts.length === 0 ? (
                        <p style={{ gridColumn: '1/-1', textAlign: 'center' }}>No experts found matching your criteria.</p>
                    ) : (
                        experts.map((expert) => (
                            <div key={expert.id} style={{ 
                                border: '1px solid #e2e8f0', 
                                borderRadius: '12px', 
                                padding: '20px', 
                                background: 'white',
                                boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
                            }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                                    <h3 style={{ margin: 0, fontSize: '18px' }}>{expert.user?.username}</h3>
                                    <span style={{ background: '#ecfdf5', color: '#059669', padding: '4px 8px', borderRadius: '12px', fontSize: '12px', fontWeight: 'bold' }}>
                                        ★ {expert.rating || "New"}
                                    </span>
                                </div>
                                
                                <p style={{ color: '#64748b', fontSize: '14px', margin: '5px 0' }}>📍 {expert.city}</p>
                                <p style={{ color: '#64748b', fontSize: '14px', margin: '5px 0' }}>💼 {expert.experience} Years Exp.</p>
                                <p style={{ fontWeight: 'bold', color: '#2563eb', margin: '10px 0' }}>Starts at ₹{expert.priceStart}</p>
                                
                                <p style={{ fontSize: '13px', color: '#64748b', fontStyle: 'italic', marginBottom: '15px' }}>
                                    "{expert.bio.substring(0, 60)}..."
                                </p>

                                <button 
                                    onClick={() => handleBook(expert.id)}
                                    style={{ width: '100%', background: '#2563eb', color: 'white', padding: '10px', borderRadius: '8px', border: 'none', fontWeight: '600' }}
                                >
                                    Book Now
                                </button>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    )
}

export default Services