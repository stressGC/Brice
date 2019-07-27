const extractAreasData = ({ data }) => {
  if (data.status !== 'success' /*|| data.data.exitCode !== 0*/) throw new Error('An error occured during the execution of the script');

  console.log(`>> SCRAPPING FINISHED IN ${data.data.executionTime} SECS.`);
  // console.log(data.data.resultObject);
  
  const { areas } = data.data.resultObject;
  console.log(`>> {${areas.length}} areas found`);
  return areas;
};

module.exports = extractAreasData;