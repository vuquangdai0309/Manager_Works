var jwt = require('jsonwebtoken');
const moment = require('moment/moment')
const slugify = require('slugify');
const Works = require('../models/works')
const ProgressWork = require('../models/progressWork')
const ChildWork = require('../models/childWork')
const UserWork = require('../models/user_work')
const comment = require('../models/comment')
const User = require('../models/user')
const { generateUniqueSlug } = require('../middlewares/autoSlug')
class workController {
    // show work
    showWorks(req, res) {
        let token = req.cookies.tk_Works
        let par = jwt.verify(token, 'mk')
        const page = parseInt(req.query.page) || 1; // Trang hiện tại
        const pageSize = 8; // Kích thước trang
        const startIndex = (page - 1) * pageSize;
        const endIndex = page * pageSize;
        User.getAccountById(par._id, (err, account) => {
            if (err) {
                console.log('Lỗi truy vấn', err)
            }
            else {
                if (account[0].role_id <= 2) {
                    UserWork.getAll_User_Work(par._id, (err, data) => {
                        if (err) {
                            console.log('Lỗi truy vấn', err)
                        }
                        else {
                            const totalPages = Math.ceil(data.length / pageSize);
                            const pages = Array.from({ length: totalPages }, (_, index) => {
                                return {
                                    number: index + 1,
                                    active: index + 1 === page,
                                    isDots: index + 1 > 5
                                };
                            });
                            const paginatedData = data.slice(startIndex, endIndex);
                            // Chuẩn bị dữ liệu để truyền vào template
                            const viewData = {
                                work: paginatedData,
                                pagination: {
                                    prev: page > 1 ? page - 1 : null,
                                    next: endIndex < data.length ? page + 1 : null,
                                    pages: pages,
                                },
                            };
                            res.render('works/work', viewData)
                        }
                    })
                    return
                }
                else if (account[0].role_id >= 3) {
                    UserWork.getAll_User_Work_Admin((err, data) => {
                        if (err) {
                            console.log('Lỗi truy vấn', err)
                        }
                        else {
                            const totalPages = Math.ceil(data.length / pageSize);
                            const pages = Array.from({ length: totalPages }, (_, index) => {
                                return {
                                    number: index + 1,
                                    active: index + 1 === page,
                                    isDots: index + 1 > 5
                                };
                            });
                            const paginatedData = data.slice(startIndex, endIndex);
                            // Chuẩn bị dữ liệu để truyền vào template
                            const viewData = {
                                work: paginatedData,
                                pagination: {
                                    prev: page > 1 ? page - 1 : null,
                                    next: endIndex < data.length ? page + 1 : null,
                                    pages: pages,
                                },
                            };
                            res.render('works/work', viewData)
                        }
                    })
                }
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
                    ProgressWork.getDescribe_With_Id(data[0]._id, (err, describe) => {
                        if (err) {
                            console.log('Lỗi truy vấn', err)
                        } else {
                            // const danhSachMuc = describe.map(result => result.content).join(''); 
                            res.render('works/edit', { data: data[0], dataComment: dataComment, describe: describe })

                        }

                    })


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
            UserWork.get_All_Member(work[0]._id, (err, member) => {
                if (err) {
                    console.log('lỗi truy vấn', err)
                }
                UserWork.count_Member(work[0]._id, (err, count) => {
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
                            res.render('works/progress_work', { works, work: work[0], member, count: count[0].count })
                        }
                    })
                })

            }
            )

        })

        // else {
        //     res.render('works/progress_work', {  })
        // }

    }
    // tạo child_work
    createChild_Work(req, res) {
        const form = {
            title: req.body.title,
            work_id: req.body.work_id,
            slug: generateUniqueSlug(req.body.title)
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
            slug: generateUniqueSlug(req.body.title)
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

        const forms = {
            title: req.body.title,
            color: req.body.color,
            date: moment().format('DD-MM-YYYY'),
            slug: generateUniqueSlug(req.body.title)
        }
        Works.addWork(forms, (err, results) => {
            if (err) {
                console.log('lỗi truy vấn', err)
            }
            let token = req.cookies.tk_Works
            let par = jwt.verify(token, 'mk')
            const IdWork = results.insertId

            const formUserWork = {
                account_id: par._id,
                work_id: IdWork,
                date: moment().format('DD-MM-YYYY'),
            }
            UserWork.add_User_Work(formUserWork, (err, data) => {
                if (err) {
                    console.log('lỗi truy vấn', err)
                }
                else {
                    res.redirect('back')
                }
            })


        })
    }
    // thêm người dùng vào nhóm 
    addUser_to_Work(req, res) {
        const email = req.body.email
        const slug = req.params.slug
        User.getAccountByEmail(email, (err, data) => {
            if (err) {
                console.log('Lỗi truy vấn', err)
            }
            Works.getWorkWithSlug(slug, (err, results) => {
                if (err) {
                    console.log('Lỗi truy vấn', err)
                }
                UserWork.get_AccountId_and_WorkId(data[0]._id, results[0]._id, (err, result) => {
                    if (err) {
                        console.log('Lỗi truy vấn', err)
                    }
                    if (result.length > 0) {
                        res.json({ success: true, message: 'Thành viên này đã được thêm' })
                    }
                    else {
                        let token = req.cookies.tk_Works
                        let par = jwt.verify(token, 'mk')
                        UserWork.creat_User_Work({
                            account_id: data[0]._id,
                            work_id: results[0]._id,
                            sender_id: par._id,
                            status_id: 1,
                            show_screen: 1,
                            date: moment().format('DD-MM-YYYY')
                        }, (err) => {
                            if (err) {
                                console.log('Lỗi truy vấn', err)
                            }
                            else {
                                res.json({ success: true, message: 'Đã thêm chờ Admin phê duyệt' })
                            }
                        })
                    }
                })
            })
        })
    }
    // lấy ra những thành viên của công việc 
    search(req, res) {
        let token = req.cookies.tk_Works
        let par = jwt.verify(token, 'mk')
        const page = parseInt(req.query.page) || 1;
        const pageSize = 8;
        const startIndex = (page - 1) * pageSize;
        const endIndex = page * pageSize;
        const searchTerm = req.query.search || '';
        User.getAccountById(par._id, (err, account) => {
            if (err) {
                console.log('Lỗi truy vấn', err)
            }
            else {
                if (account[0].role_id <= 2) {
                    UserWork.search_with_member(par._id, searchTerm, (err, data) => {
                        if (err) {
                            console.error('Lỗi khi tìm kiếm sản phẩm:', err);
                        } else {
                            const totalPages = Math.ceil(data.length / pageSize);
                            const pages = Array.from({ length: totalPages }, (_, index) => {

                                return {
                                    number: index + 1,
                                    active: index + 1 === page,
                                    isDots: index + 1 > 5
                                };
                            });
                            const paginatedData = data.slice(startIndex, endIndex);
                            // Chuẩn bị dữ liệu để truyền vào template
                            const viewData = {
                                work: paginatedData,
                                searchTerm,

                                pagination: {
                                    // valuecurrent: searchTerm,
                                    prev: page > 1 ? page - 1 : null,
                                    next: endIndex < data.length ? page + 1 : null,
                                    pages: pages,
                                },
                            };
                            // Render template và truyền dữ liệu
                            res.render('works/work', viewData)
                        }
                    })
                }
                if (account[0].role_id >= 3) {
                    UserWork.search_with_admin(searchTerm, (err, data) => {
                        if (err) {
                            console.error('Lỗi khi tìm kiếm sản phẩm:', err);
                        } else {
                            const totalPages = Math.ceil(data.length / pageSize);
                            const pages = Array.from({ length: totalPages }, (_, index) => {

                                return {
                                    number: index + 1,
                                    active: index + 1 === page,
                                    isDots: index + 1 > 5
                                };
                            });
                            const paginatedData = data.slice(startIndex, endIndex);
                            // Chuẩn bị dữ liệu để truyền vào template
                            const viewData = {
                                work: paginatedData,
                                searchTerm,

                                pagination: {
                                    // valuecurrent: searchTerm,
                                    prev: page > 1 ? page - 1 : null,
                                    next: endIndex < data.length ? page + 1 : null,
                                    pages: pages,
                                },
                            };
                            // Render template và truyền dữ liệu
                            res.render('works/work', viewData)
                        }
                    })
                }
            }
        })
    }
    // tạo mô tả
    creatDescrible(req, res) {
        let slug = req.body.slug

        ProgressWork.getProgress_With_Slug(slug, (err, data) => {
            if (err) {
                console.log('Lỗi truy vấn', err)
            }
            else {
                if (req.file) {
                    ProgressWork.addDescribe({
                        progress_work_id: data[0]._id,
                        content: req.body.editor,
                        filepdf: req.file.path,
                    }, (err) => {
                        if (err) {
                            console.log('Lỗi truy vấn ', err)
                        }
                        else {
                            res.redirect('back')
                        }
                    })
                }
                else{
                    ProgressWork.addDescribe({
                        progress_work_id: data[0]._id,
                        content: req.body.editor,
                      ///  filepdf: req.file.path,
                    }, (err) => {
                        if (err) {
                            console.log('Lỗi truy vấn ', err)
                        }
                        else {
                            res.redirect('back')
                        }
                    })
                }

            }

        })
    }
}
module.exports = new workController