import React, { useState } from 'react'
import "../css/auth.css"
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
    function handleChange(e){
        setForm({ ...form, [e.target.name]: e.target.value })
    }

async function handleSubmit(e) {
    e.preventDefault()
    try {
        await api.post("/signup", {
            username: form.username,
            email: form.email,
            password:form.password,
            phoneNumber:String(form.phoneNumber)

        })
        alert("Account created successfully! Please log in now.");

        setForm({ username: "", email: "", password: "", phoneNumber: "" })
    }
    catch (err) {
        console.log(err)
        alert(" Signup failed");
    }
}
return (
    <div className='signup'>
      <div className='left'>
        <div className="overlay"></div>
        <div className='left-content'>
          <h1>Connect with trusted local professionals</h1>
          <p>FindLocal helps you discover, book, and review skilled serviceproviders near you — fast, easy, and reliable.</p>
          <div className="stats">
            <p>👷‍♂️ 10,000+ Verified Experts</p>
            <p>⭐ 5,000+ 5-Star Reviews</p>
            <p>🏙️ 100+ Cities Served</p>
          </div>
        </div>
      </div>
      <div className='right'>
                <form className='signupForm' onSubmit={handleSubmit}>
            <label>Username
                <input type='text' placeholder='username' required id="S.username" name='username' value={form.username} onChange={handleChange}/>
            </label>
            <label>Email
                <input type='email' placeholder='Email' required id="S.email" name='email' value={form.email} onChange={handleChange}/>
            </label>
            <label>Password
                <input type='password' placeholder='Password' required id="S.pass" name='password' value={form.password} onChange={handleChange}/>
            </label>
            <label>Phone Number
                <input type='text' placeholder='Phone Number' required maxLength={10} id="S.phone" name='phoneNumber' value={form.phoneNumber} onChange={handleChange}/>
            </label>
            <button>Sign me Up</button>
        </form>
         </div>

    </div>
)
}

export default SignUp 