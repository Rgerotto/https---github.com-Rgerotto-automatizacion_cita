const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');

const app = express();

// Middleware to parse the request body
app.use(bodyParser.urlencoded({ extended: true }));

// Set EJS as templating engine
app.set('view engine', 'ejs');

// Middleware to serve static files
app.use(express.static('public'));

const connection = mysql.createConnection({
    host: "localhost",
    port: "3309",
    user: "rafaelcoelho",
    // password: "123456", // Uncomment and add your password
    database: "consulado"
});

connection.connect((err) => {
    if (err) {
        console.error('Error connecting to the database:', err);
        return;
    }
    console.log('Connected to the MySQL server.');
});

// Route for the home page
app.get('/', (req, res) => {
    res.render('indexUser');
});

// Route for the login page
app.get('/login', (req, res) => {
    res.render('loginRes');
});

// Handle login form submission
app.post('/login', (req, res) => {
    const { email, password } = req.body;
    // Here you should validate the user credentials from the database
    // For simplicity, let's assume we have a valid user
    const user = { id_residente: 1, nombre_res: 'John', apellido_res: 'Doe' };
    res.render('mainUserAire', { user });
});

// Route for the user main page
app.get('/mainUserAire', (req, res) => {
    const user = { id_residente: 1, nombre_res: 'John', apellido_res: 'Doe' };
    res.render('mainUserAire', { user });
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});
