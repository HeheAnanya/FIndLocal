  const jwt = require("jsonwebtoken");
  const SECRET_KEY = process.env.SECRET_KEY
  function VerifyToken(req,res,next){
    const token = req.headers.authorization
    if (!token){
      return res.status(401).json({"error":"Invalid/Missing Token"})
    }
    let personal_token = token.split(" ")[1]
    jwt.verify(personal_token,SECRET_KEY, (err,decode)=>{
      if (err){
        console.log(err)
        return res.status(403).json({ error: "Invalid or expired token" })
      }
      req.user = decode
      next()
    })


  }
  module.exports = {VerifyToken}