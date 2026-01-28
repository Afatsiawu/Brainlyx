const promiseWithTimeout = (promise, ms, timeoutError = 'Operation timed out') => {
    let timeout = new Promise((_, reject) => {
        setTimeout(() => {
            reject(new Error(timeoutError));
        }, ms);
    });
    return Promise.race([promise, timeout]);
};

module.exports = { promiseWithTimeout };
