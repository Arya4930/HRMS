import express from "express";
import "dotenv/config";
import pg from "pg";

import { Pool } from "pg";

const pool = new Pool({
  host: "localhost",
  port: 5432,
  user: "postgres",
  password: "password",
  database: "hrms",
});

const router = express.Router();

// Test route to check if the API is working
router.get("/test", (req, res) => {
    res.status(200).json({ message: "Test route is working!" });
});

// Route to check if the database connection is working
router.get("/test-db", async (req, res) => {
    try {
        await pool.query("SELECT 1");
        res.status(200).json({ message: "Database connection is working!" });
    } catch (error) {
        console.error("Database connection error:", error);
        res.status(500).json({ message: "Database connection failed." });
    }
});

// Route to get total counts of employees, departments and courses
router.get("/stats", async (req, res) => {
    try {
        const employeeCount = await pool.query("SELECT COUNT(*) FROM employees");
        const departmentCount = await pool.query("SELECT COUNT(*) FROM departments");
        const courseCount = await pool.query("SELECT COUNT(*) FROM courses");

        res.status(200).json({
            totalEmployees: parseInt(employeeCount.rows[0].count),
            totalDepartments: parseInt(departmentCount.rows[0].count),
            totalCourses: parseInt(courseCount.rows[0].count),
        });
    } catch (error) {
        console.error("Error fetching stats:", error);
        res.status(500).json({ message: "Internal server error." });
    }
});

export default router;