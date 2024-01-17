const jwt = require('jsonwebtoken');
const comment = require('../models/comment')
const progress = require('../models/progressWork')
const moment = require('moment/moment')

class commentController {
    create(req, res) {
        let token = req.cookies.tk_Works
        let par = jwt.verify(token, 'mk')
        let slug = req.params.slug
        progress.getProgress_With_Slug(slug, (err, data) => {
            if (err) {
                console.log('Lỗi truy vấn', err)
            }
            comment.addComment({
                user_id: par._id,
                progress_work_id: data[0]._id,
                comment: req.body.comment,
                date: moment().format('YYYY-MM-DD HH:mm:ss'),
            }, (err) => {
                if (err) {
                    console.log('Lỗi truy vấn ', err)
                }
                else {
                    res.redirect('back')
                }
            })
        })
    }
    store(req, res) {
        let slug = req.params.slug
        progress.getProgress_With_Slug(slug, (err, data) => {
            if (err) {
                console.log('Lỗi truy vấn', err)
            }
        })
    }
}
module.exports = new commentController