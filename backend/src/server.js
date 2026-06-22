import express from "express";
import cors from "cors";
import GeneralRoutes from "./routes/generalRoutes.js";
import EmployeeRoutes from "./routes/employeeRoutes.js";
import CourseRoutes from "./routes/courseRoutes.js";
import DeptRoutes from "./routes/deptRoutes.js";
import "dotenv/config";

// Configuring Express app
const app = express();

app.use(cors());
app.use(express.json({ limit: "10mb" }));

// Base Route
app.get("/", (req, res) => {
    res.status(200).send("HRMS backend is running!");
});

app.use("/api", GeneralRoutes);
app.use("/api/employees", EmployeeRoutes);
app.use("/api/course", CourseRoutes);
app.use("/api/department", DeptRoutes);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}!`);
});