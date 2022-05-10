const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const appRoot = require('app-root-path');
const sqlite3 = require("sqlite3");
const {getTimestamp} = require("../Modules/timestamp");
const db = new sqlite3.Database(appRoot + '/mobilfox.db');
require("dotenv").config();

exports.SignIn = function (req, response, next) {
    const {userName, password} = req.body;

    db.all("Select user_id, user_name, role, password from users where user_name = ? order by user_id desc", [userName], (err, rows) => {
        if (err) {
            response.status(400).json({"error": err.message});
            return;
        } else {
            if (rows.length == 1) {
                bcrypt.compare(password, rows[0].password, function (err, res) {
                    if (res) {
                        const token = jwt.sign({authName: userName, role: rows[0].role}, process.env.TOKEN_SECRET, {
                            expiresIn: process.env.JWT_EXPIRATION || '31d'
                        });
                        response.json({
                            user_id : rows[0].user_id,
                            user_name : rows[0].user_name,
                            role : rows[0].role,
                            token: token,
                        })
                    } else {
                        console.log(rows);
                        response.status(401).json({"error": "Invalid username or password!"});
                    }
                })
            } else {
                console.log(rows);
                response.status(401).json({"error": "Invalid username or password!"});
            }
        }
    });
};


