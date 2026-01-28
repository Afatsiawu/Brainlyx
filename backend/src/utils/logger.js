const fs = require('fs');
const path = require('path');

const logFile = path.join(__dirname, '../../debug.log');

const log = (message) => {
    const timestamp = new Date().toISOString();
    const entry = `[${timestamp}] ${message}\n`;
    console.log(entry);
    fs.appendFileSync(logFile, entry);
};

const error = (message, err) => {
    const timestamp = new Date().toISOString();
    const stack = err ? `\nStack: ${err.stack}` : '';
    const entry = `[${timestamp}] ERROR: ${message}${stack}\n`;
    console.error(entry);
    fs.appendFileSync(logFile, entry);
}

module.exports = { log, error };
