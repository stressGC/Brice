const axios = require('axios');

const { PHANTOMBUSTER_API_KEY, PHANTOMBUSTER_AGENT_ID } = process.env;

const options = { 
  headers: {
    'X-Phantombuster-Key-1': PHANTOMBUSTER_API_KEY,
  }
};

const URL = `https://phantombuster.com/api/v1/agent/${PHANTOMBUSTER_AGENT_ID}/launch?output=result-object-with-output`;


module.exports = axios.post(URL, {}, options);