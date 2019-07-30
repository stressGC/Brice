const mongoose = require('mongoose');
const data = require('./fakeAreas');
const Area = require('../../../src/models/Area');
const Spot = require('../../../src/models/Spot');
require('dotenv').config();

const MONGO_URI = `mongodb://${process.env.MONGO_HOST}:${process.env.MONGO_PORT}/${process.env.MONGO_DB}`;
const MONGO_OPTIONS = {
  useNewUrlParser: true,
};

const insertSpots = ({ spots }) => Spot.collection.insertMany(spots, { ordered: true });

const insertArea = (area) => 
  new Promise((resolve, reject) => {
    insertSpots(area)
    .then(({ insertedIds, result }) => {
      if (result.ok !== 1 || result.n !== area.spots.length) throw new Error('An error occured while inserting to mongo');
      // console.log('insertedIds', insertedIds);
      const spotsIDs = { spots: insertedIds };
      const newArea = { ...area, ...spotsIDs };
      // console.log(newArea);
      Area.collection.insertOne(newArea, (res) => {
        console.log("Area inserted ?", res);
        resolve(insertedIds);
      });
    });
    // .catch(e => reject(e));
  });

const saveAreasToMongo = async (areas) => {
  await mongoose.connect(MONGO_URI, MONGO_OPTIONS);
  // const res = await Area.collection.insertMany(areas);
  const promisesArray = areas.map(area => insertArea(area));
  const res = await Promise.all(promisesArray);
  console.log("!!", res);
};

const main = async () => {
  const { areas } = data;
  // console.log(areas)
  try {
    const result = await saveAreasToMongo(areas);
    process.exit(0);
  } catch (err) {
    console.log("err", err);
    process.exit(1);
  }
};

main();