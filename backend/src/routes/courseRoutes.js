import express from "express";
import "dotenv/config";
import { Pool } from "pg";

const pool = new Pool({
  host: "localhost",
  port: 5432,
  user: "postgres",
  password: "password",
  database: "hrms",
});

const router = express.Router();

router.get("/", async (req, res) => {
    let { page = 1, limit = 10 } = req.query;
    page = parseInt(page);
    limit = parseInt(limit);
    page = Number.isNaN(page) || page < 1 ? 1 : page;
    limit = Number.isNaN(limit) || limit < 1 ? 10 : limit;
    const offset = (page - 1) * limit;

    try {
        const countResult = await pool.query("SELECT COUNT(*) FROM courses");
        const total = parseInt(countResult.rows[0].count);
        const totalPages = Math.max(Math.ceil(total / limit), 1);
        const result = await pool.query(
            "SELECT * FROM courses ORDER BY courseid LIMIT $1 OFFSET $2",
            [limit, offset]
        );
        res.status(200).json({
            data: result.rows,
            pagination: {
                page,
                limit,
                total,
                totalPages,
                hasPrevious: page > 1,
                hasNext: page < totalPages
            }
        });
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
            "SELECT * FROM courses WHERE courseid = $1",
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
    const { courseid, coursename, coursecode, courselocation, durationdays, coursedetails, instructorname, cost } = req.body;

    console.log("Received course data:", req.body); // Debugging log

    if(!courseid || !coursename || !coursecode || !courselocation || !durationdays || !coursedetails || !instructorname || !cost) {
        return res.status(400).json({ message: "All fields are required." });
    }

    try {
        const result = await pool.query(
            `INSERT INTO courses (courseid, coursename, coursecode, courselocation, durationdays, coursedetails, instructorname, cost)
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *`,
            [courseid, coursename, coursecode, courselocation, durationdays, coursedetails, instructorname, cost]
        );

        res.status(201).json({ message: "Course added successfully!", course: result.rows[0] });
    } catch (error) {
        console.error("Error adding course:", error);
        res.status(500).json({ message: "Internal server error." });
    }
});

router.put("/:id", async (req, res) => {
    const { id } = req.params;
    const { coursename, coursecode, courselocation, durationdays, coursedetails, instructorname, cost } = req.body;

    console.log("Received course update data:", req.body); // Debugging log

    if(!coursename || !coursecode || !courselocation || !durationdays || !coursedetails || !instructorname || !cost) {
        return res.status(400).json({ message: "All fields are required." });
    }

    try {
        const result = await pool.query(
            `UPDATE courses
             SET coursename = $1, coursecode = $2, courselocation = $3,
                 durationdays = $4, coursedetails = $5, instructorname = $6, cost = $7
             WHERE courseid = $8 RETURNING *`,
            [coursename, coursecode, courselocation, durationdays, coursedetails, instructorname, cost, id]
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
            "DELETE FROM courses WHERE courseid = $1 RETURNING *",
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
