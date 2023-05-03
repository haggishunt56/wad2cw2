const nedb = require("nedb");
const db = new nedb({filename:'../goal.db', autoload:true});

class GoalDAO {
    constructor() {}
    create(username, goalname, targetdate, category, description) {
        var goal = {
            user: username,
            name: goalname,
            target: targetdate,
            category: category,
            description: description,
            dateadded: new Date(Date.now()),
            dateCompleted: '',
            completed: false,
        }
        db.insert(goal, (err) => {
            if (err) {
                console.log("Can't insert goal: ", goal.name);
                console.log(err);
            }
        });
    }
    getEntry(id) { //return details of one goal
        return new Promise((resolve, reject) => {
            db.find({_id: id}, function(err, doc) {
                // if error occurs, print to console and reject Promise
                if (err) {
                    console.log(err);
                    reject(err);
                // if no error, return the data
                } else {
                    resolve(doc);
                }
            })
        })
    }
    getAllEntries() { // return every goal in the database
        return new Promise((resolve, reject) => {
            db.find({}, function(err, entries) {
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
            db.find({user: username}, function(err, entries) {
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
    getNext5Goals(username) {
        return new Promise((resolve, reject) => {
            db.find({user: username}).sort({targetdate: 1}).limit(5).exec(function(err, entries) {
                // if error occurs, print to console and reject promise
                if (err) {
                    console.log(err);
                    reject(err);
                // if no error, return the data
                } else {
                    resolve(entries);
                }
            });
        });
    }
    edit(id, goalname, targetdate, category, description, completiondate, completed) {
        db.update({ _id: id }, { $set: {
            name: goalname,
            target: targetdate,
            category: category,
            description: description,
            dateCompleted: completiondate,
            completed: completed
        } }, { multi: true }, function (err, numReplaced) {
            if (err) {
                console.log("Can't insert goal: ", goalname);
                reject(err);
            }
        });
    }
    removeAll() {
        return new Promise((resolve, reject) => {
            db.remove({}, {multi: true}, (err, numRemoved) => {
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