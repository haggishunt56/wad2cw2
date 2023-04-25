const userDao = require('../models/user.js');

exports.landing_page = function(req, res) {
    res.render('landing', {
        'title': 'Home'
    });
}

exports.about = (req, res) => {
    res.render("about", {
        "title": "About us"
    });
}

exports.register_page = (req, res) => {
    res.render('register', {
        'title': 'Register account'
    });
}

exports.register_new_user = (req, res) => {
    const username = req.body.username;
    const email = req.body.email;
    const password = req.body.password;
    const passwordConf = req.body["password-confirm"];
    const dob = req.body.dob;

    if (!username || !password) {
        res.status(401).send('Please provide all required fields'); // todo - render webpage
        return;
    }
    if (password !== passwordConf) {
        res.status(401).render('register', {
            'title': 'Register account'
        }); // todo - display error and auto-populate with provided details to prevent user having to resupply these
        return;
    }

    userDao.lookup(username, function(err, u) {
        if (u) {
            res.status(400).send("Error: User " + username + " already exists!"); // todo - render webpage
            return;
        }
        userDao.create(username, email, password, dob);
        res.redirect('/login', {
            'title': 'Log in'
        }); //todo - display message on screen that the account has been created
    });
}

exports.log_in_page = (req, res) => {
    res.render('login', {
        'title': 'Log in'
    });
}

exports.log_in_user = (req, res) => {
    if (req.cookies) {
        res.send("logged in!"); // todo - direct to correct page
    } else {
        res.render("login"); // authentication failed
        //todo - display error on login page
    }
}

exports.logout = (req, res) => {
    res.clearCookie("jwt").status(200).redirect("/"); // todo - display message that user is logged out.
}

exports.home = (req, res) => {
    res.render('home', {
        'title': 'Home'
    });
}
