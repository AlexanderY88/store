// imports: express, joi, User's model, jsonwebtoken, bcryptjs, lodash
const express = require("express");
const router = express.Router();
const joi = require("joi");
const User = require("../models/Users");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const _ = require("lodash");

// joi validation of product
const checkProductBody = joi.object({
    productId: joi.number().required(),
    name: joi.string().required(),
    price: joi.number().required(),
    category: joi.string().required(),
    description: joi.string().required()
});

// get all products route
router.get("/", async (req,res) => {
    try {
        const products = await Product.find();
        if (!products) return res.status(404).send("No products found");
        res.json(products);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});


module.exports = router;