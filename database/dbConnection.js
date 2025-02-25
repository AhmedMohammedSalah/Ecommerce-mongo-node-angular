import mongoose from 'mongoose';
export const dbConnection =
mongoose
  .connect("mongodb://127.0.0.1:27017/osITI")
  .then(() => {
    console.log("Connected to database");
  })
  .catch((err) => {
    console.log("Error connecting to database", err);
  } );
  

  