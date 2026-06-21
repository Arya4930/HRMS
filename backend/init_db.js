import "dotenv/config";
import pg from "pg";
import fs from "fs";

const { Pool } = pg;
const pool = new Pool({ connectionString: process.env.DATABASE_URL });

async function init() {
    try {
        console.log("Connecting to the database...");
        const schema = fs.readFileSync("src/lib/schena.sql", "utf8");
        await pool.query(schema);
        console.log("✅ Schema executed successfully! All tables have been created.");
    } catch (err) {
        console.error("❌ Error executing schema:", err);
    } finally {
        await pool.end();
    }
}

init();
