const express = require('express')
const router = express.Router()
const Category = require('../models/category')
const Product = require('../models/product')

router.get('/', async (req, res) => {
  const productList = await Product.find()

  if (!productList) {
    res.status(500).json({ success: false })
  }

  res.send(productList)
})

router.post('/', async (req, res) => {
  try {
    const category = await Category.findById(req.body.category)
    if (!category) {
      return res.status(400).json({
        success: false,
        message: 'Invalid Category'
      })
    }

    let product = new Product({
      name: req.body.name,
      description: req.body.description,
      richDescription: req.body.richDescription,
      image: req.body.image,
      brand: req.body.brand,
      price: req.body.price,
      category: req.body.category,
      countInStock: req.body.countInStock,
      rating: req.body.rating,
      numReviews: req.body.numReviews,
      isFeature: req.body.isFeature
    })
    product = await product.save()

    if (!product) {
      res.status(500).json({
        success: false,
        message: 'Product could not be created'
      })
    }
    res.status(200).send(product)
  } catch (error) {
    res.status(400).json({
      success: false,
      error
    })
  }
})

module.exports = router
