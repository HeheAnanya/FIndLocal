const express = require("express")
const jwt = require("jsonwebtoken")
const bcrypt = require("bcrypt")
const cors = require("cors")
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const {VerifyToken} = require("./jwtMiddleware.js")
const SECRET_KEY = process.env.SECRET_KEY

const app = express()
app.use(express.json())
app.use(cors())



app.get("/", (req,res)=>{
    return res.status(200).json("Welcome Back")
})

app.post("/signup", async(req,res)=>{
    const passRegex=/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/ //special characters = @$!%*?&) 
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    let {username,email,password,phoneNumber,role}= req.body
    if (!email || !username || !password || !phoneNumber || !role || isNaN(Number(phoneNumber))){
        return res.status(400).json({"message":"Missing credentials"})
    }
    if (!emailRegex.test(email)){
        return res.status(403).json({"error":"Email is not valid"})
    }
    if (!passRegex.test(password)){
        return res.status(403).json({"error":"Password must contain at least 8 characters, 1 letter, 1 number, and 1 special character"})
    }
    // phoneNumber=Number(phoneNumber)
    let available = await prisma.user.findUnique({
        where:{
            email:email
        }
    })
    if (available){
        return res.status(400).json({"error":"User with this email already exists, please LOGIN"})
    }
    let hashedPassword = await bcrypt.hash(password,10)
    let users = await prisma.user.create({
        data:{
            username:username,
            email:email,
            password:hashedPassword,
            phoneNumber:phoneNumber,
            role:role

        }
    })
    return res.status(200).json({message:"Account created successfully", users:users})

})

app.post("/login",async(req,res)=>{
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    const {email,password}= req.body
    if (!email || !password){
        return res.status(400).json({"message":"Missing credentials"})
    }
    if (!emailRegex.test(email)){
        return res.status(403).json({"error":"Email is not valid"})
    }
    let available = await prisma.user.findUnique({
        where:{
            email:email
        }
}
    )
    if (!available){
        return res.status(404).json({"error":"User not found, please create an account first"})
    }
    const IsCorrectPassword = await bcrypt.compare(password,available.password)
    if (!IsCorrectPassword){
        return res.status(403).json({"error":"Wrong Password"})
    }
   
    const token = jwt.sign({ userId: available.id, email:available.email }, SECRET_KEY, { expiresIn: "1h" });
    
    return res.status(200).json(
        {message:"Login successful",
            token:token,
            users:{
                id:available.id,
                username:available.username, 
                email:available.email,
                role:available.role
            }
    })
})


app.get("/profile", VerifyToken,(req,res)=>{
    return res.status(200).json({message: "Access granted", user: req.user})
})
app.listen(3000,()=>(console.log("Server is running on 3000")))
