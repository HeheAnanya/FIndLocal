import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { api } from '../api'
import "../css/expert.css"

const Services = () => {
  const { type } = useParams()
  const navigate = useNavigate()
  const [experts, setExperts] = useState([])
  const [search, setSearch] = useState("")
  const [city, setCity] = useState("")
  const [sort, setSort] = useState("")
  const [page, setPage] = useState(1)
  const [pages, setPages] = useState(1)

  useEffect(() => {
    const fetchExperts = async () => {
      try {
        const res = await api.get(
          `/experts/${type}?page=${page}&limit=6&search=${search}&city=${city}&sort=${sort}`
        )
        setExperts(res.data.experts || [])
        setPages(res.data.pages || 1)
      } catch (err) {
        console.error(err)
      }
    }

    const timeout = setTimeout(fetchExperts, 400)
    return () => clearTimeout(timeout)
  }, [type, search, city, sort, page])

  return (
    <div className="expert-page">
      <div className="services-page">
        <div className="services-page-header">
          <h1>Best {type}s Near You</h1>
          <p>Verified professionals with transparent pricing and real reviews.</p>
        </div>

        <div className="filter-bar">
          <input
            type="text"
            placeholder="Search by name"
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1) }}
          />
          <input
            type="text"
            placeholder="Filter by city"
            value={city}
            onChange={(e) => { setCity(e.target.value); setPage(1) }}
          />
          <select
            value={sort}
            onChange={(e) => { setSort(e.target.value); setPage(1) }}
          >
            <option value="">Sort by</option>
            <option value="price_asc">Price: Low to High</option>
            <option value="price_desc">Price: High to Low</option>
            <option value="rating">Top Rated</option>
          </select>
        </div>

        <div className="experts-grid">
          {experts.length === 0 ? (
            <div className="no-experts">
              <p>No experts found matching your criteria.</p>
              <p style={{ fontSize: '13px', marginTop: '6px' }}>Try adjusting your search or city filter.</p>
            </div>
          ) : (
            experts.map((expert) => (
              <div key={expert.id} className="expert-card">
                <div className="expert-card-top">
                  <div className="expert-name">{expert.user?.username}</div>
                  <div className="expert-rating">
                    <span className="expert-rating-star">&#9733;</span>
                    {expert.rating ? Number(expert.rating).toFixed(1) : "New"}
                  </div>
                </div>

                <div className="expert-meta">
                  <div className="expert-meta-item">
                    <svg className="expert-meta-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>
                    </svg>
                    {expert.city}
                  </div>
                  <div className="expert-meta-item">
                    <svg className="expert-meta-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="2" y="7" width="20" height="14" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/>
                    </svg>
                    {expert.experience} {expert.experience === 1 ? "year" : "years"} experience
                  </div>
                </div>

                <div className="expert-price">
                  Rs.{expert.priceStart} <span>starting price</span>
                </div>

                {expert.bio && (
                  <p className="expert-bio">
                    "{expert.bio.length > 70 ? expert.bio.substring(0, 70) + "..." : expert.bio}"
                  </p>
                )}

                <button
                  className="expert-card-btn"
                  onClick={() => navigate(`/bookings/${expert.id}`)}
                >
                  Book Now
                </button>
              </div>
            ))
          )}
        </div>

        <div className="pagination">
          <button disabled={page <= 1} onClick={() => setPage(page - 1)}>Previous</button>
          <span>Page {page} of {pages}</span>
          <button disabled={page >= pages} onClick={() => setPage(page + 1)}>Next</button>
        </div>
      </div>
    </div>
  )
}

export default Services
