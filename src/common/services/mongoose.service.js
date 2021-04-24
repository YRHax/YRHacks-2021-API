const mongodb_uri = require('../config/env.config').mongodb_uri;
const mongoose = require('mongoose');
let count = 0;

const options = {
    autoIndex: false, // Don't build indexes
    poolSize: 10, // Maintain up to 10 socket connections
    // If not connected, return errors immediately rather than waiting for reconnect
    bufferMaxEntries: 0,
    // all other approaches are now deprecated by MongoDB:
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: true,
};

const connectWithRetry = () => {
    console.log('Attempting to establish MongoDB connection...');
    mongoose.connect(mongodb_uri, options).then(() => {
        console.log('MongoDB is connected!');
    }).catch(() => {
        console.log('MongoDB connection unsuccessful, retrying after 5 seconds. ', ++count);
        setTimeout(connectWithRetry, 5000);
    });
};

connectWithRetry();

module.exports.mongoose = mongoose;