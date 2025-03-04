import { connect } from "mongoose";
export const dbConnection = () =>
  connect("mongodb://127.0.0.1:27017/e_commerce")
    .then(() => {
      console.log("Connected to database");
    })
    .catch((err) => {
      console.log("Error connecting to database", err);
    });
