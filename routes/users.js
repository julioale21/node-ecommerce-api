const express = require('express')
const mongoose = require('mongoose')
const User = require('../models/user')
const router = express.Router()
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

router.get('/', async (req, res) => {
  const userList = await User.find().select('-passwordHash')

  if (!userList) {
    return res.status(500).json({ success: false })
  }
  res.status(200).send(userList)
})

router.get('/:id', async (req, res) => {
  const user = await User.findById(req.params.id).select('-passwordHash')

  if (!user) {
    return res.status(500).json({ success: false })
  }
  res.status(200).send(user)
})

router.post('/', async (req, res) => {
  try {
    let user = new User({
      name: req.body.name,
      email: req.body.email,
      passwordHash: bcrypt.hashSync(req.body.password, 10),
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

router.post('/login', async (req, res) => {
  const user = await User.findOne({ email: req.body.email })
  const secret = process.env.SECRET
  if (!user) {
    return res.status(400).send('User not found')
  }

  if (user && bcrypt.compareSync(req.body.password, user.passwordHash)) {
    const token = jwt.sign({
      userId: user.id,
      isAdmin: user.isAdmin
    },
    secret,
    {
      expiresIn: '1d'
    })
    res.status(200).send({ user: user.email, token })
  } else {
    res.status(400).send('Password is wrong')
  }
})

router.post('/register', async (req, res) => {
  let user = new User({
    name: req.body.name,
    email: req.body.email,
    passwordHash: bcrypt.hashSync(req.body.password, 10),
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
    return res.status(400).send('User cannot be created.')
  }
  res.send(user)
})

router.delete('/:id', async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.id)) {
    return res.status(400).json({ success: false, message: 'Invalid User id' })
  }

  try {
    const deletedUser = await User.findByIdAndRemove(req.params.id)
    if (!deletedUser) {
      return res.status(404).json({ success: false, message: 'User could not be deleted' })
    }
    return res.status(200).json({ success: true, message: 'User successfully deleted' })
  } catch (error) {
    return res.status(500).json({ success: false, error })
  }
})

router.get('/get/count', async (req, res) => {
  const count = await User.find().count()

  if (!count) {
    res.status(500).json({ success: false })
  }
  res.send({
    userCount: count
  })
})

module.exports = router
