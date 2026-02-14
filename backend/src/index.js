const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
dotenv.config();

const authRoutes = require('./routes/auth');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('uploads'));

app.use('/api/v1/auth', authRoutes);
const documentRoutes = require('./routes/documents');
app.use('/api/v1/documents', documentRoutes);
const studyRoutes = require('./routes/study');
app.use('/api/v1/study', studyRoutes);
const musicRoutes = require('./routes/music');
app.use('/api/v1/music', musicRoutes);
const aiRoutes = require('./routes/ai');
app.use('/api/v1/ai', aiRoutes);

app.get('/', (req, res) => {
    res.json({ message: 'Welcome to Brainlyx API (Node.js)' });
});

const AppDataSource = require('./data-source');

AppDataSource.initialize()
    .then(() => {
        console.log('Data Source has been initialized!');
        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    })
    .catch((err) => {
        console.error('Error during Data Source initialization', err);
    });
