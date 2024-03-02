const express = require('express')
const router = express.Router()
const UserController = require('../app/controller/userController')
const CheckController = require('../app/middlewares/checkout')


// lấy tất cả những tài khoản
router.get('/store', CheckController.checkoutManager, UserController.store)
//FORM chỉnh sửa quyền 
router.get('/:slug/edit', CheckController.checkoutManager, UserController.edit)
router.put('/:slug', CheckController.checkoutManager, UserController.update)


// tìm kiếm user
router.post('/search', CheckController.checkout, UserController.searchEmail)

// post form register
router.post('/register', UserController.Register)
// show form đăng ký
router.get('/register', UserController.showRegister)
// post form đăng nhập
router.post('/login', UserController.login)
// show form đăng nhập
router.use('/login', UserController.index)

//log out
router.get('/logout', (req, res) => {
    res.clearCookie('tk_Works')
    res.redirect('/user/login')
})
module.exports = router 