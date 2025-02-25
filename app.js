import express from 'express';
import {userRouter} from "./modules/User/user.routes.js";
import mongoose from "mongoose";
import {dbConnection} from "./database/dbConnection.js";
const app = express();
app.use( express.json() );
app.use( userRouter );
dbConnection;
app.listen(3000, () => {
    console.log("Server is running on port 3000");
});