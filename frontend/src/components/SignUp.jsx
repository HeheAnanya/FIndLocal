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
            role:""
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
            phoneNumber:String(form.phoneNumber),
            role:form.role

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
        <h1>Local help, just a click away.</h1>
                <form className='signupForm' onSubmit={handleSubmit}>
            <label>Username
                
            </label>
            <input type='text' placeholder='username' required id="S.username" name='username' value={form.username} onChange={handleChange}/>
            <label>Email
                
            </label>
            <input type='email' placeholder='Email' required id="S.email" name='email' value={form.email} onChange={handleChange}/>
            <label>Password
                
            </label>
            <input type='password' placeholder='Password' required id="S.pass" name='password' value={form.password} onChange={handleChange}/>
            <label>Phone Number
                
            </label>
            <input type='text' placeholder='Phone Number' required maxLength={10} id="S.phone" name='phoneNumber' value={form.phoneNumber} onChange={handleChange}/>
            <label>Role</label>
            <select name ="role" value={form.role} onChange={handleChange} required>
                <option value="Select" >Select your role</option>
                <option value="Expert">Expert</option>
                <option value="Client">Client</option>
            </select>
            <button>Sign me Up</button>
        </form>
        <p className='switch-text'>
            Already have an account?
            <span onClick={()=>(navigate("/login"))}>LOGIN</span>
        </p>
         </div>

    </div>
)
}

export default SignUp 