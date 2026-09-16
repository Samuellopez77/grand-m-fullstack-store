/* ===== the address of this server connected to the network is
 URL-> http://localhost:3000
 IP-> localhost:3000 ===== */
const mongoose = require('mongoose');
const path = require('path');
const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;
const frontendDist = path.resolve(__dirname, '../../frontend/dist');

app.use(express.json());
mongoose.connect('mongodb://127.0.0.1:27017/Grand_m_users')
.then(() => { console.log('Connected to MongoDB'); })
.catch((err) => { console.error('Failed to connect to MongoDB', err); });
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok' });
});

app.use(express.static(frontendDist));
app.get('/{*splat}', (req, res) => {
    res.sendFile(path.join(frontendDist, 'index.html'));
});
app.listen(PORT, () => {console.log(`Server is running on http://localhost:${PORT}`);});
