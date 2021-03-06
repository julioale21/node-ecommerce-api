const Category = require('../models/category')
const express = require('express')
const router = express.Router()

router.get('/', async (req, res) => {
  const categoryList = await Category.find()
  if (!categoryList) {
    res.status(500).json({ success: false })
  }
  res.status(200).send(categoryList)
})

router.get('/:id', async (req, res) => {
  try {
    const category = await Category.findById(req.params.id)
    if (!category) {
      res.status(404).json({
        success: false,
        message: 'Category not found.'
      })
    }
    res.status(200).send(category)
  } catch (error) {
    res.status(400).json({
      success: false,
      error
    })
  }
})

router.post('/', async (req, res) => {
  let category = new Category({
    name: req.body.name,
    icon: req.body.icon,
    color: req.body.color
  })
  category = await category.save()

  if (!category) {
    res.status(404).send('the category cannot be created')
  }
  res.send(category)
})

router.put('/:id', async (req, res) => {
  const category = await Category.findByIdAndUpdate(
    req.params.id,
    {
      name: req.body.name,
      icon: req.body.icon,
      color: req.body.color
    },
    {
      new: true
    }
  )
  if (!category) {
    res.status(404).json({
      success: false,
      message: 'Category could not be updated'
    })
  }
  res.status(200).send(category)
})

router.delete('/:id', async (req, res) => {
  try {
    const deletedCategory = await Category.findByIdAndRemove(req.params.id)
    if (!deletedCategory) {
      res.status(404).json({
        success: false,
        message: 'Category not found.'
      })
    }
    res.status(200).json({
      success: true,
      message: 'The category was successfully deleted.'
    })
  } catch (error) {
    res.status(400).json({
      success: false,
      error
    })
  }
})

module.exports = router
