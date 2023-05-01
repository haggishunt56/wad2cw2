const express = require("express");
const router = express.Router();
const controller = require("../controllers/controllers.js");
const {login} = require('../auth/auth');
const {verify} = require('../auth/auth');

// unprotected pages
router.get("/", controller.landing_page);
router.get("/about", controller.about);

// log in/register
router.get("/register", controller.register_page);
router.post("/register", controller.register_new_user)
router.get("/login", controller.log_in_page);
router.post("/login", login, controller.log_in_user);
router.get("/logout", verify, controller.logout);

// home page
router.get("/home", verify, controller.home);

// goals
router.get("/goals", verify, controller.viewgoals);
router.get("/goals/add", verify, controller.addgoalpage);
router.post("/goals/add", verify, controller.addgoal);
router.get("/goals/:id", verify, controller.goaldetails);
router.post("/goals/:id", verify, controller.editgoal);

// guides
router.get("/guides", verify, controller.guides)
router.get("/guides/fitness", verify, controller.fitnessguide);
router.get("/guides/lifestyle", verify, controller.lifestyleguide);
router.get("/guides/nutrition", verify, controller.nutritionguide);

// trophies - todo
router.get("/trophies", verify, controller.trophy);
router.get("/trophies/add-achievement", verify, controller.achievement);
router.post("/trophies/add-achievement", verify, controller.addachievement);

// clear database - for debugging
router.get("/purge", verify, controller.purgeGoals);
// get all goals - for debugging
router.get("/goals/all", verify, controller.getAllGoals)

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
