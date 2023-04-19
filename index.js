const express = require('express');
const app = express();

const path = require('path');
const public = path.join(__dirname, 'public');

const sassMiddleware = require('node-sass-middleware');

app.use(
    sassMiddleware({
        src: path.join(__dirname, '/public/styles/scss'),
        dest: path.join(__dirname, '/public/styles'),
        debug: true,
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

// app.use('/css', express.static(__dirname + '/node_modules/bootstrap/dist/css')); // redirect CSS bootstrap

app.use((err, req, res, next) => {
    console.error(err)
    res.status(500).send('Something broke!')
})

const router = require('./routes/cwRoutes');
app.use('/', router); 

app.listen(3000, () => {
    console.log('Server started on port 3000. Ctrl^c to quit.');
})

