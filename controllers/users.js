import { getNextId } from "../utils/utils.js";
import fs from "fs/promises";
import path from "path";
const __dirname = path.resolve();
const USERS_PATH = path.join(__dirname, "data", "users.json");

// TODO: צרו route שקורא את users.json ומחזיר את כל המשתמשים
// GET /user
export const getUsers = async (req, res) => {
  try {
    const data = await fs.readFile(USERS_PATH, "utf-8");
    const users = JSON.parse(data);
    res.status(200).json(users);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "error" + err, users: null });
  }
};

// TODO: צרו route שמחפש משתמשים לפי עיר
// GET /users/search?city=TelAviv
export const getByCity = async (req, res) => {
  const { city } = req.query;
  try {
    const data = await fs.readFile(USERS_PATH, "utf-8");
    const users = JSON.parse(data);
    // console.log(users)
    const user = users.filter((userr) => userr.city === city);
    if (!user || user.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "error" + err.message, users: null });
  }
};

// TODO: צרו route שמחזיר משתמש לפי ID
// GET /users/:id
export const getById = async (req, res) => {
  const { id } = req.params;
  const intId = parseInt(id);
  if (isNaN(intId)) throw new Error("Invalid id, please use an integer.");

  try {
    const data = await fs.readFile(USERS_PATH, "utf-8");
    const users = JSON.parse(data);
    const user = users.find((userr) => userr.id === intId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "error" + err.message, users: null });
  }
};

export const uptateUser = async (req, res) => {
  const { id } = req.params;
  const { body } = req;
  const intId = parseInt(id);

  try {
    const data = await fs.readFile(USERS_PATH, "utf-8");
    const users = JSON.parse(data);
    // const indexUser = users.findIndex((user) => user.id === intId);
    // users[indexUser]
    const user = users.find((userr) => userr.id === intId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    // users[indexUser]={id:intId,...body}
    user.name = body.name || user.name;
    user.age = body.age || user.age;
    user.city = body.city || user.city;

    await fs.writeFile(USERS_PATH, JSON.stringify(users, null, 2), "utf-8");
    res.status(200).json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "error" + err.message, users: null });
  }
};

// TODO: צרו route להוספת משתמש
// POST /users
export const createUser = async (req, res) => {
  const { body } = req;

  try {
    const data = await fs.readFile(USERS_PATH, "utf-8");
    const users = JSON.parse(data);
    const newUser = {
      id: getNextId(users),
      ...body,
    };

    // if(!body.name) res.status(400).json({msg: "Error: please provide name"})
    // user.name = body.name;
    // user.age = body.age || "";
    // user.city = body.city || undefined;

    users.push(newUser);
    await fs.writeFile(USERS_PATH, JSON.stringify(users, null, 2), "utf-8");
    return res.status(201).json(newUser);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "error" + err.message, users: null });
  }
};

export const deleteUser = async (req, res) => {
  const { id } = req.params;
  const intId = parseInt(id);
  try {
    const data = await fs.readFile(USERS_PATH, "utf-8");
    const users = JSON.parse(data);
    const index = users.findIndex((u) => u.id === intId);
    const user = users[index];
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    users.splice(index, 1);
    await fs.writeFile(USERS_PATH, JSON.stringify(users, null, 2), "utf-8");
    res.status(203).json({ success: true, data: {} });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "error" + err.message, users: null });
  }
};
