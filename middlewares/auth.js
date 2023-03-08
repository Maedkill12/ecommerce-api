const User = require("../models/User");
const jwt = require("jsonwebtoken");
const ApiError = require("../util/ApiError");
const { StatusCodes } = require("http-status-codes");

const auth = async (req, res, next) => {
  const token = req.headers.authorization || "";
  if (!token.startsWith("Bearer ")) {
    throw new ApiError(
      StatusCodes.BAD_REQUEST,
      `There is no token attached to header. Token must start with 'Bearer <token>'`
    );
  }
  const decoded = jwt.verify(token.split(" ")[1], process.env.JWT_SECRET);
  if (!decoded) {
    throw new ApiError(StatusCodes.UNAUTHORIZED, `Invalid token`);
  }
  const user = await User.findOne({ _id: decoded.id });
  req.user = user;
  next();
};

const isAdmin = async (req, res, next) => {
  const user = req.user;
  if (!user) {
    throw new ApiError(StatusCodes.UNAUTHORIZED, `Please sign in`);
  }
  if (user.role !== "admin") {
    throw new ApiError(StatusCodes.FORBIDDEN, `You are not allowed to do this`);
  }
  next();
};

module.exports = { auth, isAdmin };
