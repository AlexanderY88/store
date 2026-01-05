// imports: express, joi, User's model, jsonwebtoken, bcryptjs, lodash
const express = require("express");
const router = express.Router();
const joi = require("joi");
const _ = require("lodash");
const Product = require("../models/Product");

// get all products route with function find
router.get("/", async (req,res) => {
    try {
        const products = await Product.find();
        if (products.length === 0) return res.status(404).send("No products found");
        res.status(200).json(products.map(product => _.pick(product.toObject(), ["productId", "name", "price", "category", "description"])));
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// product joi validation for add new product 
const checkNewProductBody = joi.object({
    productId: joi.number().required(),
    name: joi.string().required(),
    price: joi.number().required(),
    category: joi.string().required(),
    description: joi.string().required()
}); 
// add new product with function save
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
        res.status(201).json(_.pick(product.toObject(), ["productId", "name", "price", "category", "description"]));
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// get product by id 
router.get("/:id", async (req,res) => {
    try {
        // find product by productId
        const product = await Product.findOne({productId: req.params.id});
        // if the product not found, send 404
        if (!product) return  res.status(404).send("Product not found");
        // remove _v and _id fields from response
        // res.status(200).json(_.pick(product.toObject(), ["productId", "name", "price", "category", "description"]));
        res.status(200).send(_.omit(product.toObject(), ["_id", "__v"]));
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// update existing product by id - use findOneAndUpdate()
// in the function I use the joi validation from add new product because it is the same body structure

router.put("/:id", async (req,res) => {
    try {
        // check body with joi
        const {error} = checkNewProductBody.validate(req.body);
        if (error) return res.status(400).send(error.details[0].message);
        // find and update the product by productId, req.body and new=true
        const product = await Product.findOneAndUpdate({productId: req.params.id}, req.body, {new: true}); 
        if (!product) return res.status(404).send("Product not found");
        // I choose status 200 because it is update of existing product and not creating new one. If it was new product I were use 201
        res.status(200).send(_.omit(product.toObject(), ["_id", "__v"]));
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});


// delete product by id - use findOneAndDelete()
// I tried to use findOneAndRemove but got an error in postman:     "message": "Product.findOneAndRemove is not a function". After searching I found that this function is deprecated and I should use findOneAndDelete instead.

router.delete("/:id", async (req,res) => {
    try {
        const product = await Product.findOneAndDelete({productId: req.params.id});
        if (!product) return res.status(404).send("Product not found");
        res.status(200).send("Product deleted successfully");
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});


module.exports = router;