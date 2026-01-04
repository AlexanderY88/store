// imports: express, joi, User's model, jsonwebtoken, bcryptjs, lodash
const express = require("express");
const router = express.Router();
const joi = require("joi");
const _ = require("lodash");
const Product = require("../models/Product");

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

// product joi validation
const checkNewProductBody = joi.object({
    productId: joi.number().required(),
    name: joi.string().required(),
    price: joi.number().required(),
    category: joi.string().required(),
    description: joi.string().required()
}); 
// add new product
router.post("/", async (req, res) => {
    try {
        // check body with joi
        const { error } = checkNewProductBody.validate(req.body);
        if (error) return res.status(400).send(error.details[0].message);
        // check if product exists by id 
        let product = await Product.findOne({productId: req.body.productId});
        if (product) return res.status(400).send(`This product with id ${req.body.productId} already exists.`);
        // create new product object
        product = new Product(req.body);
        await product.save();
        res.status(201).json(product);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// get product by id

// 

module.exports = router;