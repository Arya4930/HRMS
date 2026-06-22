import express from "express";
import "dotenv/config";
import pg from "pg";

import { Pool } from "pg"
import { createAuthToken, verifyAuthToken } from "../middleware.js";
import { createUser, findUserByEmail, isPasswordCorrect, sanitizeUser } from "../lib/models/user.js";

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

router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ success: false, message: "Email and password are required." });
        }

        const user = await findUserByEmail(email);
        if (!user) {
            return res.status(401).json({ success: false, message: "Invalid email or password." });
        }

        const passwordMatches = await isPasswordCorrect(password, user.password);
        if (!passwordMatches) {
            return res.status(401).json({ success: false, message: "Invalid email or password." });
        }

        const accessToken = createAuthToken(user);

        return res.status(200).json({
            success: true,
            message: "User logged in successfully.",
            data: {
                user: sanitizeUser(user),
                accessToken,
            },
        });
    } catch (error) {
        console.error("Login error:", error);
        return res.status(500).json({ success: false, message: "Server error." });
    }
});

router.post("/register", verifyAuthToken, async (req, res) => {
    try {
        const { userid, name, email, password } = req.body;

        if (!userid || !name || !email || !password) {
            return res.status(400).json({ success: false, message: "User ID, name, email, and password are required." });
        }

        if (password.length < 6) {
            return res.status(400).json({ success: false, message: "Password must be at least 6 characters." });
        }

        const existingUser = await findUserByEmail(email);
        if (existingUser) {
            return res.status(409).json({ success: false, message: "A user with this email already exists." });
        }

        const user = await createUser({ userid, name, email, password });

        return res.status(201).json({
            success: true,
            message: "Admin registered successfully.",
            data: { user },
        });
    } catch (error) {
        if (error.code === "23505") {
            return res.status(409).json({ success: false, message: "User ID or email already exists." });
        }

        console.error("Register error:", error);
        return res.status(500).json({ success: false, message: "Server error." });
    }
});

router.get("/me", verifyAuthToken, (req, res) => {
    res.status(200).json({ success: true, user: req.user });
});

// Route to get total counts of employees, departments and courses
router.get("/stats", verifyAuthToken, async (req, res) => {
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
