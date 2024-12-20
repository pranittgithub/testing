const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const XLSX = require('xlsx');
const bcrypt = require('bcrypt'); // Import bcrypt for password hashing

const app = express();
app.use(bodyParser.json());

// Path to the Excel file
const FILE_PATH = './users.xlsx';

// Function to read data from the Excel file
function readExcelFile() {
    if (!fs.existsSync(FILE_PATH)) {
        // Create a new Excel file if it doesn't exist
        const workbook = XLSX.utils.book_new();
        const worksheet = XLSX.utils.json_to_sheet([]);
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Users');
        XLSX.writeFile(workbook, FILE_PATH);
    }
    const workbook = XLSX.readFile(FILE_PATH);
    const sheet = workbook.Sheets['Users'];
    return XLSX.utils.sheet_to_json(sheet);
}

// Function to write data to the Excel file
function writeExcelFile(data) {
    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.json_to_sheet(data);
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Users');
    XLSX.writeFile(workbook, FILE_PATH);
}

// Endpoint for user signup
app.post('/signup', async (req, res) => {
    const { username, password } = req.body;
    const users = readExcelFile();

    // Check if the username already exists
    if (users.find(user => user.username === username)) {
        return res.status(400).json({ message: 'Username already exists' });
    }

    // Hash the password before saving
    const hashedPassword = await bcrypt.hash(password, 10);

    // Add the new user with the hashed password
    users.push({ username, password: hashedPassword });
    writeExcelFile(users);

    res.json({ message: 'Signup successful' });
});

// Endpoint for user login
app.post('/login', async (req, res) => {
    const { username, password } = req.body;
    const users = readExcelFile();

    // Find the user by username
    const user = users.find(user => user.username === username);
    if (!user) {
        return res.status(400).json({ message: 'Invalid username or password' });
    }

    // Compare the provided password with the hashed password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (isPasswordValid) {
        res.json({ message: 'Login successful' });
    } else {
        res.status(400).json({ message: 'Invalid username or password' });
    }
});

// Start the server
app.listen(3000, () => {
    console.log('Server running on http://localhost:3000');
    console.log(`Excel file path: ${FILE_PATH}`);
});
