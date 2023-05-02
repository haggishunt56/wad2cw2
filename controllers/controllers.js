const userDao = require('../models/user.js');
const goalDao = require('../models/goal.js');
const trophyDao = require('../models/trophy.js');
const jwt_decode = require("jwt-decode");

const goalDB = new goalDao();
const trophyDB = new trophyDao();

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

    // if any field is not supplied, display page again with an error.
    // username and email fields pre-populated. email address must be re-entered.
    if (!username || !email || !password || !passwordConf) {
        res.status(401).render("register", {
            title: 'Register account',
            err: "Please provide all required fields.",
            username: username,
            email: email
        });
        return;
    }

    // if passwords do not match, display page again with an error
    if (password !== passwordConf) {
        res.status(401).render("register", {
            title: 'Register account',
            err: "Passwords do not match. Please re-enter.",
            username: username,
            email: email
        });
        return;
    }

    // todo - password validation (8 chars min, 1 LC letter, 1 UC letter & 1 number)
    // todo email address validation

    userDao.lookup(username, function(err, u) {
        // if user exists, display error
        if (u) {
            res.status(401).render("register", {
                title: 'Register account',
                err: "User '" + username + "' already exists. Please <a href=\"/login\">log in</a> instead.",
                username: username,
                email: email
            });
            return;
        }

        // once all validation passed, create user and display confirmation on login page
        userDao.create(username, email, password);
        res.status(200).render("login", {
            confirmation: "User '" + username + "' created. Please log in using the supplied username and password:"
        });
    });
}

exports.log_in_page = (req, res) => {
    res.render('login', {
        'title': 'Log in'
    });
}

exports.log_in_user = (req, res) => {
    if (req.cookies) {
        res.render("home", {
            user: req.body.username
        });
    } else {
        // authentication failed
        res.status(401).render("login", {
            err: "Incorrect username or password. Please try again."
        });
    }
}

exports.logout = (req, res) => {
    res.clearCookie("jwt").status(200).render("landing", {
        title: "Home",
        confirmation: "Successfully logged out."
    });
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
    );
    const user = decoded_token.username;

    goalDB.getEntriesByUser(user)
        .then((entries) => {
            let i = 0;
            for (entry of entries) { // Mustache can't format dates - dates must be formatted in JS before render
                // entry.dateadded = entry.dateadded.toLocaleDateString('en-GB'); // doesn't work - refuses to format as en-GB and always defaults fo en-US.
                // pad function obtained from StackOverflow as a workaround for toLocaleDateString() not working
                //source: https://stackoverflow.com/questions/22719346/tolocaledatestring-is-not-returning-dd-mm-yyyy-format
                function pad(n) {return n < 10 ? "0"+n : n;}
                entry.dateadded = pad(entry.dateadded.getDate())+"/"+pad(entry.dateadded.getMonth()+1)+"/"+entry.dateadded.getFullYear();
                if (entry.datecompleted) {
                    entry.datecompleted = pad(entry.datecompleted.getDate())+"/"+pad(entry.datecompleted.getMonth()+1)+"/"+entry.dateadded.getFullYear();
                }
                entries[i] = entry;
                i++;
            }
            const goalsExist = entries.length>0 ? true : false;
            res.render("goals/viewGoals", {
                title: "Goals",
                goalsExist: goalsExist,
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
    );
    const user = decoded_token.username;
    const goalname = req.body.goalname;
    const targetdate = req.body.targetdate;
    const category = req.body.category;
    const description = req.body.description;
    // todo - field validation

    // create goal in database
    goalDB.create(user, goalname, targetdate, category, description);

    // find all goals and display goals page with confirmation
    goalDB.getEntriesByUser(user)
        .then((entries) => {
            let i = 0;
            for (entry of entries) { // Mustache can't format dates - dates must be formatted in JS before render
                // entry.dateadded = entry.dateadded.toLocaleDateString('en-GB'); // doesn't work - refuses to format as en-GB and always defaults fo en-US.
                // pad function obtained from StackOverflow as a workaround for toLocaleDateString() not working
                //source: https://stackoverflow.com/questions/22719346/tolocaledatestring-is-not-returning-dd-mm-yyyy-format
                function pad(n) {return n < 10 ? "0"+n : n;}
                entry.dateadded = pad(entry.dateadded.getDate())+"/"+pad(entry.dateadded.getMonth()+1)+"/"+entry.dateadded.getFullYear();
                if (entry.datecompleted) {
                    entry.datecompleted = pad(entry.datecompleted.getDate())+"/"+pad(entry.datecompleted.getMonth()+1)+"/"+entry.dateadded.getFullYear();
                }
                entries[i] = entry;
                i++;
            }
            const goalsExist = entries.length>0 ? true : false;
            res.render("goals/viewGoals", {
                title: "Goals",
                confirmation: "Goal added!",
                goalsExist: goalsExist,
                goals: entries,
            });
        })
        .catch((err) => {
            console.log("promise rejected", err);
        });
}

exports.goaldetails = (req, res) => {
    const id = req.params.id;
    // get goal details
    goalDB.getEntry(id)
        .then((entry) => {
            res.render("goals/editGoal", {
                "title": "Edit goal",
                "goal": entry[0]
            });
    });
}

exports.editgoal = (req, res) => {
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
    );
    const user = decoded_token.username;
    const id = req.params.id;
    const goalname = req.body.goalname;
    const targetdate = req.body.targetdate;
    const category = req.body.category;
    const description = req.body.description;
    const completiondate = req.body.completiondate;
    const completed = req.body.goalcomplete ? true : false;
    // todo - field validation

    // update goal
    goalDB.edit(id, goalname, targetdate, category, description, completiondate, completed)
    
    // find all goals and display goals page with confirmation
    goalDB.getEntriesByUser(user)
    .then((entries) => {
        let i = 0;
        for (entry of entries) { // Mustache can't format dates - dates must be formatted in JS before render
            // entry.dateadded = entry.dateadded.toLocaleDateString('en-GB'); // doesn't work - refuses to format as en-GB and always defaults fo en-US.
            // pad function obtained from StackOverflow as a workaround for toLocaleDateString() not working
            //source: https://stackoverflow.com/questions/22719346/tolocaledatestring-is-not-returning-dd-mm-yyyy-format
            function pad(n) {return n < 10 ? "0"+n : n;}
            entry.dateadded = pad(entry.dateadded.getDate())+"/"+pad(entry.dateadded.getMonth()+1)+"/"+entry.dateadded.getFullYear();
            if (entry.datecompleted) {
                entry.datecompleted = pad(entry.datecompleted.getDate())+"/"+pad(entry.datecompleted.getMonth()+1)+"/"+entry.dateadded.getFullYear();
            }
            entries[i] = entry;
            i++;
        }
        const goalsExist = entries.length>0 ? true : false;
        res.render("goals/viewGoals", {
            title: "Goals",
            confirmation: "Goal updated!",
            goalsExist: goalsExist,
            goals: entries,
        });
    })
    .catch((err) => {
        console.log("promise rejected", err);
    });
}

exports.guides = (req, res) => {
    res.render('guides/guides', {
        'title': 'Guides'
    })
}

exports.fitnessguide = (req, res) => {
    res.render('guides/fitness', {
        'title': 'Fitness guide'
    });
}

exports.nutritionguide = (req, res) => {
    res.render('guides/nutrition', {
        'title': 'Nutrition guide'
    });
}

exports.lifestyleguide = (req, res) => {
    res.render('guides/lifestyle', {
        'title': 'Lifestyle guide'
    });
}

exports.trophy = (req, res) => {
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
    );
    const user = decoded_token.username;
    
    trophyDB.getEntriesByUser(user)
        .then((entries) => {
            let i = 0;
            for (entry of entries) { // Mustache can't format dates - dates must be formatted in JS before render
                // entry.dateadded = entry.dateadded.toLocaleDateString('en-GB'); // doesn't work - refuses to format as en-GB and always defaults fo en-US.
                // pad function obtained from StackOverflow as a workaround for toLocaleDateString() not working
                //source: https://stackoverflow.com/questions/22719346/tolocaledatestring-is-not-returning-dd-mm-yyyy-format
                function pad(n) {return n < 10 ? "0"+n : n;}
                entry.dateadded = pad(entry.dateadded.getDate())+"/"+pad(entry.dateadded.getMonth()+1)+"/"+entry.dateadded.getFullYear();
                if (entry.datecompleted) {
                    entry.datecompleted = pad(entry.datecompleted.getDate())+"/"+pad(entry.datecompleted.getMonth()+1)+"/"+entry.dateadded.getFullYear();
                }

                // determine difficulty of achievement. Moustache cannot perform logic test other than true/false.
                // recommend use of another templating engine such as Nunjucks.
                if (entry.difficulty === 'hard') {
                    entry.hard = true;
                } else if (entry.difficulty === 'medium') {
                    entry.medium = true;
                } else {
                    entry.easy = true;
                }

                entries[i] = entry;
                i++;
            }
            const trophiesExist = entries.length>0 ? true : false;
            
            res.render("trophies/trophies", {
                title: "Trophy cabinet",
                trophies: entries,
                trophiesExist: trophiesExist
            });
        });
}

exports.achievement = (req, res) => {
    res.render("trophies/addachievement", {
        "title": "Add an achievement"
    });
}

exports.addachievement = (req, res) => {
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
    );
    const user = decoded_token.username;
    const achievement = req.body.achievement;
    const difficulty = req.body.difficulty;
    // todo - field validation

    trophyDB.create(user, achievement, difficulty);
    
    trophyDB.getEntriesByUser(user)
        .then((entries) => {
            let i = 0;
            for (entry of entries) { // Mustache can't format dates - dates must be formatted in JS before render
                // entry.dateadded = entry.dateadded.toLocaleDateString('en-GB'); // doesn't work - refuses to format as en-GB and always defaults fo en-US.
                // pad function obtained from StackOverflow as a workaround for toLocaleDateString() not working
                //source: https://stackoverflow.com/questions/22719346/tolocaledatestring-is-not-returning-dd-mm-yyyy-format
                function pad(n) {return n < 10 ? "0"+n : n;}
                entry.dateadded = pad(entry.dateadded.getDate())+"/"+pad(entry.dateadded.getMonth()+1)+"/"+entry.dateadded.getFullYear();
                if (entry.datecompleted) {
                    entry.datecompleted = pad(entry.datecompleted.getDate())+"/"+pad(entry.datecompleted.getMonth()+1)+"/"+entry.dateadded.getFullYear();
                }

                // determine difficulty of achievement. Moustache cannot perform logic test other than true/false.
                // recommend use of another templating engine such as Nunjucks.
                if (entry.difficulty === 'hard') {
                    entry.hard = true;
                } else if (entry.difficulty === 'medium') {
                    entry.medium = true;
                } else {
                    entry.easy = true;
                }

                entries[i] = entry;
                i++;
            }
            const trophiesExist = entries.length>0 ? true : false;
            
            res.render("trophies/trophies", {
                title: "Trophy cabinet",
                confirmation: "Achievement added!",
                trophies: entries,
                trophiesExist: trophiesExist
            });
        });
}

// debugging - to be deleted
exports.purgeGoals = (req, res) => {
    const goalDB = new goalDao();
    const trophyDB = new trophyDao();
    function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
    goalDB.removeAll();
    trophyDB.removeAll();
    res.render('home');
}
exports.getAllGoals = (req, res) => {
    goalDB.getAllEntries()
        .then((entries) => {
            let i = 0;
            for (entry of entries) { // Mustache can't format dates - dates must be formatted in JS before render
                // entry.dateadded = entry.dateadded.toLocaleDateString('en-GB'); // doesn't work - refuses to format as en-GB and always defaults fo en-US.
                // pad function obtained from StackOverflow as a workaround for toLocaleDateString() not working
                //source: https://stackoverflow.com/questions/22719346/tolocaledatestring-is-not-returning-dd-mm-yyyy-format
                function pad(n) {return n < 10 ? "0"+n : n;}
                entry.dateadded = pad(entry.dateadded.getDate())+"/"+pad(entry.dateadded.getMonth()+1)+"/"+entry.dateadded.getFullYear();
                if (entry.datecompleted) {
                    entry.datecompleted = pad(entry.datecompleted.getDate())+"/"+pad(entry.datecompleted.getMonth()+1)+"/"+entry.dateadded.getFullYear();
                }
                entries[i] = entry;
                i++;
            }
            const goalsExist = entries.length>0 ? true : false;
            res.render("goals/viewGoals", {
                title: "Goals",
                goalsExist: goalsExist,
                goals: entries,
            });
        })
        .catch((err) => {
            console.log("promise rejected", err);
        });
}