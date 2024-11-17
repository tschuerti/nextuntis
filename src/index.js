const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const { WebUntis } = require('webuntis');

const app = express();

app.use(cookieParser());

// Template-Engine und Views-Ordner konfigurieren
app.set('view engine', 'ejs'); // Beispiel mit EJS
app.set('views', path.join(__dirname, 'views')); // Ordner anpassen

// Route definieren
app.get('/', (req, res) => {
    res.render('index', { title: 'Willkommen', message: 'Hello, Node.js!' });
});

// Route, um die URL-Variable `test` als Cookie zu setzen
app.get('/set-cookie', (req, res) => {
    const { server, school, username, password } = req.query;
    if (!server || !school || !username || !password) {
        return res.status(400).send('Missing connection data: Please enter server, school, username and password.');
    } else {
        res.cookie('server', server, { maxAge: 3600000, httpOnly: true });
        res.cookie('school', school, { maxAge: 3600000, httpOnly: true });
        res.cookie('username', username, { maxAge: 3600000, httpOnly: true });
        res.cookie('password', password, { maxAge: 3600000, httpOnly: true });
        res.send(`Connection data set: ${server}, ${school}, ${username}, ${password}`);
    }
});

// Static-Files bereitstellen
app.use('/static', express.static(path.join(__dirname, 'static')));

// Server starten
app.listen(3000, () => {
    console.log('Server läuft auf http://localhost:3000');
});
