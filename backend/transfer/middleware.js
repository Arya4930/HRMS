import { ApiError } from "../utils/apiError.js";
import jwt from "jsonwebtoken";

export const verifyJWT = async (req, _, next) => {
  try {
    const token = 
      req.cookies?.accessToken || 
      req.header("Authorization")?.split("Bearer ")[1];

    if (!token) {
      throw new ApiError(401, "Unauthorized Request: Token Missing");
    }

    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    console.log(decodedToken);
    

    const user = await Educator.findById(decodedToken._id).select("-password -refreshToken");
    console.log(user);
    

    if (!user) {
      throw new ApiError(401, "Invalid Access Token");
    }

    req.user = user;
    next();
  } catch (error) {
    throw new ApiError(401, error.message || "Token Verification Failed");
  }
};