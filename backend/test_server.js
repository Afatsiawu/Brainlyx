const express = require('express');
const app = express();
const PORT = 3001;

app.get('/', (req, res) => {
    res.send('Test server running');
});

const server = app.listen(PORT, () => {
    console.log(`Test server running on port ${PORT}`);
});

server.on('close', () => {
    console.log('Test server closed');
});
