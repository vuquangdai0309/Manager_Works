const express = require('express')
const router = express.Router()
const UserController = require('../app/controller/userController')
// post form register
router.post('/register', UserController.Register)
// show form đăng ký
router.get('/register', UserController.showRegister)

// post form đăng nhập
router.post('/login', UserController.login)
// show form đăng nhập
router.use('/login', UserController.index)

module.exports = router 