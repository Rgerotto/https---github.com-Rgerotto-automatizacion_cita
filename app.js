
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

app.get('/', (req, res) => {
    res.render('indexUser')
})
app.get('/loginRes', (req, res) => {
    res.render('loginRes', { error: null, classError: '' });
})

/* LOGIN DE USUARIO */

app.post('/loginRes', (req, res) => {
    //Obtener datos desde el body
    const email = req.body.email;
    const password = req.body.password;
    console.log(email, password)
    //Si no se proporcionan el mail o la contraseña devolver un mensaje de error
    if (!email || !password) {
        return res.render('loginRes', { error: 'Todos los campos son obligatorios', classError: 'error' });
    }

    //Si se proporciona todo verificar si existe el usuario
    connection.query('SELECT * FROM residentes_aire WHERE email_res = ?', [email], async (err, result) => {
        if (err) {
            console.error('Error en la consulta a la base de datos:', err);
            return res.status(500).render('loginRes', { error: 'Error en el servidor', classError: 'error' });
        }
        //si no existe devolver un mensaje de usuario no encontrado
        if (result.length === 0) {
            //console.log("Usuario no encontrado");
            return res.render('loginRes', { error: 'Usuario o contraseña incorrectos', classError: 'error' });
        }
        //Guardar el primer usuario encontrado en una variable
        const user = result[0];
        console.log("Usuario encontrado:", user);

        // Comparar la contraseña proporcionada con la almacenada en la base de datos
        if (password !== user.password_res) {
            console.log("Contraseña incorrecta");
            return res.render('loginRes', { error: 'Usuario o contraseña incorrectos', classError: 'error' });
        }

        // Si las credenciales son válidas, generar token JWT y configurar las caracteristicas
        const idUser = user.id_residente;
        const token = jwt.sign({ id: idUser }, process.env.JWT_SECRETO, { expiresIn: process.env.JWT_TIEMPO_EXPIRE });
        //Configurar la cookies
        const cookiesOptions = {
            expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRES * 24 * 60 * 60 * 1000),
            httpOnly: true
        };

        //proporcionar la cookiec, primer parametro: nombre cookie, segundo: el token generado, tercero: la caracteristicas de la cookie
        res.cookie('jwt', token, cookiesOptions);

        // acceder a la página inicial del perfil de usuario
        res.render('mainUserAire', { user });

    });
});


/* RUTA PARA MOSTRAR DATOS DE USUARIO*/
app.get('/user/:id', (req, res) => {
    const idUser = req.params.id;
    const selectUser = `SELECT * FROM residentes_aire WHERE id_residente = ${idUser}`;
    connection.query(selectUser, (err, result) => {
        if (err) {
            console.error('Error en la consulta a la base de datos:', err);
            return res.status(500).render('loginRes', { error: 'Error en el servidor', classError: 'error' });
        }
        if (result.length === 0) {
            console.log("Usuario no encontrado");
            return res.render('loginRes', { error: 'Usuario o contraseña incorrectos', classError: 'error' });
        }
        const user = result[0];
        console.log("Usuario encontrado:", user);
        res.render('userDates', { user: user });
    })
})

// Route to render the form with route parameter
app.get('/calendario', (req, res) => {
    res.render('calendarioAuto');
});

// Rota para buscar horas disponíveis
app.get('/available-hours', (req, res) => {
    const {date, hour} = req.query;
    console.log("date from get:", date)
    const query = `
        SELECT hora_cita_res 
        FROM cita_dni_res 
        WHERE fecha_cita_res = ?`;
    
    connection.query(query, [date], (error, results) => {
        if (error) {
            console.error('Error fetching available hours:', error);
            res.status(500).send('Error fetching available hours');
            return;
        }

        const reservedHours = results.map(result => result.hora_cita_res);
        const allHours = ["09:00", "10:00", "11:00", "12:00", "13:00", "14:00"];
        const availableHours = allHours.filter(hour => !reservedHours.includes(hour));
        
        res.json(availableHours);
    });
});


// Route to handle form submission
app.post('/reserve_cita', (req, res) => {
    const { date, hour } = req.body;
    console.log("date from serve:", date)
    /* const parsedDate = new Date(date);
    const formattedDate = parsedDate.toISOString().split('T')[0];
    console.log("app.post", formattedDate) */
    const insertCita = `INSERT INTO cita_dni_res (id_residente, fecha_cita_res, hora_cita_res) VALUES (?, ?, ?)`;
    connection.query(insertCita, [2, date, hour], (error, results) => {
        if (error) {
            console.error('Error inserting cita_dni_res:', error);
            if (!res.headersSent) {
                res.status(500).send('Error reserving appointment');
            }
            return;
        }
        console.log(`Cita reservada para el ${date} a las ${hour}`);
        if (!res.headersSent) {
            res.send(`Cita reservada para el ${date} a las ${hour}`);
        }
    });
});


const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});