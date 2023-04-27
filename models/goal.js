const nedb = require("nedb");

class GoalDAO {
    constructor() {
        try {
            this.db = new nedb({filename:'../goal.db', autoload:true});
        } catch(err) {
            console.log(err)
        }
    }
    create(goalname, targetdate, category, description) {
        var goal = {
            name: goalname,
            target: targetdate,
            category: category,
            description: description,
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
}

module.exports = GoalDAO; 