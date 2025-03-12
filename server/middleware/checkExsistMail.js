import User from "../database/models/user.model.js";
const userModel = User;
export async function checkMail(req, res, next) {
  const userMail = req.body.email;
  console.log(userMail);

  const user = await userModel.findOne({ email: userMail });
  if (user) {
    return res.status(400).json({ message: "Email already exists", user });
  }
  next();
}
