import express from "express";
import fs from "fs/promises";

const app = express();
const PORT = 3000;
app.use(express.json());

// TODO: צרו route שקורא את users.json ומחזיר את כל המשתמשים
// GET /user
app.get("/users", async (req, res) => {
  try {
    const data = await fs.readFile("users.json", "utf-8");
    const users = JSON.parse(data);
    res.status(200).json(users);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "error" + err, users: null });
  }
});

// TODO: צרו route שמחפש משתמשים לפי עיר
// GET /users/search?city=TelAviv
app.get("/users/search", async (req, res) => {
  const { city } = req.query;
  try {
    const data = await fs.readFile("users.json", "utf-8");
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
});

// TODO: צרו route שמחזיר משתמש לפי ID
// GET /users/:id
app.get("/users/:id", async (req, res) => {
  const { id } = req.params;
  const intId = parseInt(id);
  if (isNaN(intId)) throw new Error("Invalid id, please use an integer.");

  try {
    const data = await fs.readFile("users.json", "utf-8");
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
});

app.put("/users/:id", async (req, res) => {
  const { id } = req.params;
  const { body } = req;
  const intId = parseInt(id);

  try {
    const data = await fs.readFile("users.json", "utf-8");
    const users = JSON.parse(data);
    // const indexUser = users.findIndex((user) => user.id === intId);
    // users[indexUser]
    const user = users.find((userr) => userr.id === intId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    // users[indexUser]={id:intId,...body}
    user.name = body.name || user.name
    user.age = body.age || user.age
    user.city = body.city || user.city
    await fs.writeFile("users.json", JSON.stringify(users, null, 2), "utf-8");
    res.status(200).json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "error" + err.message, users: null });
  }
});

const getNextId = (users) => {
  if (!users || users.length === 0) {
    return 1;
  }
  let maxValue = 0;
  users.forEach((users) => {
    if (users.id > maxValue) {
      maxValue = users.id;
    }
  });
  return maxValue + 1;
};

// TODO: צרו route להוספת משתמש
// POST /users
app.post("/users", async (req, res) => {
  const { body } = req;

  try {
    const data = await fs.readFile("users.json", "utf-8");
    const users = JSON.parse(data);
    const newUser = {
      id: getNextId(users),
      ...body,
    };
    users.push(newUser);
    await fs.writeFile("users.json", JSON.stringify(users, null, 2), "utf-8");
    return res.status(201).json(newUser);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "error" + err.message, users: null });
  }
});

app.delete("/users/:id", async(req, res) => {
  const { id } = req.params;
  const intId = parseInt(id);
  try {
    const data = await fs.readFile("users.json", "utf-8");
    const users = JSON.parse(data);
    const index = users.findIndex((u) => u.id === intId);
    const user = users[index]
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
      users.splice(index, 1);
      await fs.writeFile("users.json", JSON.stringify(users, null, 2), "utf-8");
      res.status(203).json({ success: true, data: {} });
  }catch(err) {
    console.error(err);
    res.status(500).json({ msg: "error" + err.message, users: null });

  }

});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
