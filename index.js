const express = require('express')
const app = express()
const port = 3000
const handlebars = require('express-handlebars');
const path = require('path');
const route = require('./src/routes')
const db = require('./src/config/db')
const bodyParser = require('body-parser');
const morgan = require('morgan')
const cookieParser = require('cookie-parser')
const methodOverride = require('method-override')

//app.use(bodyParser.json()); 
app.use(express.urlencoded({
    extended: true
}))
app.use(bodyParser.urlencoded({ extended: false }));
app.engine('hbs', handlebars.engine({
    extname: '.hbs',
    helpers: {
        sum: (a, b) => a + b,
    }
}));
app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'src\\resources\\views'));
app.use(express.static(path.join(__dirname, 'src\\public')))

//đổi method
app.use(methodOverride('_method'))

//cookies
app.use(cookieParser())
//morgan console log
app.use(morgan('combined'))

//đường dẫn đến file ảnh
app.use('/uploads', express.static('uploads'))
route(app)
db.connection;

app.listen(port, () => {
    console.log(` http://localhost:${port}/`)
})