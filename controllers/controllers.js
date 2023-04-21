exports.serverError= function(err, req, res, next) {
    console.error(err);
    res.status(500);
    res.type('text/plain'); 
    res.send('Internal Server Error.'); 
}

exports.landing_page = function(req, res) {
    res.render('home', {
        'title': 'Home'
    });
}

exports.register_page = function(req, res) {
    res.render('register', {
        'title': 'Register account'
    });
}

exports.register_new_user = function(req, res) {
    const userDao = require('../models/user.js');
    const username = req.body.username;
    const password = req.body.password;

    if (!username || !password) {
        res.status(401).send('Incorrect username or password.');
        return;
    }

    userDao.lookup(username, function(err, u) {
        if (u) {
            res.status(400).send("Error: User " + username + " already exists!");
            return;
        }
        userDao.create(username, password);
        console.log("register user", username, "password", password);
        res.redirect('/login'); //todo - message on screen that the account is created
    });
}

exports.log_in_page = function(req, res) {
    res.render('login', {
        'title': 'Log in'
    });
}

exports.log_in_submit = function(req, res, next) {
    res.render("/", {
        title: "Logged in!",
    });
}

exports.notFound= function(req, res) { 
    res.status(404); 
    res.type('text/plain');
    res.send('404 Not found.');
}
