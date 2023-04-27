const userDao = require('../models/user.js');
const goalDao = require('../models/goal');
const jwt_decode = require("jwt-decode");

const db = new goalDao();

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
        userDao.create(username, email, password);
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
    console.log(req.body);
    if (req.cookies) {
        res.render("home", {
            user: req.body.username
        });
    } else {
        res.render("login"); // authentication failed
        //todo - display error on login page
    }
}

exports.logout = (req, res) => {
    res.clearCookie("jwt").status(200).redirect("/"); // todo - display message that user is logged out.
}

exports.home = (req, res) => {
    const token = req.cookies.jwt;
    const decoded_token = jwt_decode(
        token.slice(
            0,
            token.indexOf(
                ".",
                token.indexOf(
                    ".",
                    0
                )+1
            )
        )
    ); // jwt_decode is unable to decode the last section of the token. It is removed by the slice() method to allow the remainder to be decoded.
    res.render('home', {
        'user': decoded_token.username
    });
}

exports.viewgoals = (req, res) => {
    db.getAllEntries()
        .then((entries) => {
            console.log(entries);
            res.render("goals/viewGoals", {
                title: "Goals",
                goals: entries,
            });
        })
        .catch((err) => {
            console.log("promise rejected", err);
        });
}

exports.addgoalpage = (req, res) => {
    res.render("goals/addGoal", {
        'title': 'Add a goal'
    });
}

exports.addgoal = (req, res) => {
    const goalname = req.body.goalname;
    const targetdate = req.body.targetdate;
    const category = req.body.category;
    const description = req.body.description;

    // todo - field validation

    db.create(goalname, targetdate, category, description);
    res.redirect('/goals', {
        'title': 'Goals'
    }); //todo - display message on screen that the goal has been created
}