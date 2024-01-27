const express = require("express");
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const multer = require("multer");
const csvParser = require("csv-parser");
const mysql = require("mysql2");
const path = require("path");
const PORT = 3000;
app.use(express.static(path.join(__dirname, 'public')));

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "manager",
  database: "hello",
});

db.connect((err) => {
  if (err) throw err;
  console.log("Connected to MySQL database");
});

const createTables = [
  `CREATE TABLE IF NOT EXISTS Student (
      student_id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(255),
      age INT,
      class VARCHAR(255)
    )`,
  `CREATE TABLE IF NOT EXISTS Address (
      address_id INT AUTO_INCREMENT PRIMARY KEY,
      student_id INT,
      street VARCHAR(255),
      city VARCHAR(255),
      state VARCHAR(255),
      zipcode VARCHAR(255),
      FOREIGN KEY(student_id) REFERENCES Student(student_id) ON DELETE CASCADE
    )`,
  `CREATE TABLE IF NOT EXISTS Hobby (
      hobby_id INT AUTO_INCREMENT PRIMARY KEY,
      student_id INT,
      hobby1 VARCHAR(255),
      hobby2 VARCHAR(255),
      hobby3 VARCHAR(255),
      FOREIGN KEY(student_id) REFERENCES Student(student_id) ON DELETE CASCADE
    )`,
];

createTables.forEach((query) => {
  db.query(query, (err) => {
    if (err) throw err;
    console.log("Table created or already exists");
  });
});

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

app.get("/hello", (req, res) => {
  res.sendFile(path.join(__dirname, "show.html"));
});

app.post("/upload", upload.single("file"), (req, res) => {
  if (!req.file) {
    return res.send("No file received.");
  }

  const csvData = req.file.buffer.toString("utf8");
  const records = [];

  require("csv-parser")()
    .on("data", (data) => {
      records.push(data);
    })
    .on("end", () => {
      saveDataToMySQL(records);
      res.send("File uploaded, and data saved to MySQL.");
    })
    .end(csvData);
});

function saveDataToMySQL(records) {
  records.forEach((record) => {
    const insertStudent =
      "INSERT INTO Student (name, age, class) VALUES (?, ?, ?)";
    db.query(
      insertStudent,
      [record.name, parseInt(record.age), record.class],
      (err, result) => {
        if (err) {
          console.error("Error inserting Student:", err);
          throw err;
        }

        const studentId = result.insertId;

        const insertAddress =
          "INSERT INTO Address (student_id, street, city, state, zipcode) VALUES (?, ?, ?, ?, ?)";
        db.query(
          insertAddress,
          [studentId, record.street, record.city, record.state, record.zipcode],
          (err) => {
            if (err) throw err;
          }
        );

        const insertHobby =
          "INSERT INTO Hobby (student_id, hobby1, hobby2, hobby3) VALUES (?, ?, ?, ?)";
        db.query(
          insertHobby,
          [studentId, record.hobby1, record.hobby2, record.hobby3],
          (err) => {
            if (err) {
              console.error("Error inserting Hobby:", err);
              throw err;
            }
          }
        );
      }
    );
  });
}

app.get("/api/students", (req, res) => {
  const query = "SELECT * FROM Student";
  db.query(query, (err, result) => {
    if (err) throw err;
    res.json(result);
  });
});

app.get("/api/addresses", (req, res) => {
  const query = "SELECT * FROM Address";
  db.query(query, (err, result) => {
    if (err) throw err;
    res.json(result);
  });
});

app.get("/api/hobbies", (req, res) => {
  const query = "SELECT * FROM Hobby";
  db.query(query, (err, result) => {
    if (err) throw err;
    res.json(result);
  });
});

app.get("/api/combined-data/:id", (req, res) => {
  const studentId = req.params.id;

  // Your database query logic to fetch data for the given studentId goes here
  const query = `
    SELECT 
      s.student_id AS ID,
      s.name AS Name,
      s.age AS Age,
      s.class AS Class,
      a.street AS Street,
      a.city AS City,
      a.state AS State,
      a.zipcode AS Zipcode,
      COALESCE(h.hobby1, 'No Hobby') AS Hobby1,
      COALESCE(h.hobby2, 'No Hobby') AS Hobby2,
      COALESCE(h.hobby3, 'No Hobby') AS Hobby3
    FROM Student s
    LEFT JOIN Address a ON s.student_id = a.student_id
    LEFT JOIN Hobby h ON s.student_id = h.student_id
    WHERE s.student_id = ?
  `;

  db.query(query, [studentId], (err, result) => {
    if (err) {
      console.error("Error fetching combined data for edit:", err);
      res.status(500).json({ error: "Internal Server Error" });
    } else {
      if (result.length > 0) {
        const record = result[0];
        res.json(record);
      } else {
        res.status(404).json({ error: "Record not found" });
      }
    }
  });
});

app.get("/api/combined-data", (req, res) => {
  const query = `
    SELECT 
      s.student_id AS ID,
      s.name AS Name,
      s.age AS Age,
      s.class AS Class,
      a.street AS Street,
      a.city AS City,
      a.state AS State,
      a.zipcode AS Zipcode,
      COALESCE(h.hobby1, 'No Hobby') AS Hobby1,
      COALESCE(h.hobby2, 'No Hobby') AS Hobby2,
      COALESCE(h.hobby3, 'No Hobby') AS Hobby3
    FROM Student s
    LEFT JOIN Address a ON s.student_id = a.student_id
    LEFT JOIN Hobby h ON s.student_id = h.student_id
  `;

  db.query(query, (err, result) => {
    if (err) {
      console.error("Error fetching combined data:", err);
      res.status(500).json({ error: "Internal Server Error" });
    } else {
      console.log(result);
      res.json(result);
    }
  });
});

app.post("/api/update-student/:id", (req, res) => {
  const studentId = req.params.id;
  const { name, age, className, street, city, state, zipcode, hobby1, hobby2, hobby3 } = req.body;

  const updateStudentQuery = `
    UPDATE student 
    SET name=?, age=?, class=? 
    WHERE student_id=?
  `;

  db.query(updateStudentQuery, [name, age, className, studentId], (err, result) => {
    if (err) {
      console.error("Error updating student:", err);
      res.status(500).json({ error: "Internal Server Error" });
    } else {
      // Update Address and Hobby information if they exist
      const updateAddressQuery = `
        UPDATE Address 
        SET street=?, city=?, state=?, zipcode=? 
        WHERE student_id=?
      `;
      db.query(updateAddressQuery, [street, city, state, zipcode, studentId], (errAddress, resultAddress) => {
        if (errAddress) {
          console.error("Error updating address:", errAddress);
          res.status(500).json({ error: "Internal Server Error" });
        } else {
          const updateHobbyQuery = `
            UPDATE Hobby 
            SET hobby1=?, hobby2=?, hobby3=? 
            WHERE student_id=?
          `;
          db.query(updateHobbyQuery, [hobby1, hobby2, hobby3, studentId], (errHobby, resultHobby) => {
            if (errHobby) {
              console.error("Error updating hobby:", errHobby);
              res.status(500).json({ error: "Internal Server Error" });
            } else {
              res.json({ message: "Student updated successfully" });
            }
          });
        }
      });
    }
  });
});


app.delete("/api/delete-student/:id", (req, res) => {
  const studentId = req.params.id;

  const deleteStudentQuery = "DELETE FROM Student WHERE student_id=?";
  db.query(deleteStudentQuery, [studentId], (err, result) => {
    if (err) {
      console.error("Error deleting student:", err);
      res.status(500).json({ error: "Internal Server Error" });
    } else {
      res.json({ message: "Student deleted successfully" });
    }
  });
});


app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
