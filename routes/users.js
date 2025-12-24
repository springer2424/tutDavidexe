import express from "express";
import {
  getUsers,
  getByCity,
  getById,
  uptateUser,
  createUser,
  deleteUser,
} from "../controllers/users.js";

const router = express.Router();

router.route("/").get(getUsers).post(createUser);
router.route("/search").get(getByCity);
router.route("/:id").get(getById).put(uptateUser).delete(deleteUser);

export default router;
