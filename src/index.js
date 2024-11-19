const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const { WebUntis } = require('webuntis');

const app = express();

function getMondayAndFridayOfThisWeek() {
    const today = new Date();
    const dayOfWeek = today.getDay(); // 0 = Sonntag, 1 = Montag, ..., 6 = Samstag

    // Berechne das Datum für den Montag dieser Woche
    const monday = new Date(today);
    monday.setDate(today.getDate() - (dayOfWeek - 1));

    // Berechne das Datum für den Freitag dieser Woche
    const friday = new Date(monday);
    friday.setDate(monday.getDate() + 4);

    return { monday, friday };
}

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Template-Engine und Views-Ordner konfigurieren
app.set('view engine', 'ejs'); // Beispiel mit EJS
app.set('views', path.join(__dirname, 'views')); // Ordner anpassen

// Route definieren
app.get('/', (req, res) => {
    res.render('index', { title: 'Willkommen', message: 'Hello, Node.js!' });
});

// setze alle cookies von login
app.post('/login', (req, res) => {
    const { server, school, username, password } = req.body;
    res.cookie('server', server);
    res.cookie('school', school);
    res.cookie('username', username);
    res.cookie('password', password);
    res.redirect('/timetable');
});

app.get('/timetable', async (req, res) => {
    try {
        const { monday, friday } = getMondayAndFridayOfThisWeek();
        const server = req.cookies.server;
        const school = req.cookies.school;
        const username = req.cookies.username;
        const password = req.cookies.password;

        if (!server || !school || !username || !password) {
            return res.status(400).redirect('/login');
        }

        const untis = new WebUntis(school, username, password, server);

        await untis.login();
        const timetable = await untis.getOwnTimetableForRange(monday, friday);

        // Render die EJS-Vorlage mit Stundenplan-Daten
        res.render('timetable', { timetable, monday, friday });
    } catch (error) {
        console.error(error);
        res.status(500).send('Ein Fehler ist aufgetreten.');
    }
});

app.get('/login', (req, res) => {
    res.render('login');
});

// Static-Files bereitstellen
app.use('/static', express.static(path.join(__dirname, 'static')));

// Server starten
app.listen(3000, () => {
    console.log('Server läuft auf http://localhost:3000');
});
