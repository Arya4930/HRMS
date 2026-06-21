import express from "express";
import "dotenv/config";
import pg from "pg";

const { Pool } = pg;
const pool = new Pool({ connectionString: process.env.DATABASE_URL });

const router = express.Router();

router.get("/", async (req, res) => {
    let { page = 1, limit = 10 } = req.query;
    page = parseInt(page);
    limit = parseInt(limit);
    const offset = (page - 1) * limit;

    try {
        const result = await pool.query(
            "SELECT * FROM courses ORDER BY course_id LIMIT $1 OFFSET $2",
            [limit, offset]
        );
        res.status(200).json(result.rows);
    } catch (error) {
        console.error("Error fetching courses:", error);
        res.status(500).json({ message: "Internal server error." });
    }
})

router.get("/:id", async (req, res) => {
    const { id } = req.params;
    console.log(id); // Debugging log

    try {
        const result = await pool.query(
            "SELECT * FROM courses WHERE course_id = $1",
            [id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ message: "Course not found." });
        }

        res.status(200).json(result.rows[0]);
    } catch (error) {
        console.error("Error fetching course:", error);
        res.status(500).json({ message: "Internal server error." });
    }
})

router.post("/", async (req, res) => {
    const { courseId, courseName, courseCode, courseLocation, durationDays, courseDetails, instructorName, cost } = req.body;

    console.log("Received course data:", req.body); // Debugging log

    if(!courseName || !courseCode || !courseLocation || !durationDays || !courseDetails || !instructorName || !cost) {
        return res.status(400).json({ message: "All fields are required." });
    }

    try {
        const result = await pool.query(
            `INSERT INTO courses (course_name, course_code, course_location, duration_days, course_details, instructor_name, cost)
             VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
            [courseName, courseCode, courseLocation, durationDays, courseDetails, instructorName, cost]
        );

        res.status(201).json({ message: "Course added successfully!", course: result.rows[0] });
    } catch (error) {
        console.error("Error adding course:", error);
        res.status(500).json({ message: "Internal server error." });
    }
});

router.put("/:id", async (req, res) => {
    const { id } = req.params;
    const { courseName, courseCode, courseLocation, durationDays, courseDetails, instructorName, cost } = req.body;

    console.log("Received course update data:", req.body); // Debugging log

    if(!courseName || !courseCode || !courseLocation || !durationDays || !courseDetails || !instructorName || !cost) {
        return res.status(400).json({ message: "All fields are required." });
    }

    try {
        const result = await pool.query(
            `UPDATE courses
             SET course_name = $1, course_code = $2, course_location = $3,
                 duration_days = $4, course_details = $5, instructor_name = $6, cost = $7
             WHERE course_id = $8 RETURNING *`,
            [courseName, courseCode, courseLocation, durationDays, courseDetails, instructorName, cost, id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ message: "Course not found." });
        }

        res.status(200).json({ message: "Course updated successfully!", course: result.rows[0] });
    } catch (error) {
        console.error("Error updating course:", error);
        res.status(500).json({ message: "Internal server error." });
    }
});

router.delete("/:id", async (req, res) => {
    const { id } = req.params;
    console.log(id); // Debugging log

    try {
        const result = await pool.query(
            "DELETE FROM courses WHERE course_id = $1 RETURNING *",
            [id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ message: "Course not found." });
        }

        res.status(200).json({ message: "Course deleted successfully!" });
    } catch (error) {
        console.error("Error deleting course:", error);
        res.status(500).json({ message: "Internal server error." });
    }
});

export default router;