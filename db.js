const {JsonDatabase,} = require("wio.db");

const db = new JsonDatabase({
    databasePath: "./database/db.json"
});
module.exports = db