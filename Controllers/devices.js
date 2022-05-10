const sqlite3 = require("sqlite3");
const appRoot = require("app-root-path");
const {getTimestamp} = require("../Modules/timestamp");

const db = new sqlite3.Database(appRoot + '/mobilfox.db');


/* Create a new device */
exports.CreateDevice = function (req, res, next) {
    let {deviceName,deviceValue, purchaseDate, currentOwner,endDate, deviceId, lastModifier } = req.body;
    let errorList = [];
    !deviceName ?  errorList.push("deviceName is required!") : "";
    !purchaseDate ?  errorList.push("purchaseDate is required!") : "";
    !deviceValue ?  errorList.push("deviceValue is required!") : "";
    !currentOwner ?  errorList.push("currentOwner is required!") : "";
    !endDate ?  errorList.push("endDate is required!") : "";
    !lastModifier ?  errorList.push("lastModifier is required!") : "";

    console.log(req.body);

    let end_date =  endDate.year + '-' + ('0' + endDate.month).slice(-2) + '-' + ('0' + (endDate.day)).slice(-2);

    let purchase_date = purchaseDate.year + '-' + ('0' + purchaseDate.month).slice(-2) + '-' + ('0' + (purchaseDate.day)).slice(-2);

    if (errorList.length > 0) {
        res.status(400).json({"error": errorList});
    } else {

        db.run("insert into devices (device_name, device_value, purchase_date, current_owner,end_date, last_modifier,last_modify) " +
            "values(?,?,?,?,?,?,?)", [deviceName, deviceValue, purchase_date,currentOwner,end_date,currentOwner, getTimestamp()], (err) => {
            if (err) {
                res.status(400).json({"error": err.message});
            } else {
                res.status(200).json(req.body);
            }
        });


    }

}

/* update device */
exports.UpdateDevice = function (req, res, next) {
    let {deviceName,deviceValue, purchaseDate, currentOwner,endDate, deviceId, lastModifier } = req.body;
    let errorList = [];
    !deviceId ?  errorList.push("deviceId is required!") : "";
    !deviceName ?  errorList.push("deviceName is required!") : "";
    !purchaseDate ?  errorList.push("purchaseDate is required!") : "";
    !deviceValue ?  errorList.push("deviceValue is required!") : "";
    !currentOwner ?  errorList.push("currentOwner is required!") : "";
    !endDate ?  errorList.push("endDate is required!") : "";
    !lastModifier ?  errorList.push("lastModifier is required!") : "";


    let end_date =  endDate.year + '-' + ('0' + endDate.month).slice(-2) + '-' + ('0' + (endDate.day)).slice(-2);

    let purchase_date = purchaseDate.year + '-' + ('0' + purchaseDate.month).slice(-2) + '-' + ('0' + (purchaseDate.day)).slice(-2);

    if (errorList.length > 0) {
        res.status(400).json({"error": errorList});
    } else {

        db.run("update devices set device_name = ?, device_value = ?, purchase_date = ?, current_owner = ?,end_date =?, last_modifier = ?,last_modify =? " +
            "where device_id = ?", [deviceName, deviceValue, purchase_date,currentOwner,end_date,lastModifier, getTimestamp(),deviceId], (err) => {
            if (err) {
                res.status(400).json({"error": err.message});
            } else {
                res.status(200).json(req.body);
            }
        });


    }

}

/* delete device */
exports.DeleteDevice = function (req, res, next) {

    let errorList = [];
    !req.query.device_id ?  errorList.push("device_id is required!") : "";

    if (errorList.length > 0) {
        res.status(400).json({"error": errorList});
    } else {

        db.run("delete from devices where device_id = ?", [parseInt(req.query.device_id)], (err) => {
            if (err) {
                res.status(400).json({"error": err.message});
            } else {
                res.status(200).json({"message" : "Deleted successfully!"});
            }
        });


    }

}


/* GET devices listing. */
exports.DeviceRentList = function(req, res, next) {
    db.all("Select *, " +
        "(select user_name from users where user_id = devices.current_owner) as current_owner_plain, " +
        "(select user_name from users where user_id = devices.last_modifier) as last_mofifier_plain from devices order by device_id desc", [], (err, rows) => {
        if (err) {
            res.status(400).json({"error":err.message});
        }else{
            res.json(rows)
        }
    });
};

/* GET device by id listing. */
exports.DeviceRentById = function(req, res, next) {

    let filter = "1 = 1";

    if(req.query.device_id){
        filter = ` where device_id =  ${req.query.device_id} `
    }

    db.all("Select *, " +
        "(select user_name from users where user_id = devices.current_owner) as current_owner_plain, " +
        "(select user_name from users where user_id = devices.last_modifier) as last_mofifier_plain from " +
        "devices "+ filter +" order by device_id desc", [], (err, rows) => {
        if (err) {
            res.status(400).json({"error":err.message});
        }else{
            res.json(rows)
        }
    });
};

