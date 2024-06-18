const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');

const app = express();

// Middleware to parse the request body
app.use(bodyParser.urlencoded({ extended: true }));

// Set EJS as templating engine
app.set('view engine', 'ejs');

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

app.get('/', (req, res) => {
    const selec = "SELECT * FROM residentes_aire";
    connection.query(selec, (error, results) => {
        if (error) {
            console.error('Error querying residentes_aire:', error);
            res.status(500).send('Error retrieving data');
            return;
        }
        console.log("teste", results);
        if (results.length > 0) {
            const resident = results[0];
            const idResidente = resident.Id_residente;
            console.log("id_residente:", idResidente);
            res.render('index', { results, idResidente });
        } else {
            res.render('index', { results, idResidente: null });
        }
    });
});

// Route to render the form with route parameter
app.get('/new-cita/:idResidente', (req, res) => {
    const idResidente = req.params.idResidente;
    console.log("idResidente:", idResidente);
    res.render('new_cita', { idResidente });
});

// Route to handle form submission
app.post('/reserve_cita', (req, res) => {
    const { idResidente, date, hour } = req.body;

    const insertCita = `INSERT INTO cita_dni_res (id_residente, fecha_cita_res, hora_cita_res) VALUES (?, ?, ?)`;
    connection.query(insertCita, [2, date, hour], (error, results) => {
        if (error) {
            console.error('Error inserting cita_dni_res:', error);
            res.status(500).send('Error reserving appointment');
            return;
        }
        console.log("Cita reservada:", results);
        console.log(`Cita reservada para el ${date} a las ${hour}, ${idResidente}`);
        res.send(`Cita reservada para el ${date} a las ${hour}, ${idResidente}`);
    });
     

    // For testing purposes, send a response immediately
    res.send(`Cita reservada para el ${date} a las ${hour}`);
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});


/* const express = require('express');
const mysql = require('mysql');

const app = express();

// Set EJS as templating engine
app.set('view engine', 'ejs');

const connection = mysql.createConnection({
    host: "localhost",
    port: "3309",
    user: "rafaelcoelho",
    //password: "123456", // Uncomment and add your password
    database: "consulado"
});

connection.connect((err) => {
    if (err) {
        console.error('Error connecting to the database:', err);
        return;
    }
    console.log('Connected to the MySQL server.');
});

app.get('/', (req, res) => {
    const selectQuery = "SELECT * FROM cita_urgente";
    connection.query(selectQuery, (error, results) => {
        if (error) {
            console.error('Error executing query:', error);
            res.status(500).send('Error executing query');
            return;
        }

        // Format the date before passing to the template
        results = results.map(result => {
            if (result.fecha_cita_no_res) {
                const date = new Date(result.fecha_cita_no_res);
                const data = date.toLocaleDateString()
                const splice = data.split('/')
                const day = splice[0].toString().padStart(2, "0")
                const month = splice[1]
                const year = splice[2]
                const fullDate = `${year}/${month}/${day}`
                //result.formattedDate = date.toLocaleDateString();
                //console.log(`teste ${fullDate}`)
            } else {
                result.formattedDate = 'N/A';
            }
            return result;
        });

        res.render('index', { citas: results }); // Render the index.ejs view with the data
    });
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});
 */

/* 
const express = require('express');
const mysql = require('mysql');

const app = express();

// Set EJS as templating engine
app.set('view engine', 'ejs');

const connection = mysql.createConnection({
    host: "localhost",
    port: "3309",
    user: "rafaelcoelho",
    //password: "123456", // Uncomment and add your password
    database: "consulado"
});

connection.connect((err) => {
    if (err) {
        console.error('Error connecting to the database:', err);
        return;
    }
    console.log('Connected to the MySQL server.');
});


app.get('/', (req, res) => {
    const selectQuery = "SELECT * FROM cita_urgente";
    connection.query(selectQuery, (error, results) => {
        if (error) {
            console.error('Error executing query:', error);
            res.status(500).send('Error executing query');
            return;
        }

        // Format the date before passing to the template
        results = results.map(result => {
            if (result.fecha_cita_no_res) {
                const date = new Date(result.fecha_cita_no_res);
                const formattedDate = date.toISOString().split('T')[0]; // Format as YYYY-MM-DD
                result.formattedDate = formattedDate;
                console.log(formattedDate)
            } else {
                result.formattedDate = 'N/A';
            }
            return result;
        });

        res.render('index', { citas: results }); // Render the index.ejs view with the data
    });
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});
 */




/* const selectQuery = "SELECT * FROM cita_urgente";
    connection.query(selectQuery, (error, results) => {
        if (error) {
            console.error('Error executing query:', error);
            res.status(500).send('Error executing query');
            return;
        }

        // Format the date before passing to the template
        results = results.map(result => {
            if (result.fecha_cita_no_res) {
                const date = new Date(result.fecha_cita_no_res);
                const formattedDate = date.toISOString().split('T')[0]; // Format as YYYY-MM-DD
                result.formattedDate = formattedDate;
            } else {
                result.formattedDate = 'N/A';
            }
            return result;
        });

        res.render('index', { citas: results }); // Render the index.ejs view with the data
    }); */


    // Route to handle form submission
    /*
 app.post('/new-cita', (req, res) => {
    const { tipo_ciutadano, fecha_cita_no_res, hora_cita_no_res, motivo_cita, n_denuncia, id_no_res, id_residente } = req.body;

    const insertQuery = `
        INSERT INTO cita_urgente (tipo_ciutadano, fecha_cita_no_res, hora_cita_no_res, motivo_cita, n_denuncia, id_no_res, id_residente)
        VALUES (?, ?, ?, ?, ?, ?, ?)
    `;
    connection.query(insertQuery, [tipo_ciutadano, fecha_cita_no_res, hora_cita_no_res, motivo_cita, n_denuncia, id_no_res, id_residente], (error, results) => {
        if (error) {
            console.error('Error executing query:', error);
            res.status(500).send('Error executing query');
            return;
        }
        res.redirect('/');
    });
});*/
