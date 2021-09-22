const mongoose = require('mongoose')

const productSchema = mongoose.Schema({
  name: String,
  description: {
    type: String,
    required: true
  }
})

const Product = mongoose.model('Product', productSchema)

module.exports = Product
