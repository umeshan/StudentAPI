const express = require("express");
const router = express.Router();
const fs = require("fs");

const writeJson = require("../helper/helper");
let rawdata = fs.readFileSync("json/students.json");
const keys = ["city", "firstName", "gender", "lastName", "regNo", "zip"];
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
    statusCode: 404,
    alreadyExists: 403,
    badRequest: 400,
    request: "Error in request",
  },
};

// List Student(s)
router.get("/list", async (req, res) => {
  res.send(json.students);
});

// GET SPECIFIC POST
router.get("/list/:id", async (req, res) => {
  const { students } = json;
  if (req.params && req.params.id) {
    const studentRecord = students.filter(
      (student) => student.id === parseInt(req.params.id)
    );
    if (studentRecord.length > 0) {
      res.send(studentRecord[0]);
    } else {
      res
        .status(messages.error.statusCode)
        .send(messages.error.studentNotExist);
    }
  } else {
    res.status(messages.error.badRequest).send(messages.error.request);
  }
});

// Add Student
router.post("/add", async (req, res) => {
  if (
    req.body &&
    JSON.stringify(Object.keys(req.body).sort()) === JSON.stringify(keys)
  ) {
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
      res
        .status(messages.error.alreadyExists)
        .send(messages.error.studentExist);
    }
  } else {
    res.status(messages.error.badRequest).send(messages.error.request);
  }
});

// Update Student
router.post("/update", async (req, res) => {
  if (
    req.body &&
    JSON.stringify(Object.keys(req.body).sort()) ===
      JSON.stringify([...keys, "id"].sort())
  ) {
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
      res
        .status(messages.error.statusCode)
        .send(messages.error.studentNotExist);
    }
  } else {
    res.status(messages.error.badRequest).send(messages.error.request);
  }
});

// Delete Student
router.post("/delete", async (req, res) => {
  if (req.body && req.body.id) {
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
      res
        .status(messages.error.statusCode)
        .send(messages.error.studentNotExist);
    }
  } else {
    res.status(messages.error.badRequest).send(messages.error.request);
  }
});

module.exports = router;
