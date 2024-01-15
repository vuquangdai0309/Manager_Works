const express = require('express')
const router = express.Router()
const CommentController = require('../app/controller/commentController')
// create Comment 
router.post('/:slug/comment', CommentController.create)
module.exports = router 