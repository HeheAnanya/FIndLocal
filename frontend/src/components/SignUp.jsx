import React, { useState } from 'react'
import "../css/auth.css"
import { api } from "../api.js"
import { useNavigate } from 'react-router-dom'


const SignUp = () => {
    const navigate = useNavigate()
    const [form, setForm] = useState(
        {
            username: "",
            email: "",
            phoneNumber: "",
            password: "",
            role: ""
        }
    )
    function handleChange(e) {
        setForm({ ...form, [e.target.name]: e.target.value })
    }

    async function handleSubmit(e) {
        e.preventDefault()
        try {
            await api.post("/signup", {
                username: form.username,
                email: form.email,
                password: form.password,
                phoneNumber: String(form.phoneNumber),
                role: form.role

            })
            alert("Account created successfully! Please log in now.");

            setForm({ username: "", email: "", password: "", phoneNumber: "" })
        }
        catch (err) {
            console.log(err)
            if (err.response && err.response.data && err.response.data.error) {
                alert(err.response.data.error);
            } else if (err.response && err.response.data && err.response.data.message) {
                alert(err.response.data.message);
            } else {
                alert("Something went wrong, try again later");
            }
        }
    }
    return (
        <div className='authContainer'>
            <div className='authCard'>
                <div className="authHeader">
                    <h1>Create Account</h1>
                    <p>Join us to find or provide local services</p>
                </div>

                <form className='authForm' onSubmit={handleSubmit}>
                    <div className="form">
                        <label>Username</label>
                        <input
                            type='text'
                            placeholder='Choose a username'
                            required
                            name='username'
                            value={form.username}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="form">
                        <label>Email</label>
                        <input
                            type='email'
                            placeholder='Enter your email'
                            required
                            name='email'
                            value={form.email}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="form">
                        <label>Phone Number</label>
                        <input
                            type='text'
                            placeholder='10-digit number'
                            required
                            maxLength={10}
                            name='phoneNumber'
                            value={form.phoneNumber}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="form">
                        <label>Password</label>
                        <input
                            type='password'
                            placeholder='Create a password'
                            required
                            name='password'
                            value={form.password}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="form">
                        <label>Role</label>
                        <select name="role" value={form.role} onChange={handleChange} required>
                            <option value="">Select your role</option>
                            <option value="Expert">Expert (Service Provider)</option>
                            <option value="Client">Client (User)</option>
                        </select>
                    </div>

                    <button type="submit" className="auth-btn">Sign Up</button>
                </form>

                <p className='switch-text'>
                    Already have an account?
                    <span onClick={() => navigate("/login")}>Login</span>
                </p>
            </div>
        </div>
    )
}

export default SignUp