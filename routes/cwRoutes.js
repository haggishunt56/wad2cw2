const express = require("express");
const router = express.Router();
const controller = require("../controllers/controllers.js");
const {login, verify} = require('../auth/auth')

router.get("/", controller.landing_page);
router.get("/logintest", verify, (req, res) => {
    res.send("logged in!");
});

// TODO - auth routes and controllers in separate docs
router.get("/register", controller.register_page);

router.post("/register", controller.register_new_user)

router.get("/login", controller.log_in_page);

router.post("/login", login, controller.log_in_submit);

router.use(controller.notFound);

router.use(controller.serverError);

module.exports = router;
