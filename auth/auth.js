const bcrypt = require('bcrypt');
const userModel = require('../models/user');
const jwt = require("jsonwebtoken");

// provide user with an access token if they supply the correct login credentials.
exports.login = function (req, res, next) {
    let username = req.body.username;
    let password = req.body.password;

    userModel.lookup(username, function (err, user) {
        if (err) {
            console.log("error looking up user", err);
            return res.status(500).send();
        } else if (!user) {
            console.log('Incorrect username or password.');
            return res.status(401).send(); // todo - res.render("register")?
        } else {
            // compare provided password with stored password
            bcrypt.compare(password, user.password, function (err, result) {
                if (result) {
                    let payload = { username: username };
                    let accessToken = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET);
                    res.cookie("jwt", accessToken);

                    // pass to the callback function
                    next();
                } else {
                    return res.render("login"); // todo - display message on page
                }
            });
        }
    });
}

// this function is used to protect certain routes. If user is not logged in they are redirected to login screen.
exports.verify = function (req, res, next) {
    const accessToken = req.cookies ? req.cookies.jwt : null; // if req.cookies doesn't exist, setting req.cookies.jwt causes an error.
    if (!accessToken) {
        return res.redirect("login");
    }
    try {
        const payload = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET);
        console.log("payload:")
        console.log(payload)
        next();
    } catch (e) {
        //if an error occurred return request unauthorized error
        res.status(401).send();
    }
};
