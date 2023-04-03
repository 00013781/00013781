const { Router } = require("express");
const crypto = require("crypto");
const multer = require("multer");
const fs = require("fs");
const path = require("path");

const router = new Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/uploads/");
  },

  filename: (req, file, cb) => {
    cb(
      null,
      `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`
    );
  },
});

let upload = multer({
  limits: {
    fileSize: 10000000,
  },
  fileFilter(req, file, cb) {
    if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
      return cb(new Error("Please upload a valid image file"));
    }

    cb(undefined, true);
  },
  storage: storage,
});

router.get("/", (req, res) => {
  res.render("home");
});

router.get("/addStudent", (req, res) => {
  const id = req.query.id;
  if (id) {
    fs.readFile("./data/students.json", (err, students) => {
      if (err) throw err;
      const allStudents = JSON.parse(students);
      const editableStudent = allStudents.find((student) => student.id == id);
      res.render("addStudent", {
        studentName: editableStudent.studentName,
        studentId: editableStudent.studentId,
        date: editableStudent.date,
        level: editableStudent.level,
        id,
        edit: true,
      });
    });
  } else {
    res.render("addStudent");
  }
});

router.post("/addStudent", upload.single("image"), (req, res) => {
  const id = req.query.id;
  const { studentName, studentId, date, level } = req.body;
  const image = req?.file?.filename || "";
  if (studentName.trim() && studentId.trim().length == 8 && date) {
    fs.readFile("./data/students.json", (err, students) => {
      if (err) throw err;
      const allStudents = JSON.parse(students);
      const studentById = allStudents.find((student) => student.id == id);
      allStudents.unshift({
        id: crypto.randomUUID(),
        studentName,
        studentId,
        date: date,
        level,
        image: image ? image : studentById?.image,
      });
      let newStudents;
      if (id) {
        const studentRemoveOne = allStudents.filter(
          (student) => student.id != id
        );
        newStudents = JSON.stringify(studentRemoveOne);
      } else {
        newStudents = JSON.stringify(allStudents);
      }
      fs.writeFile("./data/students.json", newStudents, (err) => {
        if (err) throw err;
        res.render("addStudent", { added: true });
      });
    });
  } else {
    res.render("addStudent", {
      studentName: studentName.trim(),
      studentId: studentId.trim(),
      date,
      level,
      studentIdValidation: studentId.trim().length != 8,
      id,
    });
  }
});

router.get("/students", (req, res) => {
  const { search } = req.query;
  fs.readFile("./data/students.json", (err, students) => {
    if (err) throw err;
    const allStudents = JSON.parse(students);
    const studentsWithSearch = allStudents.filter((student) =>
      student.studentId.includes(search)
    );
    if (search)
      res.render("students", { students: studentsWithSearch, search });
    else res.render("students", { students: allStudents });
  });
});

router.get("/:id/delete", (req, res) => {
  const id = req.params.id;
  fs.readFile("./data/students.json", (err, students) => {
    if (err) throw err;
    const allStudents = JSON.parse(students);
    const studentRemoveOne = allStudents.filter((student) => student.id != id);
    const newStudents = JSON.stringify(studentRemoveOne);
    const deletedStudent = allStudents.find((student) => student.id == id);

    fs.writeFile("./data/students.json", newStudents, (err) => {
      if (err) throw err;
      if (deletedStudent?.image) {
        fs.unlink(`public/uploads/${deletedStudent?.image}`, (err) => {
          if (err) throw err;
        });
      }
      res.render("students", { students: studentRemoveOne, delete: true });
    });
  });
});

router.get("/api/v1/students", (req, res) => {
  fs.readFile("./data/students.json", (err, students) => {
    if (err) throw err;
    const allStudents = JSON.parse(students);
    res.json(allStudents);
  });
});

router.get("/students/:id", (req, res) => {
  const id = req.params.id;
  fs.readFile("./data/students.json", (err, students) => {
    if (err) throw err;
    const allStudents = JSON.parse(students);
    const studentById = allStudents.find((student) => student.id == id);
    res.render("student", {
      student: studentById,
    });
  });
});

module.exports = router;
