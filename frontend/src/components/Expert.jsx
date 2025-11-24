import React, { useState, useEffect } from 'react'
import { api } from "../api.js"
import "../css/expert.css"

const Expert = () => {
    let [categories, setCategories] = useState([])
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
                priceStart: Number(forms.priceStart),
                experience: Number(forms.experience),
                categoryId: Number(forms.categoryId)
            })
            alert("Profile Updated Successfully!")
        } catch (err) {
            console.error(err)
            alert("Failed to update profile")
        }
    }
    useEffect(() => {
        async function fetching() {
            try {
                const res = await api.get("/categories")
                setCategories(res.data)
            }
            catch (er) {
                console.log(er)
            }
        }
        fetching()
    }, [])
    return (
        <div className='expert'>
            <form onSubmit={handleSubmit}>
                <img className='person'></img>
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
            </form>

        </div>
    )
}

export default Expert