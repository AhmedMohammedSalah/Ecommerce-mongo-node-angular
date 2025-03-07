import jwt from "jsonwebtoken";

export async function tokenVerify(req, res, next) {
  const token = req.headers["token"];
  if (!token) {
    return res.status(401).json({ message: "Token is required" });
  }
  jwt.verify(token, "ARAF", (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: "Invalid token" });
    }
    req.user = decoded;
    next();
  });
}
