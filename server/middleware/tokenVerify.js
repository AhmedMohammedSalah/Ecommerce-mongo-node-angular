import jwt from "jsonwebtoken";

export async function tokenVerify(req, res, next) {
  const token = req.headers["token"];
  console.log("Enter token verify middleware ");

  if (!token) {
    return res.status(401).json({ message: "Token is required" });
  }
  jwt.verify(token, "ARAF", (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: "tokenVerify: Invalid token" });
    }
    // console.log(decoded.user);

    req.user = decoded.user;

    req.user.id = req.user._id;

    next();
  });
}
