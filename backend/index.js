require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const connectDB = require('./config/db');

const app = express();
const PORT = process.env.PORT || 4000;

// Connect DB
connectDB();

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/posts', require('./routes/posts'));
app.use('/api/comments', require('./routes/comments'));
app.use('/api/tags', require('./routes/tags'));
app.use('/api/search', require('./routes/search'));
app.use('/api/profile', require('./routes/profile'));

app.get('/', (req, res) => res.send({ok:true, message: 'Blog API running'}));

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
