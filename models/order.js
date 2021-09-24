const mongoose = require('mongoose')

const orderSchema = mongoose.Schema({
  orderItems: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'OrderItem',
    required: true
  }]
})

orderSchema.virtual('id').get(function () {
  return this._id.toHexString()
})

orderSchema.set('toJSON', {
  virtuals: true
})

const Order = mongoose.model('Order', orderSchema)

module.exports = Order
