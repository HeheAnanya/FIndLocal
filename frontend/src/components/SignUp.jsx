import React, { useState } from 'react'
import "../App.css"
import { api } from "../api.js"

const SignUp = () => {
    const [form, setForm] = useState(
        {
            username: "",
            email: "",
            phoneNumber: "",
            password: ""
        }
    )
    function handelChange(e){
        setForm({ ...form, [e.target.name]: e.target.value })
    }

async function handleSubmit(e) {
    e.preventDefault()
    try {
        const res = await api.post("/signup", {
            username: form.username,
            email: form.email,
            password:form.password,
            phoneNumber:String(form.phoneNumber)

        })
        setForm({ username: "", email: "", password: "", phoneNumber: "" })
    }
    catch (err) {
        if (err.response?.data?.error) alert(err.response.data.error);
        else alert(" Signup failed");
    }
}
return (
    <div className='signup'>
        <form className='signupForm' onSubmit={handleSubmit}>
            <label>username
                <input type='text' placeholder='username' required id="S.username" name='username' value={form.username} onChange={handelChange}/>
            </label>
            <label>Email
                <input type='email' placeholder='Email' required id="S.email" name='email' value={form.email} onChange={handelChange}/>
            </label>
            <label>Password
                <input type='password' placeholder='Password' required id="S.pass" name='password' value={form.password} onChange={handelChange}/>
            </label>
            <label>Phone Number
                <input type='text' placeholder='Phone Number' required maxLength={10} id="S.phone" name='phoneNumber' value={form.phoneNumber} onChange={handelChange}/>
            </label>
            <button>Sign me Up</button>
        </form>

    </div>
)
}

export default SignUp 