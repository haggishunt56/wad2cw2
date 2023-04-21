const express = require('express');
const app = express();
const path = require('path');
const sassMiddleware = require('node-sass-middleware');
require('dotenv').config()

// set sass middleware
app.use(
    sassMiddleware({
        src: path.join(__dirname, '/public/styles/scss'),
        dest: path.join(__dirname, '/public/styles'),
        debug: false,
        outputStyle: 'expanded',
        prefix: '/styles'
    }),
    express.static(__dirname + '/public')
);

// parse form input from user
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({extended: false}));

// set view enging
const mustache = require('mustache-express');
app.engine('mustache', mustache());
app.set('view engine', 'mustache');

app.use((err, req, res, next) => {
    console.error(err)
    res.status(500).send('Something broke!')
})

// instantiate database
const nedb = require('nedb');
const db = new nedb({filename:'users.db', autoload:true});

// create routes file
const applicationRouter = require('./routes/cwRoutes');
app.use('/', applicationRouter); 

// session cookie
const cookieParser = require('cookie-parser')
app.use(cookieParser())

// start server
app.listen(3000, () => {
    console.log('Server started on port 3000. Ctrl^c to quit.');
})

