import express from 'express';
import {userRouter} from "./modules/User/user.routes.js";
import productRoutes from './modules/Product/product.routes.js';
import {dbConnection} from "./database/dbConnection.js";


const app = express();
const port = 3030; //<----change the port

// middleware
app.use( express.json() );
app.use(userRouter);
app.use(productRoutes);

// database connection
dbConnection;

// start the server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});