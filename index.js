// imports of express, dotenv, mongoose and json parsing
const express = require("express");
const app = express();
require("dotenv").config();
const mongoose = require("mongoose");
app.use(express.json());
// use port from .env but if not defined or some problem to start, use 8000 as default port
const port = process.env.PORT || 8000; 
// add mongoose connection
mongoose.connect(process.env.DB)
.then(() => console.log("MongoDB connected"))
.catch((err) => console.log("MongoDB connection error:", err));

// logger function as middleware
const loggerMiddleware = (req, res, next) => {
    console.log(`method: ${req.method}, url: ${req.url}`);
    next();
};

// import routes files 
const products = require("./routes/products");
const users = require("./routes/users");

// set routes /api/fileName
app.use("/api/users", users);
app.use("/api/products", products);


// global route - for handling all other routes - wild card
app.use((req, res) => {
    res.status(404).send("404 - Page Not Found");
});

// // connect the app to the port - this should be at the end
app.listen(port, () => console.log("Server started on port", port));

