const express = require('express')
const User = require('../models/user')
const router = express.Router()

router.get('/', async (req, res) => {
  const userList = await User.find()

  if (!userList) {
    return res.status(500).json({ success: false })
  }
  res.status(200).send(userList)
})

router.post('/', async (req, res) => {
  try {
    let user = new User({
      name: req.body.name,
      email: req.body.email,
      passwordHash: req.body.passwordHash,
      phone: req.body.phone,
      isAdmin: req.body.isAdmin,
      street: req.body.street,
      apartment: req.body.apartment,
      zip: req.body.zip,
      city: req.body.city,
      country: req.body.country
    })

    user = await user.save()
    if (!user) {
      res.status(400).json({ success: false, message: 'User could not be created.' })
    }
    res.status(201).send(user)
  } catch (error) {
    res.status(500).json({ success: false, error })
  }
})

module.exports = router
