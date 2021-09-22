const express = require('express')
const app = express()
const morgan = require('morgan')
const mongoose = require('mongoose')
const cors = require('cors')
const productRouter = require('./routes/products')

app.use(cors())
app.options('*', cors())

require('dotenv/config')

// Middleware
app.use(express.json())
app.use(morgan('tiny'))

const api = process.env.API_URL

app.use(`${api}/products`, productRouter)

mongoose.connect(process.env.CONNECTION_STRING)
  .then(() => {
    console.log('Database connected')
  })
  .catch((err) => console.log(err))

app.listen(3000, () => {
  console.log(api)
  console.log('app running on http://localhost:3000')
})
