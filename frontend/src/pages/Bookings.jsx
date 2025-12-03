import React, { useState } from 'react'
import { useParams } from 'react-router-dom'
import { api } from "../api"
import "../css/BookForm.css"

const Bookings = () => {
    const { expertId } = useParams()
    let [forms, setForms] = useState(
        {
            description: "",
            date: ""
        }
    )
    async function handleSubmit(e) {
        e.preventDefault()
        try {
            await api.post("/bookings", {
                expertId: Number(expertId),
                description: forms.description,
                date: new Date(forms.date)
            })
            alert("Slot Booked")
        } catch (err) {
            console.error(err)
            alert("Failed to book the slot")
        }
    }

    function handleChange(e) {
        setForms({
            ...forms,
            [e.target.name]: e.target.value
        })
    }
    return (
        <div className='formContainer'>
            <h2 className='title'>Book the Expert</h2>
            <form onSubmit={handleSubmit} className='bookForm'>
                <label>Task</label>
                <textarea placeholder='Describe the task...' required name='description' onChange={handleChange} className='booking-textarea'></textarea>
                <label>Book your Slot</label>
                <input type={'datetime-local'} value={forms.date} name='date' onChange={handleChange} className='booking-input'></input>
                <button className='booking-btn'>Book</button>

            </form>
        </div>
    )
}

export default Bookings