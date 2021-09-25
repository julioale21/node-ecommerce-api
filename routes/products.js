const express = require('express')
const router = express.Router()
const Category = require('../models/category')
const Product = require('../models/product')
const mongoose = require('mongoose')
const multer = require('multer')

const FILE_TIP_MAP = {
  'image/png': 'png',
  'image/jp`g': 'jpg',
  'image/jpeg': 'jpeg'
}
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const isValidFile = FILE_TIP_MAP[file.mimetype]
    let uploadError = new Error('invlida image type')

    if (isValidFile) {
      uploadError = null
    }
    cb(uploadError, 'public/uploads')
  },
  filename: function (req, file, cb) {
    let fileName = file.originalname.split(' ')
      .join('-')

    fileName = fileName.replace(`.${FILE_TIP_MAP[file.mimetype]}`, '')
    const extension = FILE_TIP_MAP[file.mimetype]
    cb(null, `${fileName}-${Date.now()}.${extension}`)
  }
})

const uploadOptions = multer({ storage: storage })

// api/v1/products?categories=3232,23123
router.get('/', async (req, res) => {
  let filter = {}
  if (req.query.categories) {
    filter = { category: req.query.categories.split(',') }
  }

  const productList = await Product.find(filter).populate('category')

  if (!productList) {
    res.status(500).json({ success: false })
  }

  res.send(productList)
})

router.get('/:id', async (req, res) => {
  const product = await Product.findById(req.params.id)
    .populate('category')

  if (!product) {
    res.status(500).json({ success: false })
  }
  res.send(product)
})

router.post('/', uploadOptions.single('image'), async (req, res) => {
  const category = await Category.findById(req.body.category)
  if (!category) {
    return res.status(400).json({ success: false, message: 'Invalid Category' })
  }

  const file = req.file
  if (!file) return res.status(400).send('No image in the request')

  const fileName = req.file.filename
  const basePath = `${req.protocol}://${req.get('host')}/public/uploads/`

  let product = new Product({
    name: req.body.name,
    description: req.body.description,
    richDescription: req.body.richDescription,
    image: `${basePath}${fileName}`,
    brand: req.body.brand,
    price: req.body.price,
    category: req.body.category,
    countInStock: req.body.countInStock,
    rating: req.body.rating,
    numReviews: req.body.numReviews,
    isFeature: req.body.isFeature
  })
  product = await product.save()

  if (!product) {
    res.status(500).json({ success: false, message: 'Product could not be created' })
  }
  res.status(200).send(product)
})

router.put('/:id', uploadOptions.single('image'), async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.id)) {
    return res.status(400).json({ success: false, message: 'Invalid Product id' })
  }

  const category = await Category.findById(req.body.category)
  if (!category) {
    return res.status(400).json({ success: false, message: 'Invalid Category' })
  }

  const product = await Product.findById(req.params.id)
  if (!product) {
    return res.status(400).send('Invalid product')
  }

  const file = req.file
  let imagepath

  if (file) {
    const fileName = file.filename
    const basePath = `${req.protocol}://${req.get('host')}/public/uploads/`
    imagepath = `${basePath}${fileName}`
  } else {
    imagepath = product.image
  }

  const updatedProduct = await Product.findByIdAndUpdate(
    req.params.id,
    {
      name: req.body.name,
      description: req.body.description,
      richDescription: req.body.richDescription,
      image: imagepath,
      brand: req.body.brand,
      price: req.body.price,
      category: req.body.category,
      countInStock: req.body.countInStock,
      rating: req.body.rating,
      numReviews: req.body.numReviews,
      isFeature: req.body.isFeature
    },
    { new: true }
  )

  if (!updatedProduct) {
    res.status(500).json({ success: false, message: 'Product could not be updated' })
  }
  res.status(200).send(updatedProduct)
})

router.put(
  '/gallery-images/:id',
  uploadOptions.array('images', 10),
  async (req, res) => {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({ success: false, message: 'Invalid Product id' })
    }

    const files = req.files
    const imagesPaths = []
    const basePath = `${req.protocol}://${req.get('host')}/public/uploads/`

    if (files) {
      files.map((file) => imagesPaths.push(`${basePath}${file.fileName}`))
    }

    const product = await Product.findByIdAndUpdate(
      req.params.id,
      {
        images: imagesPaths
      },
      { new: true }
    )

    if (!product) {
      res.status(400).send('Error uploading files')
    }
    res.status(200).send(product)
  }
)

router.delete('/:id', async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.id)) {
    return res.status(400).json({ success: false, message: 'Invalid Product id' })
  }

  try {
    const deletedProduct = await Product.findByIdAndDelete(req.params.id)
    if (!deletedProduct) {
      return res.status(404).json({ success: false, message: 'Product could not be deleted' })
    }
    return res.status(200).json({ success: true, message: 'Product successfully deleted' })
  } catch (error) {
    return res.status(500).json({ success: false, error })
  }
})

router.get('/get/count', async (req, res) => {
  const productCount = await Product.find().count()

  if (!productCount) {
    res.status(500).json({ success: false })
  }
  res.send({ count: productCount })
})

router.get('/get/featured/:count', async (req, res) => {
  const count = req.params.count ? req.params.count : 1
  console.log('count', count)
  const products = await Product.find({
    isFeature: true
  }).limit(+count)

  if (!products) {
    res.status(500).json({ success: false })
  }
  res.send(products)
})

module.exports = router
