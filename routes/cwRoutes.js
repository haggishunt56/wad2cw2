const express = require("express");
const router = express.Router();
const controller = require("../controllers/controllers.js");
const authController = require("../auth/auth")
const {login} = require('../auth/auth')
const {verify} = require('../auth/auth')

router.get("/", controller.landing_page);
router.get("/logintest", verify, (req, res) => {
    console.log(req.user);
    if(req.user) {
        res.send("logged in!");
    } else {
        res.redirect("/login");
    }
});

router.get("/register", controller.register_page);

router.post("/register", controller.register_new_user)

router.get("/login", controller.log_in_page);

router.post("/login", login, (req, res) => {
    console.log("login callback function running...");
    console.log("jwt: " + req.cookies);
    
    if (req.cookies) {
        res.send("logged in!"); // todo - direct to correct page
    } else {
        res.status(401).send("Unauthorized"); // authentication failed
        //todo - send to login page
    }
});

// 404 handler
router.use((req, res) => { 
    res.status(404); 
    res.type('text/plain');
    res.send('404 Not found.'); // todo - render a page
});

// 500 error handler
router.use((err, req, res, next) => {
    console.error(err);
    res.status(500);
    res.type('text/plain'); 
    res.send('Internal Server Error.'); // todo - render a page
});

module.exports = router;
