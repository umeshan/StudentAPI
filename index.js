const express = require("express");
const app = express();
const fs = require("fs");
const student = require("./routes/students");
const bodyParser = require("body-parser");
const cors = require("cors");

require("dotenv/config");
const port = process.env.PORT || 3005;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use("/students", student);

app.get("/", async (req, res) => {
  res.send("**** Server is Up ****");
});

// City Api
app.get("/city", async (req, res) => {
  let cityData = fs.readFileSync("json/city.json");
  res.send(JSON.parse(cityData));
});

// Start server
app.listen(port, () =>
  console.log(`CORS-enabled web server listening on port ${port}`)
);
