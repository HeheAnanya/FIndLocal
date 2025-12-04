const express = require("express")
const jwt = require("jsonwebtoken")
const bcrypt = require("bcrypt")
const cors = require("cors")
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const { VerifyToken } = require("./src/jwtMiddleware.js");
const e = require("express");
const SECRET_KEY = process.env.SECRET_KEY
const app = express()
app.use(express.json())
app.use(cors({
  origin: [
    "https://f-ind-local.vercel.app",
   " https://findlocal.vercel.app",
    "http://localhost:5174"
  ],
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE"],
}));

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

app.get("/expert/profile", VerifyToken, async (req, res) => {
    try {
        const expert = await prisma.expert.findUnique({
            where: {
                userId: req.user.userId
            }
        })
        if (expert) {
            return res.status(200).json(expert)
        }
        else {
            return res.status(200).json(null)
        }

    }
    catch (err) {
        console.log(err)
        return res.status(500).json({ "Error": err })

    }
})

app.get("/experts/:category", async (req, res) => {
    let { category } = req.params
    let { city, search, sort, page = 1, limit = 6 } = req.query
    limit = Number(limit)
    page = Number(page)
    let skip = (page - 1) * limit


    let place = {
        category: { name: category }
    }
    if (city) {
        place.city = { contains: city }
    }
    if (search) {
        place.OR = [
            { bio: { contains: search } },
            { user: { username: { contains: search } } }
        ];
    }
    let orderBy = {}
    if (sort === "price_asc") {
        orderBy = { priceStart: 'asc' }
    }
    else if (sort === "price_desc") {
        orderBy = { priceStart: "desc" }
    }
    else if (sort === "rating") {
        orderBy = { rating: "desc" }
    }
    const totalCount = await prisma.expert.count({ where: place });

    try {
        const experts = await prisma.expert.findMany(
            {
                where: place,
                orderBy: orderBy,
                skip: skip,
                take: limit,

                include: {
                    user: {
                        select: {
                            username: true,
                            role: true
                        }
                    },
                    reviews: {
                        take: 3, orderBy: { createdAt: 'desc' }, include: {
                            client: { select: { username: true } }
                        }
                    }
                }
            }
        )
        if (experts.length === 0) {
            return res.status(200).json({ "message": "No expert in this area" });
        }
        const totalPages = Math.ceil(totalCount / limit);
        return res.status(200).json({ experts, totalPages });
    }
    catch (er) {
        console.log(er);
        return res.status(500).json({ error: "Could not fetch experts" });
    }
})

app.post("/bookings", VerifyToken, async (req, res) => {
    let { expertId, description, date } = req.body
    expertId = Number(expertId)
    date = new Date(date)
    try {
        await prisma.booking.create({
            data: {
                userId: req.user.userId,
                expertId: expertId,
                description: description,
                date: date
            }

        })
        res.status(200).json({ message: "Booking request sent!" });
    }
    catch (er) {
        console.log(er);
        res.status(500).json({ error: "Booking failed" });
    }
})

app.put("/bookings/:id", VerifyToken, async (req, res) => {
    const bookingId = req.params.id
    const { status } = req.body
    try {
        await prisma.booking.update({
            where: {
                id: Number(bookingId)
            },
            data: {
                status: status
            }
        })
        res.status(200).json({ message: `Booking ${status}` });
    }
    catch (err) {
        console.log(err)
        res.status(500).json({ error: "Failed to update booking" });
    }
})

app.get("/mybookings", VerifyToken, async (req, res) => {
    try {
        const user = await prisma.user.findUnique({
            where: {
                id: req.user.userId
            },
            include: {
                experts: true
            }
        })
        if (!user) {
            return res.status(404).json({ error: "User not found" })
        }
        let bookings = []
        const role = user.role
        if (role === "Expert") {
            if (!user.experts || !user.experts.id) {
                return res.status(200).json({
                    bookings: [],
                    stats: { total: 0, upcoming: 0, completed: 0 }
                });
            }
            bookings = await prisma.booking.findMany({
                where: {
                    expertId: user.experts.id
                },
                include: {
                    client: {
                        select: { username: true, phoneNumber: true }
                    },
                    reviews: true
                },

            })
        }
        else {
            bookings = await prisma.booking.findMany({
                where: {
                    userId: user.id
                },
                include: {
                    expert: {
                        include: {
                            user: { select: { username: true } },
                            category: true
                        },
                        reviews: true

                    },
                    // reviews:{
                    //     where:{clientId:user.id},
                    //     select:{id: true, rating: true, comment: true}
                    // }
                }
            })
        }
        res.status(200).json({
            bookings,
            stats: {
                total: bookings.length,
                upcoming: bookings.filter(b => b.status === "CONFIRMED").length,
                completed: bookings.filter(b => b.status === "COMPLETED").length
            }
        })
    }

    catch (err) {
        console.log(err)
        res.status(500).json({ error: "Error fetching role" });
    }
})
app.get("/profile", VerifyToken, (req, res) => {
    return res.status(200).json({ message: "Access granted", user: req.user })
})
app.put("/user/change_password", VerifyToken, async (req, res) => {
    const { curr, latest } = req.body
    try {
        const user = await prisma.user.findUnique({
            where: {
                id: req.user.userId
            }
        })
        const IsCorrectPassword = await bcrypt.compare(curr, user.password)
        if (!IsCorrectPassword) {
            return res.status(403).json({ error: "Incorrect old password" });
        }
        const newPass = await bcrypt.hash(latest, 10)
        await prisma.user.update({
            where: {
                id: user.id
            },
            data: {
                password: newPass
            }
        })
        res.status(200).json({ message: "Password updated successfully" });
    }

    catch (er) {
        console.log(er)
        res.status(500).json({ error: er });
    }
})
app.put("/user/update",VerifyToken,async (req,res)=>{
    
        let { username, email, phoneNumber } = req.body
        if (!username|| !email || !phoneNumber){
            return res.status(400).json({"Message":"Missing Credentials"})
        }
try{
    const updated = await prisma.user.update({
        where:{
            id:req.user.userId
        },
        data:{
            username:username,
            phoneNumber:phoneNumber,
            email:email
        },
        select: {
                id: true,
                username: true,
                email: true,
                phoneNumber: true
            }
    })
    return res.status(200).json({"Message":"Profile Updated Successfully",
        user:updated
    })
    }
    catch(er){
        console.log(er)
        return res.status(500).json({error:er})
    }
})

app.post("/reviews", VerifyToken, async (req, res) => {
    const { expertId, rating, comment } = req.body
    const clientId = req.user.userId
    if (!expertId || !rating) {
        return res.status(400).json({ error: "Rating and Expert ID are required" });
    }
    try {
        const newReview = await prisma.review.create({
            data: {
                rating: Number(rating),
                comment: comment,
                clientId: Number(clientId),
                expertId: Number(expertId)
            }
        })
        const total_review = await prisma.review.aggregate({
            _avg: {
                rating: true
            },
            where: {
                expertId: Number(expertId)
            }
        })
        const finalRating = total_review._avg.rating || 0
        let reviews = await prisma.expert.update({
            where: { id: Number(expertId) },
            data: { rating: finalRating }
        })
        if (reviews.length === 0) {
            res.status(200).json({ message: "No reviews found. Be the first to write any review" });
        }
        res.status(200).json({ message: "Review added and rating updated!", review: newReview });
    }
    catch (er) {
        console.log(er)
        return res.status(500).json({ "error": er })
    }

})

app.delete("/bookings/:id", VerifyToken, async (req, res) => {
    let { id } = req.params
    const userId = req.user.userId
    try {
        let account = await prisma.booking.findUnique({
            where: {
                id: Number(id)
            }
        })
        if (!account) {
            return res.status(404).json({ error: "Booking not found" })
        }
        if (account.userId !== userId) {
            return res.status(403).json({ error: "Unauthorized to delete this booking" })
        }
        if (account.status !== "PENDING") {
            return res.status(400).json({ error: "Cannot cancel a processed booking" })
        }
        await prisma.booking.delete({
            where: {
                id: Number(id)
            }
        })

        res.status(200).json({ message: "Booking cancelled successfully" })
    }
    catch (er) {
        console.log(er)
        return res.status(500).json({ error: "Failed to cancel booking" })
    }
})

app.delete("/reviews/:id", VerifyToken, async (req, res) => {
    let reviewId = (req.params.id)
    reviewId = Number(reviewId)
    const userId = req.user.userId
    try {
        const review = await prisma.review.findUnique({
            where: {
                id: reviewId
            }
        })
        if (!review) {
            return res.status(404).json({ error: "Review not found" });
        }
        if (review.clientId !== userId) {
            return res.status(403).json({ error: "Unauthorized to delete this review" })
        }
        await prisma.review.delete({
            where: {
                id: reviewId
            }
        })
        const total_review = await prisma.review.aggregate({
            _avg: { rating: true },
            where: { expertId: review.expertId }
        });
        const finalRating = total_review._avg.rating || 0;
        await prisma.expert.update({
            where: { id: review.expertId },
            data: { rating: finalRating }
        })
        return res.status(200).json({ "Message": "Review Deleted Successfully" })

    }

    catch (er) {
        console.log(er)
        return res.status(500).json({ error: er })
    }
})
app.get("/myreviews", VerifyToken, async (req, res) => {
    let { userId } = req.query
    userId = Number(userId)
    try {
        const review = await prisma.review.findMany({
            where: {
                clientId: userId
            },
            include: {
                expert: {
                    include: {
                        user: {
                            select: {
                                username: true
                            }
                        },
                        category: {
                            select: { name: true }
                        }
                    }
                }
            },
            orderBy: { createdAt: "desc" }
        })
        return res.status(200).json(reviews);
    }

    catch (er) {
        console.log(er)
        return res.status(500).json(er)
    }

})
app.listen(3000, () => (console.log("Server is running on 3000")))