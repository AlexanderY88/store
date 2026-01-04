// imports: express, joi, User model, bcryptjs, jsonwebtoken, lodash
const express = require("express");
const router = express.Router();
const joi = require("joi");
const User = require("../models/Users");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const _ = require("lodash");

const checkRegisterUserBody = joi.object({
        name: joi.string().required(),
        email: joi.string().email().required(),
        password: joi.string().required()
});

// register route
router.post("/register", async (req, res) => {
    try {
        // 1. joi validation
        const {error} = checkRegisterUserBody.validate(req.body);
        if (error) return res.status(400).send(error.details[0].message);
        // 2. check if user exist
        let user = await User.findOne({email: req.body.email});
        if (user) return res.status(400).send("User already registered.");
        // 3. create new user object
        user = new User(req.body);
        // 4. encrypt password
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(user.password, salt);
        await user.save();
        // 5. create token
        const token = jwt.sign({ _id: user._id, email: user.email}, process.env.JWTKEY);
        res.status(201).send(token);
    } catch (err) {
        console.log(err);
        res.status(500).send("Internal Server Error");
    }
});


// login joi validation
const checkUserLoginBody = joi.object({
    email: joi.string().email().required(),
    password: joi.string().required()
});

// login route
router.post("/login", async (req, res) => {
    try {
        // 1. validate body
        const {error} = checkUserLoginBody.validate(req.body);
        if (error) return res.status(400).send(error.details[0].message);
        // 2. check if user exist
        let user = await User.findOne({email: req.body.email});
        if (!user) return res.status(400).send("Wrong email or password.");
        // 3. check password
        const result = await bcrypt.compare(req.body.password, user.password);
        if (!result) return res.status(400).send("Wrong email or password.");
        // 4. create token
        const token = jwt.sign({isAdmin: user.isAdmin, _id: user._id}, process.env.JWTKEY);
        res.status(200).send(token);
    } catch (err) {
        console.log(err);
        res.status(500).send("Internal Server Error");
    }
})




module.exports = router;