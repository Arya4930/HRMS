import "dotenv/config";
import pg from "pg";
import fs from "fs";
import { createUser } from "./src/lib/models/user.js";

import { Pool } from "pg";

export const pool = new Pool({
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
        await createUser({
            userid: "admin",
            name: "Admin User",
            email: "admin@example.com",
            password: "admin",
        });
        console.log("✅ Schema executed successfully! All tables have been created.");
    } catch (err) {
        console.error("❌ Error executing schema:", err);
    } finally {
        await pool.end();
    }
}

init();
