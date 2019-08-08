
const mongoose = require('mongoose');
const MONGO_OPTIONS = require('../../../src/config/mongo');
const extractAreasData = require('./extract-area-data');
const launchPhantombusterScript = require('./launch-phantombuster-script');
const { saveAreasToMongo } = require('./mongo-util');
require('dotenv').config();


const printErrorAndExit = (error) => {
  console.log(">> ERROR:", error);
  process.exit(1);
};

const main = () => {

  console.log(">> SCRAPPING STARTED");
  launchPhantombusterScript
    .then(extractAreasData)
    .then(areas => {
      console.log("areas ::", areas);
      return areas;
    })
    .then(saveAreasToMongo)
      // TODO: area schema
      // TODO: areas save
      // TODO: mongo connection init
      // mongoose.connect(mongoURI, mongoOptions)
      // .then(connection => {
      //   console.log("done", connection);
      // })
    .catch(printErrorAndExit);
};

main();

