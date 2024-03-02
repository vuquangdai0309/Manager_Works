const homeRouter = require('./home')
const userRouter = require('./user')
const workRouter = require('./work')
const commentRouter = require('./comment')
const statusRouter = require('./status')
function route(app,io) {
    app.use('/comment',commentRouter)
    app.use('/work',workRouter)
    app.use('/user', userRouter)
    app.use('/status',statusRouter)
    app.use('/', homeRouter)
}
module.exports = route