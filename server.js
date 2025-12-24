import express from "express";

const app = express();
const PORT = 3000;
app.use(express.json());

import users from "./routes/users.js";


app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  res.setHeader("X-timestamp",new Date())
  next();
});

app.get("/", async (req, res) => {
  res.json({
    message: "Welcome to Users List API",
    version: "1.0.0",
  });
});

app.use("/users", users);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
