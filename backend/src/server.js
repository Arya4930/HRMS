import express from "express";
import cors from "cors";
import DbActions from "./routes/DbActions.js";
import "dotenv/config";

// Configuring Express app
const app = express();

app.use(cors());
app.use(express.json({ limit: "10mb" }));

// Base Route
app.get("/", (req, res) => {
    res.send("HRMS backend is running!", 200);
});

app.use("/api", DbActions);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}!`);
});