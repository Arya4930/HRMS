import "dotenv/config";
import pg from "pg";
import fs from "fs";

import { Pool } from "pg";

const pool = new Pool({
  host: "localhost",
  port: 5432,
  user: "postgres",
  password: "password",
  database: "hrms",
});

async function init() {
    try {
        console.log("Connecting to the database...");
        const schema = fs.readFileSync("./src/lib/schema.sql", "utf8");
        await pool.query(schema);
        console.log("✅ Schema executed successfully! All tables have been created.");
    } catch (err) {
        console.error("❌ Error executing schema:", err);
    } finally {
        await pool.end();
    }
}

init();
