const nedb = require("nedb");

class GoalDAO {
    constructor() {
        try {
            this.db = new nedb({filename:'../goal.db', autoload:true});
        } catch(err) {
            console.log(err)
        }
    }
    create(username, goalname, targetdate, category, description) {
        var goal = {
            user: username,
            name: goalname,
            target: targetdate,
            category: category,
            description: description,
            dateadded: new Date(Date.now()),
            completed: false,
        }
        this.db.insert(goal, (err) => {
            if (err) {
                console.log("Can't insert goal: ", goal.name);
                console.log(err);
            }
        });
    }
    getAllEntries() { // return every goal in the database
        return new Promise((resolve, reject) => {
            this.db.find({}, function(err, entries) {
                // if error occurs, print to console and reject Promise
                if (err) {
                    console.log(err);
                    reject(err);
                // if no error, return the data
                } else {
                    resolve(entries);
                }
            })
        })
    }
    getEntriesByUser(username) { // return every goal for one user
        return new Promise((resolve, reject) => {
            this.db.find({user: username}, function(err, entries) {
                // if error occurs, print to console and reject promise
                if (err) {
                    console.log(err);
                    reject(err);
                // if no error, return the data
                } else {
                    resolve(entries);
                }
            })
        })
    }
    removeAll() {
        return new Promise((resolve, reject) => {
            this.db.remove({}, {multi: true}, (err, numRemoved) => {
                if (err) {
                    reject(err);
                } else {
                    console.log(numRemoved);
                    resolve(numRemoved);
                }
            });
        });
    }
}

module.exports = GoalDAO; 