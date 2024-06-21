// server.ts
import express, { Request, Response } from 'express';
import bodyParser from 'body-parser';
import fs from 'fs';
import { Submission } from './interface'; // Import the Submission interface

const app = express();
const port = 3000;
const dbFilePath = './db.json'; // Path to db.json file

// Middleware to parse JSON bodies
app.use(bodyParser.json());

// Endpoint to receive form submissions
app.post('/api/submit', (req: Request, res: Response) => {
    const submission: Submission = req.body; // Type assertion to Submission interface

    // Read existing submissions from file
    let submissions: Submission[] = [];
    try {
        const submissionsData = fs.readFileSync(dbFilePath, 'utf8');
        submissions = JSON.parse(submissionsData);
    } catch (err) {
        console.error('Error reading db file:', err);
    }

    // Add new submission
    submissions.push(submission);

    // Write updated submissions back to file
    try {
        fs.writeFileSync(dbFilePath, JSON.stringify(submissions, null, 2), 'utf8');
        console.log('Submission saved to db file:', submission);
        res.json({ message: 'Submission received successfully' });
    } catch (err) {
        console.error('Error writing db file:', err);
        res.status(500).json({ error: 'Failed to save submission' });
    }
});

// Endpoint to get all submissions
app.get('/api/submissions', (req: Request, res: Response) => {
    // Read submissions from file and return
    try {
        const submissionsData = fs.readFileSync(dbFilePath, 'utf8');
        const submissions: Submission[] = JSON.parse(submissionsData);
        res.json(submissions);
    } catch (err) {
        console.error('Error reading db file:', err);
        res.status(500).json({ error: 'Failed to fetch submissions' });
    }
});

// Endpoint for ping
app.get('/ping', (req: Request, res: Response) => {
    res.json(true); // Always return true for GET requests to /ping
});

// Endpoint to read a specific submission by index
app.get('/read', (req: Request, res: Response) => {
    const index = Number(req.query.index); // Read index from query parameter and convert to number

    try {
        const submissionsData = fs.readFileSync(dbFilePath, 'utf8');
        const submissions: Submission[] = JSON.parse(submissionsData);

        if (index >= 0 && index < submissions.length) {
            const submission = submissions[index];
            res.json(submission);
        } else {
            res.status(404).json({ error: 'Submission not found' });
        }
    } catch (err) {
        console.error('Error reading db file:', err);
        res.status(500).json({ error: 'Failed to read submission' });
    }
});


// Endpoint to search for a submission by email
app.get('/api/search', (req: Request, res: Response) => {
    const email = req.query.email as string; // Read email from query parameter

    try {
        const submissionsData = fs.readFileSync(dbFilePath, 'utf8');
        const submissions: Submission[] = JSON.parse(submissionsData);

        // Find the submission that matches the email
        const submission = submissions.find(sub => sub.email === email);

        if (submission) {
            res.json(submission);
        } else {
            res.status(404).json({ error: 'Submission not found' });
        }
    } catch (err) {
        console.error('Error reading db file:', err);
        res.status(500).json({ error: 'Failed to search submission' });
    }
});


app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});

