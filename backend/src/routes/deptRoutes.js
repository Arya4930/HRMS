import express from "express";
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
            "SELECT * FROM departments ORDER BY department_id LIMIT $1 OFFSET $2",
            [limit, offset]
        );
        res.status(200).json(result.rows);
    } catch (error) {
        console.error("Error fetching departments:", error);
        res.status(500).json({ message: "Internal server error." });
    }
})

router.get("/:id", async (req, res) => {
    const { id } = req.params;
    console.log(id); // Debugging log

    try {
        const result = await pool.query(
            "SELECT * FROM departments WHERE department_id = $1",
            [id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ message: "Department not found." });
        }

        res.status(200).json(result.rows[0]);
    } catch (error) {
        console.error("Error fetching department:", error);
        res.status(500).json({ message: "Internal server error." });
    }
})

router.post("/", async (req, res) => {
    const { departmentId, departmentName, establishedDate, departmentEmail, location, budget } = req.body;

    console.log("Received department data:", req.body); // Debugging log

    if(!departmentId || !departmentName || !establishedDate || !departmentEmail || !location || !budget) {
        return res.status(400).json({ message: "All fields are required." });
    }

    // Regex for the department name to make sure it doesnt contain any numbers
    if(/\d/.test(departmentName)) {
        return res.status(400).json({ message: "Department name should not contain numbers." });
    }

    // Regex for validating email format
    if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(departmentEmail)) {
        return res.status(400).json({ message: "Invalid email format." });
    }

    const eod = new Date(establishedDate);
    if(Number.isNaN(eod.getTime()) || eod > new Date()) {
        return res.status(400).json({ message: "Invalid Established Date format." });
    }

    try {
        const result = await pool.query(
            `INSERT INTO departments (department_name, established_date, department_email, location, budget)
             VALUES ($1, $2, $3, $4, $5) RETURNING *`,
            [departmentName, establishedDate, departmentEmail, location, budget]
        );

        res.status(201).json({ message: "Department added successfully!", department: result.rows[0] });
    } catch (error) {
        console.error("Error adding department:", error);
        res.status(500).json({ message: "Internal server error." });
    }
});

router.put("/:id", async (req, res) => {
    const { id } = req.params;
    const { departmentName, establishedDate, departmentEmail, location, budget } = req.body;

    console.log("Received department update data:", req.body); // Debugging log

    if(!departmentName || !establishedDate || !departmentEmail || !location || !budget) {
        return res.status(400).json({ message: "All fields are required." });
    }

    // Regex for the department name to make sure it doesnt contain any numbers
    if(/\d/.test(departmentName)) {
        return res.status(400).json({ message: "Department name should not contain numbers." });
    }

    // Regex for validating email format
    if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(departmentEmail)) {
        return res.status(400).json({ message: "Invalid email format." });
    }

    const eod = new Date(establishedDate);
    if(Number.isNaN(eod.getTime()) || eod > new Date()) {
        return res.status(400).json({ message: "Invalid Established Date format." });
    }

    try {
        const result = await pool.query(
            `UPDATE departments
             SET department_name = $1, established_date = $2, department_email = $3, location = $4, budget = $5
             WHERE department_id = $6 RETURNING *`,
            [departmentName, establishedDate, departmentEmail, location, budget, id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ message: "Department not found." });
        }

        res.status(200).json({ message: "Department updated successfully!", department: result.rows[0] });
    } catch (error) {
        console.error("Error updating department:", error);
        res.status(500).json({ message: "Internal server error." });
    }
});

router.delete("/:id", async (req, res) => {
    const { id } = req.params;
    console.log(id); // Debugging log

    try {
        const result = await pool.query(
            "DELETE FROM departments WHERE department_id = $1 RETURNING *",
            [id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ message: "Department not found." });
        }

        res.status(200).json({ message: "Department deleted successfully!" });
    } catch (error) {
        console.error("Error deleting department:", error);
        res.status(500).json({ message: "Internal server error." });
    }
});

export default router;