const nedb = require("nedb");
const db = new nedb({filename:'trophy.db', autoload:true});

class TrophyDAO {
    constructor() {}
    create(username, achievement, difficulty) {
        var trophy = {
            user: username,
            achievement: achievement,
            difficulty: difficulty,
            dateadded: new Date(Date.now()),
        }
        db.insert(trophy, (err) => {
            if (err) {
                console.log("Can't add trophy: ", trophy.achievement);
                console.log(err);
            }
        });
    }
    getEntriesByUser(username) { // return every trophy for one user
        return new Promise((resolve, reject) => {
            db.find({user: username}, (err, entries) => {
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

module.exports = TrophyDAO; 