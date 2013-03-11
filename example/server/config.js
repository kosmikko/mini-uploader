var config = require('nconf');
config.argv()
     .env()
     .file({file: 'app.config.json'});

module.exports = config;
