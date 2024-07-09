const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();
app.use(bodyParser.json());
app.use(cors());

const users = [
  {
    email: "teacher@example.com",
    password: "password123",
    userType: "faculty",
  },
  {
    number: 20101,
    name: "김",
    email: "student1@example.com",
    password: "password123",
    userType: "student",
    log: "진로 상담 이렇게 함",
    date: "2024-06-13",
  },
  {
    number: 20102,
    name: "이",
    email: "student2@example.com",
    password: "password123",
    userType: "student",
    log: "진로 이떄 함",
    date: "2024-06-18",
  },
  {
    number: 20103,
    name: "박",
    email: "student3@example.com",
    password: "password123",
    userType: "student",
    log: "진로상담함",
    date: "2024-07-02",
  },
];

app.post("/api/login", (req, res) => {
  const { email, password, userType } = req.body;
  const user = users.find(
    (user) =>
      user.email === email &&
      user.password === password &&
      user.userType === userType
  );
  if (user) {
    res.status(200).json({ message: "Login successful" });
  } else {
    res.status(401).json({ message: "Invalid credentials" });
  }
});

app.get("/api/students", (req, res) => {
  const students = users.filter((user) => user.userType === "student");
  res.status(200).json(students);
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
