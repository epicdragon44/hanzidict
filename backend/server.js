// Create express app
var express = require("express");
var app = express();
var db = require("./database.js");

const cors = require("cors");
app.use(cors());

// Server port
var HTTP_PORT = 8000;
// Start server
app.listen(HTTP_PORT, () => {
    console.log("Server running on port %PORT%".replace("%PORT%", HTTP_PORT));
});

// Root endpoint
app.get("/", (req, res, next) => {
    res.json({ message: "Ok" });
});

// Endpoint: Get the entire table
app.get("/api/hantable", (req, res, next) => {
    var sql = "select * from hantable";
    var params = [];
    db.all(sql, params, (err, rows) => {
        if (err) {
            res.status(400).json({ error: err.message });
            return;
        }
        res.json({
            message: "success",
            data: rows,
        });
    });
});

// Endpoint: Get all characters from the entire table
app.get("/api/hantable/chars", (req, res, next) => {
    var sql = "select hanchar from hantable";
    var params = [];
    db.all(sql, params, (err, rows) => {
        if (err) {
            res.status(400).json({ error: err.message });
            return;
        }

        let chars = new Set();
        for (let i = 0; i < rows.length; i++) {
            chars.add(rows[i].hanchar);
        }

        res.json({
            message: "success",
            data: Array.from(chars),
        });
    });
});

// Endpoint: Get all radicals from the entire table
app.get("/api/hantable/rads", (req, res, next) => {
    var sql = "select hanrad from hantable";
    var params = [];
    db.all(sql, params, (err, rows) => {
        if (err) {
            res.status(400).json({ error: err.message });
            return;
        }

        let radicals = new Set();
        for (let i = 0; i < rows.length; i++) {
            radicals.add(rows[i].hanrad);
        }

        res.json({
            message: "success",
            data: Array.from(radicals),
        });
    });
});

// Endpoint: Get all radicals for a specified character
app.get("/api/hantable/char/:hanchar", (req, res, next) => {
    var sql = "select hanrad from hantable where hanchar = ?";
    var params = [req.params.hanchar];
    db.all(sql, params, (err, rows) => {
        if (err) {
            res.status(400).json({ error: err.message });
            return;
        }

        let radicals = new Set();
        for (let i = 0; i < rows.length; i++) {
            radicals.add(rows[i].hanrad);
        }

        res.json({
            message: "success",
            data: Array.from(radicals),
        });
    });
});

// Endpoint: Get all characters that contain a specified radical
app.get("/api/hantable/rad/:hanrad", (req, res, next) => {
    var sql = "select hanchar from hantable where hanrad = ?";
    var params = [req.params.hanrad];
    db.all(sql, params, (err, rows) => {
        if (err) {
            res.status(400).json({ error: err.message });
            return;
        }

        let chars = new Set();
        for (let i = 0; i < rows.length; i++) {
            chars.add(rows[i].hanchar);
        }

        res.json({
            message: "success",
            data: Array.from(chars),
        });
    });
});

// Default response for any other request
app.use(function (req, res) {
    res.status(404);
});
