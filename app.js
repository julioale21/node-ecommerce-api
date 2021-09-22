const express = require('express')
const app = express()

require('dotenv/config')

const api = process.env.API_URL

app.get(api + '/products', (req, res) => {
  res.send('from products')
})

app.listen(3000, () => {
  console.log(api)
  console.log('app running on http://localhost:3000')
})
