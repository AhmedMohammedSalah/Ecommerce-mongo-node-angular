import jwt from "jsonwebtoken";

export async function tokenVerify(req, res, next) {
  
  // get token from header
  const token = req.headers["token"];

  // check existence
  if (!token) {return res.status(401).json({ message: "Token is required" });}

  // decod the token
  jwt.verify(token, "ARAF", (err, decoded) => {

    // check error occur
    if (err) {return res.status(401).json({ message: "tokenVerify: Invalid token" });}

    // add decoded in request
    req.user = decoded.user;
    req.user.id = req.user._id;

    // OK
    next();

  });
}
