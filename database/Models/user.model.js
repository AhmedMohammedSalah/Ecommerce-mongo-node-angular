import {Schema,model }from "mongoose";

const userShema = Schema({
    name: String,
    age: Number,
    email: String,
} );

export const userModel = model("User", userShema);
