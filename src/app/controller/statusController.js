const Status = require('../models/status')
var jwt = require('jsonwebtoken');
const subscribeUser = require('../middlewares/webPush');
class statusController {
    index(req, res) {
        const page = parseInt(req.query.page) || 1; // Trang hiện tại
        const pageSize = 8; // Kích thước trang
        const startIndex = (page - 1) * pageSize;
        const endIndex = page * pageSize;
        Status.get_Account_Work((err, results) => {
            if (err) {
                console.log('Lỗi truy vấn ', err)
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
                res.render('status/status', viewData)
            }
        })
    }
    edit(req, res) {
        const id = req.params.slug
        Status.get_Id_User_Work(id, (err, data) => {
            if (err) {
                console.log('Lỗi truy vấn ', err)
            }
            Status.get_All_status((err, status) => {
                if (err) {
                    console.log('Lỗi truy vấn ', err)
                }
                else {
                    res.render('status/edit', { data: data[0], status })
                }
            })

        })
    }
    update(req, res) {
        let token = req.cookies.tk_Works
        let par = jwt.verify(token, 'mk')

        const id = req.params.slug
        const subscription = JSON.parse(req.body.subscription)
        const status_id = req.body.status

        Status.update_Status(id, { status_id: status_id }, (err) => {
            if (err) {
                console.log('Lỗi truy vấn ', err)
            }
            else {
                // console.log(id)
                Status.getOneUser_Work(id, (err, result) => {
                    if (err) {
                        console.log('Lỗi truy vấn ', err)
                    }
                    else {
                        const id_account = result[0].account_id
                        //   console.log(id_account)
                        if (status_id == 2 && id_account == par._id) {
                            const message = 'Bạn đã được duyệt vào nhóm mới'
                            subscribeUser.subscribeUser(subscription, message)
                        }
                    }
                })
                res.render('works/work')

            }
        })
    }
}
module.exports = new statusController