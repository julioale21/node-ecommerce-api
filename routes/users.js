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

module.exports = router
