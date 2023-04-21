const express = require("express");
const router = express.Router();
const controller = require("../controllers/controllers.js");

router.get("/", controller.landing_page);

router.get("/register", controller.register);

router.get("/signin", controller.sign_in);

// router.get("/guestbook", controller.entries_list);

// router.get("/new", controller.new_entry);

// router.get("/about", controller.about_page);

router.use(controller.notFound);

router.use(controller.serverError);

module.exports = router;
