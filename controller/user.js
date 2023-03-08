const { StatusCodes } = require("http-status-codes");
const { generateToken } = require("../config/jwt");
const { findOneAndUpdate } = require("../models/User");
const User = require("../models/User");
const ApiError = require("../util/ApiError");

const createUser = async (req, res) => {
  const user = await User.create(req.body);
  res.status(StatusCodes.CREATED).json(user);
};

const login = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!email || !password) {
    throw new ApiError(
      StatusCodes.BAD_REQUEST,
      `Email and password are required`
    );
  }
  if (!user) {
    throw new ApiError(
      StatusCodes.NOT_FOUND,
      `Not found user with email ${email}`
    );
  }
  if (!(await user.isPasswordMatched(password))) {
    throw new ApiError(StatusCodes.UNAUTHORIZED, `Password is incorrect`);
  }
  const userTemp = (({ _id, firstname, lastname, email, mobile }) => ({
    _id,
    firstname,
    lastname,
    email,
    mobile,
    token: generateToken(_id),
  }))(user);
  res.status(StatusCodes.OK).json(userTemp);
};

const getAllUsers = async (req, res) => {
  const users = await User.find();
  res.status(StatusCodes.OK).json(users);
};

const getUser = async (req, res) => {
  const { id } = req.params;
  const user = await User.findOne({ _id: id });
  if (!user) {
    throw new ApiError(StatusCodes.NOT_FOUND, `Not found user with id ${id}`);
  }
  res.status(StatusCodes.OK).json(user);
};

const updateUser = async (req, res) => {
  const { id } = req.params;
  if (id !== req.user._id.toString()) {
    throw new ApiError(StatusCodes.FORBIDDEN, `You are not allowed to do this`);
  }
  const { firstname, lastname, email, mobile } = req.body;
  const user = await User.findOneAndUpdate(
    { _id: id },
    { firstname, lastname, email, mobile },
    {
      runValidators: true,
      new: true,
    }
  );
  if (!user) {
    throw new ApiError(StatusCodes.NOT_FOUND, `Not found user with id ${id}`);
  }
  res.status(StatusCodes.OK).json(user);
};

const deleteUser = async (req, res) => {
  const { id } = req.params;
  if (id !== req.user._id.toString()) {
    throw new ApiError(StatusCodes.FORBIDDEN, `You are not allowed to do this`);
  }
  const user = await User.findOneAndRemove({ _id: id });
  if (!user) {
    throw new ApiError(StatusCodes.NOT_FOUND, `Not found user with id ${id}`);
  }
  res.status(StatusCodes.OK).json(user);
};

const blockUser = async (req, res) => {
  const { id } = req.params;
  const user = await User.findOneAndUpdate(
    { _id: id },
    { isBlocked: true },
    { runValidators: true, new: true }
  );
  if (!user) {
    throw new ApiError(StatusCodes.NOT_FOUND, `Not found user with id ${id}`);
  }
  res.status(StatusCodes.OK).json(user);
};
const unblockUser = async (req, res) => {
  const { id } = req.params;
  const user = await User.findOneAndUpdate(
    { _id: id },
    { isBlocked: false },
    { runValidators: true, new: true }
  );
  if (!user) {
    throw new ApiError(StatusCodes.NOT_FOUND, `Not found user with id ${id}`);
  }
  res.status(StatusCodes.OK).json(user);
};

module.exports = {
  createUser,
  login,
  getAllUsers,
  getUser,
  deleteUser,
  updateUser,
  blockUser,
  unblockUser,
};
