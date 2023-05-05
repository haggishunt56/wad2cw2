const nedb = require("nedb");
const db = new nedb({filename: path.join(__dirname, 'goal.db'), autoload:true});

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
        /*
            This db query sorts entries on the target date ascending. Meaning, dates furthest in
            the future will be at the end of the list. It then strips out all but the first 5
            entries. These are the next goals due for the user, although dates may be in the past
            depending when they were created.
            However, "30/01/2023" appears later in the list than "01/05/2023". This is because
            target dates in goal.db are Strings, not Date objects. In a future iteration, this
            should be fixed.
            todo - fix target date field (suggest use MomentJS library to create dates).
        */
        return new Promise((resolve, reject) => {
            db.find({user: username}).sort({target: 1}).limit(5).exec(function(err, entries) {
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
                console.log("Can't update goal: ", goalname);
                reject(err);
            }
        });
    }
    deleteEntry(id) {
        return new Promise((resolve, reject) => {
            db.remove({ _id: id }, {}, function (err, numRemoved) {
                if (err) {
                    reject(err);
                } else {
                    console.log(numRemoved + ' records removed');
                    resolve(numRemoved);
                }
            });
        });
    }
    removeAll() {
        return new Promise((resolve, reject) => {
            db.remove({}, {multi: true}, (err, numRemoved) => {
                if (err) {
                    reject(err);
                } else {
                    console.log(numRemoved + ' records removed');
                    resolve(numRemoved);
                }
            });
        });
    }
}

module.exports = GoalDAO; 