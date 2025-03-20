import jwt from "jsonwebtoken";

export async function tokenVerify(req, res, next) {
  console.log("Enter Token Verify");

  const token = req.headers["token"];
  console.log(token);

  if (!token) {
    return res.status(401).json({ message: "Token is required" });
  }
  jwt.verify(token, "ARAF", (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: "tokenVerify: Invalid token" });
    }

    req.user = decoded.user;
    req.user.id = req.user._id;
    console.log("next ");
    
    next();
  });
}
