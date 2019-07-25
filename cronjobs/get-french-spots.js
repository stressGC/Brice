const axios = require('axios');
require('dotenv').config();

const { PHANTOMBUSTER_API_KEY, PHANTOMBUSTER_AGENT_ID } = process.env;

const printErrorAndExit = (error) => {
  console.log(error);
  process.exit(1);
};

const main = () => {
  const options = {
    headers: {
    'X-Phantombuster-Key-1': PHANTOMBUSTER_API_KEY,
    }
  };

  const URL = `https://phantombuster.com/api/v1/agent/${PHANTOMBUSTER_AGENT_ID}/launch`;
  
  axios.post(URL, {}, options)
    .then(({ data }) => {
      if (data.status !== 'success') throw new Error('Response is not formatted as expected');

      console.log(data);
    })
    .catch(printErrorAndExit);
};

main();

