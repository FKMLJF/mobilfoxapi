const sqlite3 = require("sqlite3");
const appRoot = require("app-root-path");
const db = new sqlite3.Database(appRoot + '/mobilfox.db');

/* GET users listing. */
exports.UserList = function(req, res, next) {
  db.all("Select user_id, user_name, role from users order by user_id desc", [], (err, rows) => {
    if (err) {
      res.status(400).json({"error":err.message});
    }else{
      res.json(rows)
    }
  });
};

