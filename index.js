const express = require('express');
const app = express();
const path = require('path');
const sassMiddleware = require('node-sass-middleware');

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

// const bodyParser = require('body-parser');
// app.use(bodyParser.urlencoded({extended: false}));

const mustache = require('mustache-express');
app.engine('mustache', mustache());
app.set('view engine', 'mustache');

app.use((err, req, res, next) => {
    console.error(err)
    res.status(500).send('Something broke!')
})

const nedb = require('nedb');
const db = new nedb({filename:'users.db', autoload:true});

db.insert({
    username:'haggishunt56',
    password:'password'
}, function(err, newDoc){
    if(err) {
        console.log('error',err);
    } else {
        console.log('document inserted',newDoc);
    }
});

const authenticationRouter = require('./routes/auth');
app.use('/', authenticationRouter);

const applicationRouter = require('./routes/cwRoutes');
app.use('/', applicationRouter); 

app.listen(3000, () => {
    console.log('Server started on port 3000. Ctrl^c to quit.');
})

