const express = require('express')
const router = express.Router()
const StatusController = require('../app/controller/statusController')
const CheckController = require('../app/middlewares/checkout')
// Chỉnh sửa trạng thái
router.get('/:slug/edit', CheckController.checkoutManager, StatusController.edit)
// Update trạng thái
router.put('/:slug', CheckController.checkoutManager, StatusController.update)
// lấy tất cả những trạng thái chờ duyệt
router.get('/', CheckController.checkoutManager, StatusController.index)
module.exports = router 