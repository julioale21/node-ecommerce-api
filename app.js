const express = require('express')
const app = express()
const morgan = require('morgan')
const mongoose = require('mongoose')

require('dotenv/config')

const api = process.env.API_URL

// Middleware
app.use(express.json())
app.use(morgan('tiny'))

const productSchema = mongoose.Schema({
  name: String,
  description: {
    type: String,
    required: true
  }
})

const Product = mongoose.model('Product', productSchema)

app.get(`${api}/products`, async (req, res) => {
  const productList = await Product.find()
  res.send(productList)
})

app.post(`${api}/products`, (req, res) => {
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

mongoose.connect(process.env.CONNECTION_STRING)
  .then(() => {
    console.log('Database connected')
  })
  .catch((err) => console.log(err))

app.listen(3000, () => {
  console.log('app running on http://localhost:3000')
})
