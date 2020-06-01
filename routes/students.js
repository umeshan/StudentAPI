const express = require("express");
const router = express.Router();
const fs = require("fs");

const writeJson = require("../helper/helper");
let rawdata = fs.readFileSync("json/students.json");

let json = JSON.parse(rawdata);
const schemaName = "Student";
const messages = {
  success: {
    add: `${schemaName} added successfully`,
    update: `${schemaName} updated successfully`,
    delete: `${schemaName} deleted successfully`,
  },
  error: {
    studentExist: `${schemaName} already exist`,
    studentNotExist: `${schemaName} does not exist`,
    statusCode: 403,
  },
};

// List Student(s)
router.get("/list", async (req, res) => {
  res.send(json.students);
});

// Add Student
router.post("/add", async (req, res) => {
  const { students } = json;
  const studentExists = students.filter(
    (student) => student.regNo === req.body.regNo
  );
  if (studentExists.length <= 0) {
    const studentId =
      students.length > 0 ? students[students.length - 1]["id"] + 1 : 1;
    const updateList = [...students, { ...req.body, id: studentId }];
    await writeJson(updateList);
    res.send(messages.success.add);
  } else {
    res.status(messages.error.statusCode).send(messages.error.studentExist);
  }
});

// Update Student
router.post("/update", async (req, res) => {
  const { students } = json;
  const studentExists = students.filter(
    (student) => student.id === req.body.id
  );
  if (studentExists.length === 1) {
    const updatedStudents = students.map((student) => {
      if (student.id === req.body.id) {
        return {
          ...student,
          ...req.body,
        };
      } else {
        return student;
      }
    });
    await writeJson(updatedStudents);
    res.send(messages.success.update);
  } else {
    res.status(messages.error.statusCode).send(messages.error.studentNotExist);
  }
});

// Delete Student
router.post("/delete", async (req, res) => {
  const { students } = json;
  const studentExists = students.filter(
    (student) => student.id === req.body.id
  );
  if (studentExists.length === 1) {
    const updatedStudents = students.filter(
      (student) => student.id !== req.body.id
    );
    await writeJson(updatedStudents);
    res.send(messages.success.delete);
  } else {
    res.status(messages.error.statusCode).send(messages.error.studentNotExist);
  }
});

module.exports = router;
