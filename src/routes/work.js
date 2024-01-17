const express = require('express')
const router = express.Router()
const workController = require('../app/controller/workController')


// create progress work
router.post('/createChild', workController.createChild_Work)
// create progress work
router.post('/detail', workController.createProgressWork)
// put
router.put('/:slug', workController.updateProgressWork)
// show edit
router.get('/:slug/edit', workController.showEditProgress)
// show detail work
router.get('/:slug/detail', workController.showDetailWorks)

router.post('/', workController.create)
// show works
router.get('/', workController.showWorks)
module.exports = router 