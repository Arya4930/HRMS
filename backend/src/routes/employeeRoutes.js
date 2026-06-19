import express from "express";

const router = express.Router();

router.get("/", async (req, res) => {
    let { page = 1, limit = 10 } = req.query;

    // Logic to fetch employees from the database with pagination will go here

    res.status(200).json({ message: "Employees fetched successfully!" });
})

router.get("/:id", (req, res) => {
    const { id } = req.params;
    console.log(id); // Debugging log

    // Logic to fetch employee details from the database will go here

    res.status(200).json({ message: "Employee details fetched successfully!" });
})

router.post("/", (req, res) => {
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

    // Logic to add employee to the database will go here

    res.status(201).json({ message: "Employee added successfully!" });
});

router.put("/:id", (req, res) => {
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

    // Logic to update employee details in the database will go here

    res.status(200).json({ message: "Employee updated successfully!" });
});

router.delete("/:id", (req, res) => {
    const { id } = req.params;
    console.log(id); // Debugging log

    // Logic to delete employee from the database will go here

    res.status(200).json({ message: "Employee deleted successfully!" });
});

router.post("/addCourse/:id", (req, res) => {
    const { id } = req.params;
    const { course_id } = req.body;

    console.log(`Adding course ${course_id} to employee ${id}`); // Debugging log

    if(!course_id) {
        return res.status(400).json({ message: "Course ID is required." });
    }

    // Logic to add a course to an employee in the database will go here

    res.status(200).json({ message: "Course added to employee successfully!" });
});

export default router;