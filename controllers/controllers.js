const userDao = require('../models/user.js');

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
    const username = req.body.username;
    const password = req.body.password;

    if (!username || !password) {
        res.status(401).send('Please provide a username and password');
        return;
    }

    userDao.lookup(username, function(err, u) {
        if (u) {
            res.status(400).send("Error: User " + username + " already exists!");
            return;
        }
        userDao.create(username, password);
        // console.log("register user", username, "password", password);
        res.redirect('/login'); //todo - message on screen that the account is created
    });
}

exports.log_in_page = function(req, res) {
    res.render('login', {
        'title': 'Log in'
    });
}

