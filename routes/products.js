const express = require('express')
const router = express.Router()
const Product = require('../models/product')

router.get('/', async (req, res) => {
  const productList = await Product.find()

  if (!productList) {
    res.status(500).json({ success: false })
  }

  res.send(productList)
})

router.post('/', (req, res) => {
  const product = new Product({
    ...req.body
  })
  product.save()
    .then((createdProduct) => {
      res.status(201).json(createdProduct)
    })
    .catch((error) => {
      res.status(500).json({
        error,
        success: false
      })
    })
})

module.exports = router
