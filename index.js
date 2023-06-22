import express from 'express';
import cors from 'cors';
import mysql from 'mysql2';
import 'dotenv/config';
import fs from 'fs';

const app = express();
const port = process.env.PORT || 4000

app.use(express.json());
app.use(cors());

app.listen(port, () => {
    console.log("Example app listening on port 4000!");
}
)

app.get("/", (req,res) => {
    res.send("Hello from Node halløj!");
})

const connection = mysql.createConnection({
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    database: process.env.MYSQL_DATABASE,
    password: process.env.MYSQL_PASSWORD,
    ssl: {cs: fs.readFileSync("DigiCertGlobalRootCA.crt.pem")}
});


app.get("/students", async (req,res) => {
    connection.query(
        'SELECT * from `students`',
        function(err, results, fields) {
            console.log("RESULTS:")
            console.log(results);
            //console.log(fields);
            res.json(results);
        }
    )
})

app.get("/students/:id", async (req,res) => {
    
    const id = req.params.id;
    console.log("looking for: " + id);
    connection.query(
        'SELECT * from `students` WHERE id = ?',
        [id],
        function(err, results, fields) {
            console.log("RESULTS:")
            console.log(results);
            //console.log(fields);
            res.json(results);
        }
    )
});

app.post("/students", async (req,res) => {
    
    const newStudent = req.body;
    console.log("new student: ",newStudent);

    connection.query(
        `INSERT INTO students SET
            first_name = ?,
            middle_name = ?,
            last_name = ?,
            house = ?`,
        [
            newStudent.firstName,
            newStudent.middleName,
            newStudent.lastName,
            newStudent.house
        ],
        function(err,results,fields) {
            console.log("RESULTS:");
            console.log(results);
            console.log("FIELDS:");
            console.log(fields);
            res.end();
        }

    )

//    res.json(students);
})