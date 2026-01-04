const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
    try {
        // 1. get the token from request header
        let token = req.header("Authorization");
        if (!token) return res.status(401).send("Access denied. No token provided.");
        
        // Handle "Bearer TOKEN" format
        if (token.startsWith("Bearer ")) {
            token = token.slice(7); // Remove "Bearer " prefix
        }
        
        // 2. check JWT key exists
        const jwtKey = process.env.JWTKEY;
        if (!jwtKey) return res.status(500).send("JWT key not configured");
        
        // 3. verify token and save payload in the request object 
        req.payload = jwt.verify(token, jwtKey);
        // 4. call next() to continue
        next();

    } catch (error) {
        // print the error in terminal, not at console
        console.log("JWT Error:", error.message);
        res.status(400).send("Invalid token");
    }
}