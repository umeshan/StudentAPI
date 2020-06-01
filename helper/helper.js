const fs = require("fs");

function writeJson(students) {
  fs.writeFile("json/students.json", JSON.stringify({ students }), function (
    err
  ) {
    if (err) throw err;
  });
}

module.exports = writeJson;
