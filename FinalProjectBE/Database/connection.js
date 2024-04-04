const pg = require("pg");
const dotenv = require("dotenv");
dotenv.config();

const connectionString = "postgres://yosra:yosra123@localhost:5432/maindb";

const db = new pg.Pool({ connectionString });
module.exports = db;
