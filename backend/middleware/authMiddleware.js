// import jwt from "jsonwebtoken";

// export const protect = (req, res, next) => {
//   // Get token from Authorization header
//   const token = req.header("Authorization");

//   // Check if token exists
//   if (!token) {
//     return res.status(401).json({ message: "Access denied, no token provided" });
//   }

//   // Remove "Bearer " part of the Authorization header and get the actual token
//   const actualToken = token.split(" ")[1];

//   if (!actualToken) {
//     return res.status(401).json({ message: "Invalid token format" });
//   }

//   try {
//     // Verify the token
//     const decoded = jwt.verify(actualToken, process.env.JWT_SECRET);
//     req.user = decoded; // Add decoded info to req.user
//     next(); // Continue to the next middleware/route handler
//   } catch (error) {
//     res.status(401).json({ message: "Invalid token" });
//   }
// };
import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findById(decoded.id).select("-password");

      next();
    } catch (error) {
      return res.status(401).json({ message: "Invalid or expired token" });
    }
  } else {
    return res.status(401).json({ message: "Not authorized, no token" });
  }
  if (!token) {
    return res.status(401).json({ message: "Not authorized, no token" });
  }
};

