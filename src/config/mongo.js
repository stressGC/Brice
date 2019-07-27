require('dotenv').config();

const { MONGO_HOST, MONGO_PORT, MONGO_DATABASE } = process.env;

const MONGO_OPTIONS = {
  mongoURI: `mongodb://${MONGO_HOST}:${MONGO_PORT}/${MONGO_DATABASE}`,  
  mongoOptions: {
    autoReconnect: true,
    reconnectTries: 1000000,
    reconnectInterval: 3000,
    useNewUrlParser: true,
  },
};

module.exports = MONGO_OPTIONS;  
