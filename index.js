const express = require('express')
const app = express()
const port = 3000
const handlebars = require('express-handlebars');
const path = require('path');
const route = require('./src/routes')
const db = require('./src/config/db')
const bodyParser = require('body-parser');
const morgan = require('morgan')
var cookieParser = require('cookie-parser')

app.use(express.urlencoded({
    extended: true
}))
app.use(bodyParser.urlencoded({ extended: false }));
app.engine('hbs', handlebars.engine({
    extname: '.hbs',
}));
app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'src\\resources\\views'));
app.use(express.static(path.join(__dirname, 'src\\public')))

//cookies
app.use(cookieParser())
//morgan console log
app.use(morgan('combined'))
route(app)
db.connection;
app.listen(port, () => {
    console.log(` http://localhost:${port}/`)
})