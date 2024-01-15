const express = require('express')
const router = express.Router()
const HomeController = require('../app/controller/homeController')
router.use('/', HomeController.index)
module.exports = router