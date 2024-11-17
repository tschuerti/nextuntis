const express = require('express');
const path = require('path');

const app = express();

// Template-Engine und Views-Ordner konfigurieren
app.set('view engine', 'ejs'); // Beispiel mit EJS
app.set('views', path.join(__dirname, 'views')); // Ordner anpassen

// Route definieren
app.get('/', (req, res) => {
    res.render('index', { title: 'Willkommen', message: 'Hello, Node.js!' });
});

//render media folder in /media/
app.use('/media', express.static(path.join(__dirname, 'media')));

// Server starten
app.listen(3000, () => {
    console.log('Server läuft auf http://localhost:3000');
});
