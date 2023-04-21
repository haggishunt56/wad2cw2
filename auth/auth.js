const bcrypt = require('bcrypt');
const userModel = require('../models/user');
const jwt = require("jsonwebtoken");

exports.login = function (req, res, next) {
    let username = req.body.username;
    let password = req.body.password;
    console.log("working...");

    userModel.lookup(username, function (err, user) {
        if (err) {
            console.log("error looking up user", err);
            return res.status(500).send();
        }
        if (!user) {
            console.log('Incorrect username or password.');
            return res.status(401).send();
        }
        //compare provided password with stored password
        bcrypt.compare(password, user.password, function (err, result) {
            if (result) {
                let payload = { username: user.username };
                let accessToken = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET);
                res.cookie("jwt", accessToken);
                
                //and then pass onto the next middleware
                next();
            } else {
                return res.status(403).send();
            }
        });
    });
    next()
}

// this function is used to protect certain routes. User must be logged in to access them
exports.verify = function (req, res, next) {
    let accessToken = req.cookies.jwt;
    if (!accessToken) {
        return res.status(403).send();
    }
    let payload;
    try {
        payload = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET);
        next();
    } catch (e) {
        //if an error occurred return request unauthorized error
        res.status(401).send();
    }
};
