"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var body_parser_1 = require("body-parser");
var app = (0, express_1.default)();
var port = 3000;
// Middleware to parse JSON bodies
app.use(body_parser_1.default.json());
// In-memory store for form submissions (replace with database in real applications)
var submissions = [];
// Endpoint to receive form submissions
app.post('/api/submit', function (req, res) {
    var submission = req.body;
    submissions.push(submission);
    res.json({ message: 'Submission received successfully' });
});
// Endpoint to get all submissions
app.get('/api/submissions', function (req, res) {
    res.json(submissions);
});
app.listen(port, function () {
    console.log("Server is running on http://localhost:".concat(port));
});
