const db = require("nedb");
const bcrypt = require('bcrypt');
const SALT_ROUNDS = 10;

class UserDAO {
    constructor(databaseFilePath) {
        if (databaseFilePath) {
            this.db = new Datastore({
                filename: databaseFilePath,
                autoload: true
            });
        } else {
            this.db = new Datastore();
        }
    }
    // for the demo the password is the bcrypt of the user name
    init() {
        this.db.insert({
            user: 'Peter',
            password: '$2b$10$I82WRFuGghOMjtu3LLZW9OAMrmYOlMZjEEkh.vx.K2MM05iu5hY2C'
        });
        this.db.insert({
            user: 'Ann',
            password: '$2b$10$bnEYkqZM.MhEF/LycycymOeVwkQONq8kuAUGx6G5tF9UtUcaYDs3S'
        });
        return this;
    }
    create(username, password) {
        const that = this;
        bcrypt.hash(password, SALT_ROUNDS).then(function(hash) {
            var entry = {
                user: username,
                password: hash,
            };
            that.db.insert(entry, function (err) {
                if (err) {
                    console.log("Can't insert user: ", username);
                    console.log(err);
                }
            });
        });
    }
    lookup(user, cb) {
        this.db.find({'user': user}, function (err, entries) {
            if (err) {
                return cb(null, null);
            } else {
                if (entries.length == 0) {
                    return cb(null, null);
                }
                return cb(null, entries[0]);
            }
        });
    }
}

const dao = new UserDAO();
dao.init();
module.exports = dao; 