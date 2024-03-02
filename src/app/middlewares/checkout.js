
const Account = require('../models/user')
var jwt = require('jsonwebtoken');
class CheckController {
    checkout(req, res, next) {
        let token = req.cookies.tk_Works
       
        if (token === undefined) {
            res.redirect('/user/login')
        }
        else {
            var idUser = jwt.verify(token, 'mk')
            Account.getAccountById(idUser._id, (err, results) => {
                if (err) {
                    res.status(500).json({ error: 'Internal Server Error' });
                    return;
                }
                else {
                    if (results.length === 0) {
                        res.redirect('/user/login')
                    }
                    else {
                        if (results[0].role_id >= 0) {
                            next()
                        }
                        else {
                            res.redirect('/user/login')
                        }
                    }
                }
            })
        }
    }

    checkoutManager(req, res, next) {
        let token = req.cookies.tk_Works
        if (token === undefined) {
            res.redirect('/user/login')
        }
        else {
            var idUser = jwt.verify(token, 'mk')
            Account.getAccountById(idUser._id, (err, results) => {
                if (err) {
                    res.status(500).json({ error: 'Internal Server Error' });
                    return;
                }
                else {
                    if (results.length === 0) {
                        res.redirect('/user/login')
                    }
                    else {
                        if (results[0].role_id >= 3) {
                            next()
                        }
                        else {
                            res.redirect('back')
                        }
                    }
                }
            })
        }
    }
}
module.exports = new CheckController
