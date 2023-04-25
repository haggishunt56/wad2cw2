const express = require("express");
const router = express.Router();
const controller = require("../controllers/controllers.js");
const {login} = require('../auth/auth')
const {verify} = require('../auth/auth')

// unprotected pages
router.get("/", controller.landing_page);
router.get("/about", controller.about);

// log in/register
router.get("/register", controller.register_page);
router.post("/register", controller.register_new_user)
router.get("/login", controller.log_in_page);
router.post("/login", login, controller.log_in_user);
router.get("/logout", verify, controller.logout);

// protected pages
router.get("/home", verify, controller.home);

// 404 handler
router.use((req, res) => { 
    res.status(404).render("404");
});

// 500 error handler
router.use((err, req, res, next) => {
    console.error(err);
    res.status(500).render("500");
});

module.exports = router;
