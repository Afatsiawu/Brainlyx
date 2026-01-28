
try {
    fetch('https://google.com').then(res => {
        console.log('Fetch success:', res.status);
    }).catch(err => {
        console.error('Fetch error:', err);
    });
} catch (e) {
    console.error('Immediate error:', e);
}
