import express from "express";
import { dbConnection } from "./database/dbConnection.js";

const app = express();
dbConnection();
app.use(express.json());
app.listen(3000, () => {
    console.log("Server is running on port 3000");
});
