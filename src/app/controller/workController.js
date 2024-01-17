var jwt = require('jsonwebtoken');
const moment = require('moment/moment')
const slugify = require('slugify');
const Works = require('../models/works')
const ProgressWork = require('../models/progressWork')
const ChildWork = require('../models/childWork')
const comment = require('../models/comment')
class workController {
    // show work
    showWorks(req, res) {
        Works.getAllWork((err, work) => {
            if (err) {
                console.log('Lỗi truy vấn')
            }
            else {
                res.render('works/work', { work })
            }
        })

    }
    showEditProgress(req, res) {
        const slug = req.params.slug
        const { formatDuration } = require('../middlewares/setTime')
        ProgressWork.getProgress_With_Slug(slug, (err, data) => {
            if (err) {
                console.log('Lỗi truy vấn', err)
            }
            comment.getAllCommment(data[0]._id, (err, comment) => {
                if (err) {
                    console.log('Lỗi truy vấn', err)
                } else {
                    const dataComment = comment.map(data => {
                        const createdAt = moment(data.createAt);
                        const duration = moment.duration(moment().diff(createdAt));
                        const elapsedTime = formatDuration(duration)
                        return {
                            elapsedTime: elapsedTime,
                            username: data.username,
                            comment: data.comment
                        }
                    })

                    res.render('works/edit', { data: data[0], dataComment: dataComment })
                }
            })


        })

    }
    // show child_work 
    showDetailWorks(req, res) {
        const slug = req.params.slug
        Works.getWorkWithSlug(slug, (err, work) => {
            if (err) {
                console.log('lỗi truy vấn', err)
            }
            ProgressWork.getAllProgress_With_WorkId(work[0]._id, (err, results) => {
                if (err) {
                    console.log('Lỗi truy vấn', err)
                } else {

                    const works = results.reduce((acc, row) => {
                        const work = acc.find(c => c.child_work_id === row.child_work_id)
                        if (!work) {
                            if (row.progress_work_id) {
                                acc.push({
                                    child_work_id: row.child_work_id,
                                    child_work_title: row.child_work_title,

                                    progress_works: [{
                                        progress_work_id: row.progress_work_id,
                                        progress_work_title: row.progress_work_title,
                                        progress_work_slug: row.progress_work_slug,
                                        comment_count: row.comment_count,
                                        progress_work_date: row.progress_work_date
                                    }]
                                })
                            } else {
                                acc.push({
                                    child_work_id: row.child_work_id,
                                    child_work_title: row.child_work_title,

                                    progress_works: []

                                })
                            }
                        }
                        else {
                            if (row.progress_work_id) {
                                work.progress_works.push({
                                    progress_work_id: row.progress_work_id,
                                    progress_work_title: row.progress_work_title,
                                    progress_work_slug: row.progress_work_slug,
                                    comment_count: row.comment_count,
                                    progress_work_date: row.progress_work_date
                                })
                            }
                        }
                        return acc
                    }, [])
                    res.render('works/progress_work', { works, work: work[0] })
                }
            })
            // else {
            //     res.render('works/progress_work', {  })
            // }
        })
    }
    // tạo child_work
    createChild_Work(req, res) {
        const form = {
            title: req.body.title,
            work_id: req.body.work_id,
            slug: slugify(req.body.title, {
                lower: true,
                remove: /[*+~.()'"!:@]/g,
            })
        }
        ChildWork.addChildWork(form, (err) => {
            if (err) {
                console.log('Lỗi truy vấn ', err)
            }
            else {
                res.redirect('back')
            }
        })
    }
    // update progress_work
    updateProgressWork(req, res) {
        const slug = req.params.slug
        ProgressWork.getProgress_With_Slug(slug, (err, data) => {
            if (err) {
                console.log('Lỗi truy vấn', err)
            }
            const progress_work_id = data[0]._id
            ProgressWork.update_Progress_work((progress_work_id), {
                title: req.body.title,
                date: moment().format('DD-MM-YYYY'),
                slug: slugify(req.body.title, { lower: true }),
            }, (err) => {
                if (err) {
                    console.log('Lỗi truy vấn')
                }
                else {
                    res.redirect('back')
                }
            })
        })
    }

    // tạo progress_work của child_work
    createProgressWork(req, res) {
        const form = {
            title: req.body.title,
            child_work_id: req.body.child_work_id,
            date: moment().format('DD-MM-YYYY'),
            slug: slugify(req.body.title, { lower: true })
        }
        ProgressWork.addProgressWork(form, (err) => {
            if (err) {
                console.log('Lỗi truy vấn ', err)
            }
            else {
                res.redirect('back')
            }
        })
    }
    // tạo work
    create(req, res) {
        let token = req.cookies.tk_Works
        let par = jwt.verify(token, 'mk')
        const forms = {
            title: req.body.title,
            user_id_send: par._id,
            date: moment().format('DD-MM-YYYY'),
            slug: slugify(req.body.title, { lower: true })
        }
        Works.addWork(forms, (err) => {
            if (err) {
                console.log('lỗi truy vấn', err)
            }
            else {
                res.redirect('back')
            }
        })
    }
}
module.exports = new workController