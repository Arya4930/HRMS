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
            "SELECT * FROM employees ORDER BY employee_id LIMIT $1 OFFSET $2",
            [limit, offset]
        );
        res.status(200).json(result.rows);
    } catch (error) {
        console.error("Error fetching employees:", error);
        res.status(500).json({ message: "Internal server error." });
    }
})

router.get("/:id", async (req, res) => {
    const { id } = req.params;
    console.log(id); // Debugging log

    try {
        const result = await pool.query(
            "SELECT * FROM employees WHERE employee_id = $1",
            [id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ message: "Employee not found." });
        }

        res.status(200).json(result.rows[0]);
    } catch (error) {
        console.error("Error fetching employee:", error);
        res.status(500).json({ message: "Internal server error." });
    }
})

router.post("/", async (req, res) => {
    const { emp_id, first_name, last_name, email, phone, date_of_birth, hire_date, job_title, department_id, status, zipcode, address } = req.body;

    console.log("Received employee data:", req.body); // Debugging log

    if(!emp_id || !first_name || !last_name || !email || !phone || !date_of_birth || !hire_date || !job_title || !department_id || !status) {
        return res.status(400).json({ message: "All fields are required." });
    }

    // Regex for the employee First and Last name to make sure it doesnt contain any numbers
    if(/\d/.test(first_name) || /\d/.test(last_name)) {
        return res.status(400).json({ message: "First name and last name should not contain numbers." });
    }

    // Regex for validating email format
    if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        return res.status(400).json({ message: "Invalid email format." });
    }

    if(!/^\d{10}$/.test(phone)) {
        return res.status(400).json({ message: "Phone number should be 10 digits." });
    }

    const dob = new Date(date_of_birth);
    if(Number.isNaN(dob.getTime()) || dob >= new Date()) {
        return res.status(400).json({ message: "Invalid Birth Date format." });
    }

    const hod = new Date(hire_date);
    if(Number.isNaN(hod.getTime()) || hod > new Date()) {
        return res.status(400).json({ message: "Invalid Hiring Date format." });
    }

    try {
        const result = await pool.query(
            `INSERT INTO employees (first_name, last_name, email, phone_number, date_of_birth, hire_date, job_title, department_id, status)
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *`,
            [first_name, last_name, email, phone, date_of_birth, hire_date, job_title, department_id, status]
        );

        res.status(201).json({ message: "Employee added successfully!", employee: result.rows[0] });
    } catch (error) {
        console.error("Error adding employee:", error);
        res.status(500).json({ message: "Internal server error." });
    }
});

router.put("/:id", async (req, res) => {
    const { id } = req.params;
    const { emp_id, first_name, last_name, email, phone, date_of_birth, hire_date, job_title, department_id, status, zipcode, address } = req.body;

    console.log("Received employee update data:", req.body); // Debugging log

    if(!emp_id || !first_name || !last_name || !email || !phone || !date_of_birth || !hire_date || !job_title || !department_id || !status || !address) {
        return res.status(400).json({ message: "All fields are required." });
    }

    // Regex for the employee First and Last name to make sure it doesnt contain any numbers
    if(/\d/.test(first_name) || /\d/.test(last_name)) {
        return res.status(400).json({ message: "First name and last name should not contain numbers." });
    }

    // Regex for validating email format
    if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        return res.status(400).json({ message: "Invalid email format." });
    }

    if(!/^\d{10}$/.test(phone)) {
        return res.status(400).json({ message: "Phone number should be 10 digits." });
    }

    const dob = new Date(date_of_birth);
    if(Number.isNaN(dob.getTime()) || dob >= new Date()) {
        return res.status(400).json({ message: "Invalid Birth Date format." });
    }

    const hod = new Date(hire_date);
    if(Number.isNaN(hod.getTime()) || hod > new Date()) {
        return res.status(400).json({ message: "Invalid Hiring Date format." });
    }

    try {
        const result = await pool.query(
            `UPDATE employees
             SET first_name = $1, last_name = $2, email = $3, phone_number = $4,
                 date_of_birth = $5, hire_date = $6, job_title = $7, department_id = $8, status = $9
             WHERE employee_id = $10 RETURNING *`,
            [first_name, last_name, email, phone, date_of_birth, hire_date, job_title, department_id, status, id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ message: "Employee not found." });
        }

        res.status(200).json({ message: "Employee updated successfully!", employee: result.rows[0] });
    } catch (error) {
        console.error("Error updating employee:", error);
        res.status(500).json({ message: "Internal server error." });
    }
});

router.delete("/:id", async (req, res) => {
    const { id } = req.params;
    console.log(id); // Debugging log

    try {
        const result = await pool.query(
            "DELETE FROM employees WHERE employee_id = $1 RETURNING *",
            [id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ message: "Employee not found." });
        }

        res.status(200).json({ message: "Employee deleted successfully!" });
    } catch (error) {
        console.error("Error deleting employee:", error);
        res.status(500).json({ message: "Internal server error." });
    }
});

router.post("/addCourse/:id", async (req, res) => {
    const { id } = req.params;
    const { course_id } = req.body;

    console.log(`Adding course ${course_id} to employee ${id}`); // Debugging log

    if(!course_id) {
        return res.status(400).json({ message: "Course ID is required." });
    }

    try {
        const result = await pool.query(
            `INSERT INTO employee_courses (employee_id, course_id)
             VALUES ($1, $2) RETURNING *`,
            [id, course_id]
        );

        res.status(200).json({ message: "Course added to employee successfully!", enrollment: result.rows[0] });
    } catch (error) {
        console.error("Error adding course to employee:", error);
        res.status(500).json({ message: "Internal server error." });
    }
});

export default router;