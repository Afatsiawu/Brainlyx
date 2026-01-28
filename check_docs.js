const axios = require('axios');

async function checkDocs() {
    try {
        const response = await axios.get('http://localhost:3000/api/v1/documents');
        console.log(JSON.stringify(response.data, null, 2));
    } catch (error) {
        console.error('Error fetching documents:', error.message);
    }
}

checkDocs();
