const express = require('express');
const bodyParser = require('body-parser');

const app = express();
require('dotenv').config();

// Middleware
app.use(bodyParser.json());
app.use(express.json());

const authRoutes = require('./routes/authRoutes');

// app.get('/test', (req, res) => {
//     res.send('Hello World!');
// });

app.use('/api/auth', authRoutes);

const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
    console.log('Server listening on port 8080');
});