var express = require('express');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const {UserList, CreateUser} = require("./Controllers/users");
const cors = require("cors");
const {SignIn} = require("./Controllers/auth");
const bcrypt = require('bcrypt')
const {CreateDevice, DeviceRentList, UpdateDevice, DeleteDevice, DeviceRentById} = require("./Controllers/devices");

const adminRoutes = [
    '/api/device/update',
    '/api/device/delete',
    '/api/device/create',
]

var app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors());
app.use(cookieParser());

app.use(function(req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', '*');
    res.setHeader('Access-Control-Allow-Credentials', true);

    next();
});

var UserInfo;

function authenticateToken(req, res, next) {
    const authHeader = req.headers.authorization;

    if (authHeader) {
        const token = authHeader.split(' ')[1];
        jwt.verify(token, process.env.TOKEN_SECRET, (err, user) => {
            if (err) {
                return res.json({errorCode : 403, errorMsg: err});
            }

            // simple middleware
            if(adminRoutes.some(x => x === req.path) && user.role === 0){
                return res.json({errorCode : 403, errorMsg: "Forbidden!"});
            }
            req.user = user;
            UserInfo = user;
            next();
        });
    } else {
        return res.json({errorCode : 401, errorMsg: "Unauthorized!"});
    }
}

// HELPER! password hash only
app.post('/api/register', function (req, res, next){
    const {userName, password} = req.body;
    bcrypt.genSalt(10, function(err, salt) {
        bcrypt.hash(password,salt, function(err, hash) {
            res.json({
                "userName" : userName,
                "password" : hash
            });
        });
    });
});


app.post('/api/auth', SignIn);

app.get('/api/user/list',authenticateToken, UserList);

app.post('/api/device/create',authenticateToken, CreateDevice);
app.put('/api/device/update',authenticateToken,UpdateDevice);
app.get('/api/device',authenticateToken, DeviceRentById);
app.delete('/api/device/delete',authenticateToken, DeleteDevice);
app.get('/api/device/list',authenticateToken, DeviceRentList);


module.exports = app;
