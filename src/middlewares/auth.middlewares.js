import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";


export const verifyJWT = asyncHandler(async(req, res, next) => {
  try {
      const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "");
      console.log('Token:', token); // Log the token for debugging

      if (!token) {
          throw new ApiError(401, "Unauthorized request!");
      }

      const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
      console.log('Decoded Token:', decodedToken); // Log decoded token

      const user = await User.findById(decodedToken?._id).select("-password -refreshToken");
      console.log('User:', user); // Log user

      if (!user) {
          throw new ApiError(401, "Invalid Access Token!");
      }

      req.user = user;
      next();
  } catch (error) {
      console.log('Error in verifyJWT:', error); // Log error
      throw new ApiError(401, error?.message || "Invalid access token!");
  }
});
