/*
Tjek/aftjek de forskellige ting som er gjort
*/

let mysql = require('mysql'); // Requiring the module 'mysql'
let morgan = require('morgan'); // Requiring the module 'morgan'
let express = require('express'); // Requiring the module 'express'
let app = new express(); // Creating a new instance of the express module

app.use(express.static('public')); // Serve the html pages to the client
app.use(morgan('dev')); // Log http requests

// --
let connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    pass: "",
    database: "calender"
});

connection.connect((connectError) => {
    console.log( connectError ? connectError : `Connected to database succesfully`);
});

app.get(`/db/getActivities`, (req, res) => {
    if(checkParams(["day", "month"], req)) {
        connection.query(`SELECT * FROM activities WHERE day = ${req.query["day"]} AND month = ${req.query["month"]}`, (queryError, queryResult) => {
            if(queryError) {
                console.log(queryError);
                res.end();
            } else {
                res.send(queryResult);
                res.end();
            }
        });
    } else {
        res.end();
    }
});



app.get(`/db/removeActivity`, (req, res) => {
    if(checkParams(["id"], req)) {
        connection.query(`DELETE FROM activities WHERE id=${req.query["id"]}`, (queryError, queryResult) => {
            if(queryError) {
                console.log(queryError);
                res.end();
            } else {
                res.end();
            }
        });
    } else {
        res.end();
    }
});

app.get(`/db/addActivity`, (req, res) => {
    if(checkParams(["day", "month", "time", "message"], req)) {
        connection.query(`INSERT INTO activities (day, month, time, activity) VALUES (${req.query["day"]}, ${req.query["month"]}, "${req.query["time"]}", "${req.query["message"]}")`, (queryError, queryResult) => {
            if(queryError) {
                console.log(queryError);
                res.end();
            } else {
                res.end();
            }
        });
    } else {
        res.end();
    }
});

function checkParams(params, req){
    let allowed = true;
    for(param of params) {
        if(req.query[param] == undefined || req.query[param] == "" || req.query[param] == 0) {
            allowed = false;
        }
    }
    return allowed;
}

app.listen(3000, (err) => { // Listen on port 3000
    console.log( err ? err : `Listening on port 3000` );
});