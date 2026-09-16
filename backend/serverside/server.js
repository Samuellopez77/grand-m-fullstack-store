/* ===== the address of this server connected to the network is
 URL-> http://localhost:3000
 IP-> localhost:3000 ===== */
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const path = require('path');
const express = require('express');
const app = express();
const PORT = 3000;

app.use(express.json());
mongoose.connect('mongodb://127.0.0.1:27017/Grand_m_users')
.then(() => { console.log('Connected to MongoDB'); })
.catch((err) => { console.error('Failed to connect to MongoDB', err); });
/* === HTTP VERBS TESTING === */
// the get and use request
app.use(express.static(path.join(__dirname, '../../frontend')));
app.get('/signup', (req, res) => {
    res.sendFile(path.join(__dirname, '../../frontend/signup-page.html/'));
});
app.listen(PORT, () => {console.log(`Server is running on http://localhost:${PORT}`);});