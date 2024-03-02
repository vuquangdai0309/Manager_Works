const User = require('../models/user')
const User_Work = require('../models/user_work')
class HomeController {
    index(req, res) {
        User.count_User((err, result) => {
            if (err) {
                console.log('Lỗi truy vấn', err)
            }
            else {
                User_Work.count_User_Work((err, results) => {
                    if (err) {
                        console.log('Lỗi truy vấn', err)
                    }
                    else {
                        res.render('home', { count: result[0].count, countWork: results[0].count })
                    }
                })

            }
        })

    }
    subscribe(req, res) {

        // const message = 'Chào mừng bạn
        // subscribeUser.subscribeUser(subscription, message)
        res.render('works/work')
    }
}
module.exports = new HomeController