const express = require('express')
const app = express()
const morgan = require('morgan')
const mongoose = require('mongoose')
const cors = require('cors')
const productsRouter = require('./routes/products')
const categoriesRouter = require('./routes/categories')
const usersRouter = require('./routes/users')
const authJwt = require('./helpers/jwt')

app.use(cors())
app.options('*', cors())

require('dotenv/config')

// Middlewares
app.use(express.json())
app.use(morgan('tiny'))
//app.use(authJwt())

const api = process.env.API_URL

app.use(`${api}/products`, productsRouter)
app.use(`${api}/categories`, categoriesRouter)
app.use(`${api}/users`, usersRouter)

mongoose.connect(process.env.CONNECTION_STRING)
  .then(() => {
    console.log('Database connected')
  })
  .catch((err) => console.log(err))

app.listen(3000, () => {
  console.log(api)
  console.log('app running on http://localhost:3000')
})
