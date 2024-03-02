const Room = require('../models/room')
const Account = require('../models/user')
const Role = require('../models/role')
var jwt = require('jsonwebtoken');
class UserController {
    // show form đăng nhập
    index(req, res) {
        res.render('user/login')
    }
    // show form đăng ký
    showRegister(req, res) {
        Room.getAllRoom((err, room) => {
            if (err) {
                console.log('Lỗi truy vấn', err)
            }
            else {
                res.render('user/register', { room })
            }
        })

    }
    // đăng nhập
    login(req, res, next) {

        var username = req.body.username
        var password = req.body.password
        //tìm kiếm user theo tên

        Account.getAccountByNameAndPassword(username, password, (err, results) => {
            if (err) {
                res.status(500).json({ error: 'Internal Server Error' });
                return;
            } else {
                if (results.length > 0) {
                    const account = results[0]
                    //tạo token cho Id
                    var token = jwt.sign({ _id: account._id }, 'mk')
                    // var par = jwt.verify(token, 'mk')
                    res.json({
                        message: 'Đăng nhập thành công',
                        token: token,
                        getUser: account,
                    })
                }
            }
        })
    }
    //[post] form register
    Register(req, res, next) {
        var email = req.body.email
        var username = req.body.username
        var password = req.body.password
        var room_id = req.body.room_id

        Account.getAccountByNameorEmail(username, email, (err, results) => {
            if (err) {
                res.status(500).json({ error: 'Internal Server Error' });
                return;
            }
            if (results.length > 0) {

                res.json({ message: 'Tài khoản đã tồn tại', })

            }
            else {
                Account.addAccount({
                    username: username,
                    email: email,
                    password: password,
                    room_id: room_id
                }, (err, results) => {
                    if (err) {
                        console.log('Lỗi thêm tài khoản ', err)
                    }
                    else {
                        res.json({ message: 'Đăng kí thành công' })
                    }
                })
            }
        })
    }
    // [GET] get all User
    store(req, res) {
        const page = parseInt(req.query.page) || 1; // Trang hiện tại
        const pageSize = 8; // Kích thước trang
        const startIndex = (page - 1) * pageSize;
        const endIndex = page * pageSize;
        Account.getAllUser((err, results) => {
            if (err) {
                console.log('Lỗi truy vấn', err)
            }
            else {
                const totalPages = Math.ceil(results.length / pageSize);
                const pages = Array.from({ length: totalPages }, (_, index) => {
                    return {
                        number: index + 1,
                        active: index + 1 === page,
                        isDots: index + 1 > 5
                    };
                });
                const paginatedData = results.slice(startIndex, endIndex);
                // Chuẩn bị dữ liệu để truyền vào template
                const viewData = {
                    data: paginatedData,

                    pagination: {
                        prev: page > 1 ? page - 1 : null,
                        next: endIndex < results.length ? page + 1 : null,
                        pages: pages,
                    },
                };
                res.render('user/store', viewData)
            }
        })
    }
    // [GET] form Edit
    edit(req, res) {
        const username = req.params.slug
        Account.getAllUser_name(username, (err, data) => {
            if (err) {
                console.log('Lỗi truy vấn', err)
            }
            Role.getAllRole((err, role) => {
                if (err) {
                    console.log('Lỗi truy vấn', err)
                }
                else {
                    res.render('user/edit', { data: data[0], role })
                }
            })
        })
    }
    // [PUT]  update
    update(req, res) {
        const username = req.params.slug
        console.log(username)
        Account.getAllUser_name(username, (err, data) => {
            if (err) {
                console.log('Lỗi truy vấn', err)
            }
            Account.updateRole(data[0]._id, {
                role_id: req.body.role_id
            }, err => {
                if (err) {
                    console.log('Lỗi truy vấn', err)
                } else {
                    res.redirect('/user/store')
                }
            })
        })
    }
    // [GET] render formpass
    renderchangepass(req, res) {
        res.render('user/changePassword')
    }
    //[POST] change pass
    changepass(req, res, next) {

        var token = req.cookies.token
        var id_token = jwt.verify(token, 'mk')
        // lấy id dựa vào verify token
        const idUser = id_token._id
        //mật khẩu hiện tại
        const password = req.body.currentpassword
        // mật khẩu để thay đổi
        const passwordchange = req.body.password
        // Kiểm tra mật khẩu nhập đúng k
        Account.getAccountIdAndPassword(idUser, password, (err, data) => {
            if (err) {
                res.status(500).json({ error: 'Internal Server Error' });
                return;
            }
            if (data.length === 0) {
                res.json({ message: 'Mật khẩu hiện tại không đúng ' })
            } else {
                //nếu đúng update tài khoản 
                Account.updateAccount(idUser, {
                    password: passwordchange
                }, (err, results) => {
                    if (err) {
                        res.status(500).json({ error: 'Internal Server Error' });
                        return;
                    } else {
                        if (results.affectedRows === 0) {
                            res.status(404).send(' not found');
                        } else {
                            res.json({ message: 'Thay đổi mật khẩu thành công' })
                        }
                    }
                })
            }
        })
    }
    // [get] forget PASSWORD
    showforgot(req, res) {
        res.render('user/forgotPassword')
    }
    // [post ] email when forget password
    forgot(req, res, next) {
        let email = req.body.email
        Account.getAccountByEmail(email, (err, results) => {
            if (err) {
                res.status(500).json({ error: 'Internal Server Error' });
                return;
            }
            else {
                if (results.length > 0) {
                    const data = results[0]
                    const { sign } = require('../middlewares/Jwt');
                    const host = req.header('host');
                    const resetLink = `${req.protocol}://${host}/user/reset?token=${sign(email)}&email=${email}`
                    const { sendForgotPasswordMail } = require('../middlewares/Email')
                    sendForgotPasswordMail(data, host, resetLink)
                        .then((result) => {
                            console.log('email has been sent')
                            return res.render('user/forgotPassword', { done: true })
                        })
                        .catch(error => {
                            console.log(error.status)
                            return res.render('user/forgotPassword', { message: "check email " })
                        })
                } else {
                    return res.render('user/forgotPassword', { done: false })
                }

            }
        })

    }
    // [get]  show reset password
    showReset(req, res) {
        let email = req.query.email;
        let token = req.query.token;
        let { verify } = require('../middlewares/Jwt');

        if (!token || !verify(token)) {
            return res.render('user/reset', { expired: true })
        }
        else {
            return res.render('user/reset', { email, token })
        }
    }
    resetPass(req, res, next) {
        const password = req.body.password
        const email = req.body.email
        console.log(email)
        Account.updateForgotAccount(email, { password: password }, (err, results) => {
            if (err) {
                res.status(500).json({ error: 'Internal Server Error' });
                return;
            }
            if (results.length === 0) {
                res.json({ message: "Link của bạn hết hiệu lực" })
            }
            else {
                if (results.affectedRows === 0) {
                    res.status(404).send(' not found');
                } else {
                    res.json({ message: "Thay đổi mật khẩu thành công" })
                }
            }
        })
    }
    searchEmail(req, res) {
        const searchEmail = req.body.searchTerm
        Account.searchEmail(searchEmail, (err, data) => {
            if (err) {
                console.log('Lỗi truy vấn', err)
            }
            else {
                res.json(data)
            }
        })
    }
   

}
module.exports = new UserController