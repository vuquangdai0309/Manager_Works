const homeRouter = require('./home')
const userRouter = require('./user')
const workRouter = require('./work')
const commentRouter = require('./comment')
function route(app) {
    app.use('/comment',commentRouter)
    app.use('/work',workRouter)
    app.use('/user', userRouter)
    app.use('/', homeRouter)
}
module.exports = route