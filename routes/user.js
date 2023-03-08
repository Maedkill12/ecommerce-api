const express = require("express");
const {
  createUser,
  login,
  getAllUsers,
  getUser,
  deleteUser,
  updateUser,
  blockUser,
  unblockUser,
} = require("../controller/user");
const { auth, isAdmin } = require("../middlewares/auth");
const router = express.Router();

router.post("/register", createUser);
router.post("/login", login);
router.patch("/block/:id", auth, isAdmin, blockUser);
router.patch("/unblock/:id", auth, isAdmin, unblockUser);
router.route("/").get(getAllUsers);
router
  .route("/:id")
  .get(auth, getUser)
  .delete(auth, deleteUser)
  .patch(auth, updateUser);

module.exports = router;
