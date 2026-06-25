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

router.get("/dashboard", verifyAuthToken, async (req, res) => {
    try {
        const [summaryResult, departmentDistributionResult, hiringTrendResult, courseCompletionResult, popularCoursesResult, recentActivityResult, trainingCohortsResult] = await Promise.all([
            pool.query(`
                SELECT
                    COUNT(*)::int AS total_employees,
                    (SELECT COUNT(*)::int FROM departments) AS total_departments,
                    (SELECT COUNT(*)::int FROM courses) AS total_courses,
                    COUNT(*) FILTER (WHERE UPPER(COALESCE(status, '')) = 'ACTIVE')::int AS active_employees,
                    COUNT(*) FILTER (WHERE UPPER(COALESCE(status, '')) = 'INACTIVE')::int AS inactive_employees,
                    COUNT(*) FILTER (
                        WHERE UPPER(REPLACE(COALESCE(status, ''), '-', ' ')) IN ('ON LEAVE', 'LEAVE')
                    )::int AS on_leave_employees
                FROM employees
            `),
            pool.query(`
                SELECT
                    d.departmentid,
                    d.departmentname AS department,
                    COALESCE(COUNT(e.emp_id), 0)::int AS employees,
                    COALESCE(d.budget, 0)::numeric AS budget
                FROM departments d
                LEFT JOIN employees e ON e.department_id = d.departmentid
                GROUP BY d.departmentid, d.departmentname, d.budget
                ORDER BY employees DESC, d.departmentname ASC
            `),
            pool.query(`
                WITH months AS (
                    SELECT generate_series(
                        date_trunc('month', CURRENT_DATE) - INTERVAL '11 months',
                        date_trunc('month', CURRENT_DATE),
                        INTERVAL '1 month'
                    ) AS month_start
                )
                SELECT
                    to_char(m.month_start, 'Mon') AS month,
                    COALESCE(COUNT(e.emp_id), 0)::int AS hires
                FROM months m
                LEFT JOIN employees e
                    ON date_trunc('month', e.created_at) = m.month_start
                GROUP BY m.month_start
                ORDER BY m.month_start
            `),
            pool.query(`
                SELECT
                    COALESCE(NULLIF(TRIM(completion_status), ''), 'UNKNOWN') AS name,
                    COUNT(*)::int AS value
                FROM employee_courses
                GROUP BY COALESCE(NULLIF(TRIM(completion_status), ''), 'UNKNOWN')
                ORDER BY CASE UPPER(COALESCE(NULLIF(TRIM(completion_status), ''), 'UNKNOWN'))
                    WHEN 'COMPLETED' THEN 1
                    WHEN 'ONGOING' THEN 2
                    WHEN 'DROPPED' THEN 3
                    ELSE 4
                END
            `),
            pool.query(`
                SELECT
                    c.courseid,
                    c.coursename AS course,
                    COALESCE(COUNT(ec.enrollment_id), 0)::int AS enrollments
                FROM courses c
                LEFT JOIN employee_courses ec ON ec.courseid = c.courseid
                GROUP BY c.courseid, c.coursename
                ORDER BY enrollments DESC, c.coursename ASC
                LIMIT 10
            `),
            pool.query(`
                WITH latest_activities AS (
                    SELECT
                        e.created_at AS activity_time,
                        'employee' AS activity_type,
                        CONCAT_WS(' ', e.first_name, e.last_name) AS primary_label,
                        d.departmentname AS secondary_label,
                        CONCAT(CONCAT_WS(' ', e.first_name, e.last_name), ' joined ', d.departmentname) AS text
                    FROM employees e
                    LEFT JOIN departments d ON d.departmentid = e.department_id

                    UNION ALL

                    SELECT
                        COALESCE(ec.enrollment_date::timestamp, e.created_at) AS activity_time,
                        'enrollment' AS activity_type,
                        CONCAT_WS(' ', e.first_name, e.last_name) AS primary_label,
                        c.coursename AS secondary_label,
                        CONCAT(CONCAT_WS(' ', e.first_name, e.last_name), ' enrolled in ', c.coursename) AS text
                    FROM employee_courses ec
                    INNER JOIN employees e ON e.emp_id = ec.employee_id
                    INNER JOIN courses c ON c.courseid = ec.courseid

                    UNION ALL

                    SELECT
                        c.created_at AS activity_time,
                        'course' AS activity_type,
                        NULL AS primary_label,
                        c.coursename AS secondary_label,
                        CONCAT('New course added: ', c.coursename) AS text
                    FROM courses c

                    UNION ALL

                    SELECT
                        d.createdat AS activity_time,
                        'department' AS activity_type,
                        NULL AS primary_label,
                        d.departmentname AS secondary_label,
                        CONCAT('New department added: ', d.departmentname) AS text
                    FROM departments d
                )
                SELECT activity_time, activity_type, primary_label, secondary_label, text
                FROM latest_activities
                ORDER BY activity_time DESC NULLS LAST
                LIMIT 5
            `),
            pool.query(`
                WITH recent_enrollments AS (
                    SELECT
                        c.courseid,
                        c.coursename AS course,
                        c.courselocation AS location,
                        MAX(ec.enrollment_date) AS last_enrollment_date,
                        COUNT(ec.enrollment_id)::int AS participants
                    FROM courses c
                    LEFT JOIN employee_courses ec ON ec.courseid = c.courseid
                    GROUP BY c.courseid, c.coursename, c.courselocation
                    ORDER BY MAX(ec.enrollment_date) DESC NULLS LAST, participants DESC, c.coursename ASC
                    LIMIT 4
                )
                SELECT * FROM recent_enrollments
                ORDER BY last_enrollment_date DESC NULLS LAST, course ASC
            `),
        ]);

        const summary = summaryResult.rows[0] || {};

        res.status(200).json({
            summary: {
                totalEmployees: summary.total_employees ?? 0,
                totalDepartments: summary.total_departments ?? 0,
                totalCourses: summary.total_courses ?? 0,
                activeEmployees: summary.active_employees ?? 0,
                inactiveEmployees: summary.inactive_employees ?? 0,
                onLeaveEmployees: summary.on_leave_employees ?? 0,
            },
            departmentDistribution: departmentDistributionResult.rows,
            hiringTrend: hiringTrendResult.rows,
            courseCompletionStatus: courseCompletionResult.rows,
            popularCourses: popularCoursesResult.rows,
            activityFeed: recentActivityResult.rows,
            recentTrainingCohorts: trainingCohortsResult.rows,
        });
    } catch (error) {
        console.error("Error fetching dashboard data:", error);
        res.status(500).json({ message: "Internal server error." });
    }
});

export default router;
