
// function validate(req,res,next){
//     const auth = req.headers.authorization
//     if (!auth || !(auth.startsWith("Bearer "))){
//         return res.status(401).json({"message":"Invalid Token"})
//     }
//     const token = auth.trim().slice(7)
//     jwt.verify(token,"SECRET_KEY",(err,decoded)=>{
//         if (err){
//             console.log(err)
//             return res.status(403).json({"error":"Token expires"})
//         }
//     req.user = decoded 
//     next()
//     })

// }
// module.exports = {validate}



const express = require('express');
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const app = express();
const port = 3000;

app.use(express.json());


const users = [];
const JWT_SECRET = "my-super-secret-key-that-is-long-enough";

app.post("/signup", async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ "error": "Username and password are required." });
  }
  if (users.find(u => u.username === username)) {
    return res.status(409).json({ "error": "Username already taken." });
  }
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    users.push({ username, password: hashedPassword });
    let token = jwt.sign({ "username": username }, JWT_SECRET, { expiresIn: "1h" })
    res.status(201).json({ "token": token });
  } catch (error) {
    res.status(500).json({ message: 'Server error during registration' });
  }





});

app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`);
});

module.exports = { app, users, JWT_SECRET };