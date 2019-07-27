const axios = require('axios');
const mongoose = require('mongoose');
const MONGO_OPTIONS = require('../../src/config/mongo');
require('dotenv').config();

const { PHANTOMBUSTER_API_KEY, PHANTOMBUSTER_AGENT_ID } = process.env;

const printErrorAndExit = (error) => {
  console.log(">> ERROR:", error);
  process.exit(1);
};

const main = () => {
  const options = {
    headers: {
      'X-Phantombuster-Key-1': PHANTOMBUSTER_API_KEY,
    }
  };

  const URL = `https://phantombuster.com/api/v1/agent/${PHANTOMBUSTER_AGENT_ID}/launch?output=result-object-with-output`;
  console.log(">> SCRAPPING STARTED");
  axios.post(URL, {}, options)
    .then(({ data }) => {
      if (data.status !== 'success' /*|| data.data.exitCode !== 0*/) throw new Error('An error occured during the execution of the script');

      console.log(`>> SCRAPPING FINISHED IN ${data.data.executionTime} SECS.`);
      // console.log(data.data.resultObject);
      const { areas } = data.data.resultObject;
      console.log(`>> {${areas.length}} areas found`);
      // TODO: area schema
      // TODO: areas save
      // TODO: mongo connection init
      mongoose.connect(mongoURI, mongoOptions)
      .then(connection => {
        console.log("done", connection);
      })
      .catch(printErrorAndExit);
    })
    .catch(printErrorAndExit);
};

main();

