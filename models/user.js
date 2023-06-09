const nedb = require("nedb");
const bcrypt = require('bcrypt');
const SALT_ROUNDS = 10;
const path = require('path');

class UserDAO {
    constructor() {
        try {
            this.db = new nedb({filename: path.join(__dirname, 'users.db'), autoload:true});
        } catch(err) {
            console.log(err)
        }
    }
    create(username, email, password) {
        const that = this;
        bcrypt.hash(password, SALT_ROUNDS).then(function(hash) {
            var entry = {
                user: username,
                email: email,
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
module.exports = dao; 