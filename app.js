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
  description: String
})

const Product = mongoose.model('Product', productSchema)

app.get(`${api}/products`, (req, res) => {
  const product = {
    id: 1,
    name: 'Hair dresser',
    image: 'some url'
  }
  res.send(product)
})

app.post(`${api}/products`, (req, res) => {
  const product = new Product({
    ...req.body
  })
  product.save().then((createdProduct) => {
    res.status(201).json(createdProduct)
  })
    .catch((err) => res.status(500).json({
      error: err,
      success: false
    }))
})

mongoose.connect(process.env.CONNECTION_STRING, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
  .then(() => {
    console.log('Database connection is ready')
  })
  .catch((err) => console.log(err))

app.listen(3000, () => {
  console.log(api)
  console.log('app running on http://localhost:3000')
})
