const express = require('express')
const router = express.Router()
const HomeController = require('../app/controller/homeController')
router.get('/', HomeController.index)
router.post('/subscribe', HomeController.subscribe)
module.exports = router