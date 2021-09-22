const express = require('express')
const app = express()
const morgan = require('morgan')
const mongoose = require('mongoose')

require('dotenv/config')

const api = process.env.API_URL

// Middleware
app.use(express.json())
app.use(morgan('tiny'))

app.get(`${api}/products`, (req, res) => {
  const product = {
    id: 1,
    name: 'Hair dresser',
    image: 'some url'
  }
  res.send(product)
})

app.post(`${api}/products`, (req, res) => {
  const newProduct = req.body
  console.log(newProduct)
  res.send(newProduct)
})

mongoose.connect(process.env.CONNECTION_STRING)
  .then(() => {
    console.log('Database connected')
  })
  .catch((err) => console.log(err))

app.listen(3000, () => {
  console.log(api)
  console.log('app running on http://localhost:3000')
})
