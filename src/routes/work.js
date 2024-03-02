const express = require('express')
const router = express.Router()
const workController = require('../app/controller/workController')
const CheckController = require('../app/middlewares/checkout')
const upload = require('../app/middlewares/upload')
router.post('/:slug/createMember', CheckController.checkout, workController.addUser_to_Work)
// create progress work
router.post('/createChild', CheckController.checkout, workController.createChild_Work)
// create progress work
router.post('/detail', CheckController.checkout, workController.createProgressWork)
// put
router.put('/:slug', CheckController.checkout, workController.updateProgressWork)
// show edit
router.get('/:slug/edit', CheckController.checkout, workController.showEditProgress)
// show detail work
router.get('/:slug/detail', CheckController.checkout, workController.showDetailWorks)

// create describe
router.post('/describe', CheckController.checkout, upload.single('file'), workController.creatDescrible)
// tìm kiếm work
router.get('/search', CheckController.checkout, workController.search)

router.post('/', CheckController.checkout, workController.create)
// show works
router.get('/', CheckController.checkout, workController.showWorks)
module.exports = router 