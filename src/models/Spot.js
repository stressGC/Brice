const mongoose = require('mongoose');

/**
 *  "id": 1548,
                    "country": "fr",
                    "name": "Dielette",
                    "description": "",
                    "lat": 49.5602,
                    "lon": -1.8618,
                    "surfAreaId": 26,
                    "url": "/Dielette-Surf-Report/1548/",
                    "hasNetcam": false
 */
const spotSchema = new mongoose.Schema({
  mswID: {
    type: Number,
    index: { unique: true, dropUps: true }, 
    required: true,
  },
  mswAreaID: {
    type: Number,
    required: true,
  },
  url: {
    type: String,
    required: true,
  },
  hasNetcam: Boolean,
  country: {
    type: String,
    require: true,
  },
  name: {
    type: String,
    required: true,
  },
  description: String,
  lat: {
    type: Number,
    required: true,
  },
  lon: {
    type: Number,
    required: true,
  },
}, {
  collection: 'spots',
});

module.exports = mongoose.model('Spot', spotSchema);
