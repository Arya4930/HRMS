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

router.get("/", async (req, res) => {
    let { page = 1, limit = 10 } = req.query;
    page = parseInt(page);
    limit = parseInt(limit);
    const offset = (page - 1) * limit;

    try {
        const result = await pool.query(
            "SELECT * FROM departments ORDER BY departmentid LIMIT $1 OFFSET $2",
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
            "SELECT * FROM departments WHERE departmentid = $1",
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
    const { departmentid, departmentname, establisheddate, departmentemail, location, budget } = req.body;

    console.log("Received department data:", req.body); // Debugging log

    if(!departmentid || !departmentname || !establisheddate || !departmentemail || !location || !budget) {
        return res.status(400).json({ message: "All fields are required." });
    }

    // Regex for the department name to make sure it doesnt contain any numbers
    if(/\d/.test(departmentname)) {
        return res.status(400).json({ message: "Department name should not contain numbers." });
    }

    // Regex for validating email format
    if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(departmentemail)) {
        return res.status(400).json({ message: "Invalid email format." });
    }

    const eod = new Date(establisheddate);
    if(Number.isNaN(eod.getTime()) || eod > new Date()) {
        return res.status(400).json({ message: "Invalid Established Date format." });
    }

    try {
        const result = await pool.query(
            `INSERT INTO departments (departmentid, departmentname, establisheddate, departmentemail, location, budget)
             VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
            [departmentid, departmentname, establisheddate, departmentemail, location, budget]
        );

        res.status(201).json({ message: "Department added successfully!", department: result.rows[0] });
    } catch (error) {
        console.error("Error adding department:", error);
        res.status(500).json({ message: "Internal server error." });
    }
});

router.put("/:id", async (req, res) => {
    const { id } = req.params;
    const { departmentname, establisheddate, departmentemail, location, budget } = req.body;

    console.log("Received department update data:", req.body); // Debugging log

    if(!departmentname || !establisheddate || !departmentemail || !location || !budget) {
        return res.status(400).json({ message: "All fields are required." });
    }

    // Regex for the department name to make sure it doesnt contain any numbers
    if(/\d/.test(departmentname)) {
        return res.status(400).json({ message: "Department name should not contain numbers." });
    }

    // Regex for validating email format
    if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(departmentemail)) {
        return res.status(400).json({ message: "Invalid email format." });
    }

    const eod = new Date(establisheddate);
    if(Number.isNaN(eod.getTime()) || eod > new Date()) {
        return res.status(400).json({ message: "Invalid Established Date format." });
    }

    try {
        const result = await pool.query(
            `UPDATE departments
             SET departmentname = $1, establisheddate = $2, departmentemail = $3, location = $4, budget = $5
             WHERE departmentid = $6 RETURNING *`,
            [departmentname, establisheddate, departmentemail, location, budget, id]
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
            "DELETE FROM departments WHERE departmentid = $1 RETURNING *",
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
