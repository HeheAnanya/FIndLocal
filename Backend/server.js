const express = require("express")
const jwt = require("jsonwebtoken")
const bcrypt = require("bcrypt")
const cors = require("cors")
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const { VerifyToken } = require("./src/jwtMiddleware.js")
const SECRET_KEY = process.env.SECRET_KEY
const app = express()
app.use(express.json())
app.use(cors())
app.get("/", (req, res) => {
    return res.status(200).json("Welcome Back")
})

app.post("/signup", async (req, res) => {
    const passRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/ //special characters = @$!%*?&) 
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    let { username, email, password, phoneNumber, role } = req.body
    if (!email || !username || !password || !phoneNumber || !role || isNaN(Number(phoneNumber))) {
        return res.status(400).json({ "message": "Missing credentials" })
    }
    if (!emailRegex.test(email)) {
        return res.status(403).json({ "error": "Email is not valid" })
    }
    if (!passRegex.test(password)) {
        return res.status(403).json({ "error": "Password must contain at least 8 characters, 1 letter, 1 number, and 1 special character" })
    }
    // phoneNumber=Number(phoneNumber)
    let available = await prisma.user.findUnique({
        where: {
            email: email
        }
    })
    if (available) {
        return res.status(400).json({ "error": "User with this email already exists, please LOGIN" })
    }
    let hashedPassword = await bcrypt.hash(password, 10)
    let users = await prisma.user.create({
        data: {
            username: username,
            email: email,
            password: hashedPassword,
            phoneNumber: phoneNumber,
            role: role

        },
        select: {
            id: true,
            username: true,
            email: true,
            phoneNumber: true,
            role: true
        }
    })
    return res.status(200).json({ message: "Account created successfully", users: users })

})

app.post("/login", async (req, res) => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    const { email, password } = req.body
    if (!email || !password) {
        return res.status(400).json({ "message": "Missing credentials" })
    }
    if (!emailRegex.test(email)) {
        return res.status(403).json({ "error": "Email is not valid" })
    }
    let available = await prisma.user.findUnique({
        where: {
            email: email
        }
    }
    )
    if (!available) {
        return res.status(404).json({ "error": "User not found, please create an account first" })
    }
    const IsCorrectPassword = await bcrypt.compare(password, available.password)
    if (!IsCorrectPassword) {
        return res.status(403).json({ "error": "Wrong Password" })
    }

    const token = jwt.sign({ userId: available.id, email: available.email }, SECRET_KEY, { expiresIn: "1h" });

    return res.status(200).json(
        {
            message: "Login successful",
            token: token,
            users: {
                id: available.id,
                username: available.username,
                email: available.email,
                role: available.role
            }
        })
})

app.get("/categories", async (req, res) => {
    try {
        const categories = await prisma.category.findMany();
        res.status(200).json(categories);
    }
    catch (er) {
        console.log(er)
        return res.status(404).json({ "message": "Can't find any available categories" })
    }
})

app.put("/expert/profile", VerifyToken, async (req, res) => {
    let { bio, city, priceStart, categoryId, experience } = req.body
    const userId = req.user.userId
    if (!bio || !city || !priceStart || !categoryId || !experience) {
        return res.status(401).json("Missing Fields")
    }
    try {
        await prisma.expert.upsert({
            where: {
                userId: userId
            },
            update: {
                bio: bio,
                city: city,
                priceStart: priceStart,
                categoryId: Number(categoryId),
                experience: Number(experience)
            },
            create: {
                bio: bio,
                city: city,
                priceStart: priceStart,
                categoryId: Number(categoryId),
                userId: userId,
                experience: Number(experience)
            }
        })
        return res.status(200).json({ message: "Profile updated successfully!" })
    }
    catch (er) {
        console.log(er)
        return res.status(500).json({ "Error": er })
    }
})

app.get("/experts/:category", async (req, res) => {
    let  service  = req.params.category
    try {
        const experts = await prisma.expert.findMany(
            {
                where: { category: { name: service } },
                include:{user: { select: { username: true } }}
            }
        )
        res.status(200).json(experts);
    }
    catch(er){
        console.log(er);
        res.status(500).json({ error: "Could not fetch experts" });
    }
})

app.post("/bookings", VerifyToken,async(req,res)=>{
    let {expertId,description,date} = req.body
    expertId= Number(expertId)
    date=new Date(date)
    try{
        await prisma.booking.create({
            data:{
                userId:req.user.userId,
            expertId:expertId,
            description:description,
            date:date
            }
            
        })
        res.status(200).json({ message: "Booking request sent!" });
    }
    catch(er){
        console.log(er);
        res.status(500).json({ error: "Booking failed" });
    }
})

app.get("/mybookings", VerifyToken,async(req,res)=>{
    try{
        const user = await prisma.user.findUnique({
            where:{
                id : req.user.userId
            },
            include:{
                expert:true
            }
        })
        if (!user) {
            return res.status(404).json({ error: "User not found" })
        }
        let bookings = []
        const role = user.role
        if (role==="Expert"){
            bookings = await prisma.booking.findMany({
                where:{
                    expertId:user.expert.id
                },
                include:{
                    client:{
                        select: { username: true, phoneNumber: true }
                    }
                }
            })
        }
        else{
            bookings = await prisma.booking.findMany({
                where:{
                    userId:user.id
                },
                include:{
                    expert:{
                        user:{select:{username:true}}
                    }
                }
            })
        }
        res.status(200).json(bookings)
    }

    catch(err){
        console.log(err)
        res.status(500).json({ error: "Error fetching role" });
    }
})
app.get("/profile", VerifyToken, (req, res) => {
    return res.status(200).json({ message: "Access granted", user: req.user })
})
app.listen(3000, () => (console.log("Server is running on 3000")))