const express = require('express')
const router = express.Router()
const Category = require('../models/category')
const Product = require('../models/product')
const mongoose = require('mongoose')

router.get('/', async (req, res) => {
  const productList = await Product.find()

  if (!productList) {
    res.status(500).json({ success: false })
  }

  res.send(productList)
})

router.get('/:id', async (req, res) => {
  const product = await Product.findById(req.params.id)
    .populate('category')

  if (!product) {
    res.status(500).json({ success: false })
  }

  res.send(product)
})

router.post('/', async (req, res) => {
  try {
    const category = await Category.findById(req.body.category)
    if (!category) {
      return res.status(400).json({ success: false, message: 'Invalid Category' })
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
      res.status(500).json({ success: false, message: 'Product could not be created' })
    }
    res.status(200).send(product)
  } catch (error) {
    res.status(400).json({ success: false, error })
  }
})

router.put('/:id', async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.id)) {
    return res.status(400).json({ success: false, message: 'Invalid Product id' })
  }

  try {
    const category = await Category.findById(req.body.category)
    if (!category) {
      return res.status(400).json({ success: false, message: 'Invalid Category' })
    }

    const product = await Product.findByIdAndUpdate(
      req.params.id,
      {
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
      },
      { new: true }
    )

    if (!product) {
      res.status(500).json({ success: false, message: 'Product could not be updated' })
    }
    res.status(200).send(product)
  } catch (error) {
    res.status(400).json({ success: false, error })
  }
})

router.delete('/:id', async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.id)) {
    return res.status(400).json({ success: false, message: 'Invalid Product id' })
  }

  try {
    const deletedProduct = await Product.findByIdAndDelete(req.params.id)
    if (!deletedProduct) {
      res.status(404).json({ success: false, message: 'Product could not be deleted' })
    }
    res.status(200).json({ success: true, message: 'Product successfully deleted' })
  } catch (error) {
    res.status(500).json({ success: false, error })
  }
})

router.get('/get/count', async (req, res) => {
  const productCount = await Product.find().count()

  if (!productCount) {
    res.status(500).json({ success: false })
  }
  res.send({ count: productCount })
})

router.get('/get/featured', async (req, res) => {
  const products = await Product.find({
    isFeature: true
  })

  if (!products) {
    res.status(500).json({ success: false })
  }
  res.send(products)
})

module.exports = router
