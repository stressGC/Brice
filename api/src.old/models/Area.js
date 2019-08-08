const mongoose = require('mongoose');

const areaSchema = new mongoose.Schema({
  name: { 
    type: String,
    index: { unique: true, dropUps: true }, 
    required: true, 
  },
  mswID: {
    type: Number,
    index: { unique: true, dropUps: true }, 
    required: true,
  },
  url: String,
  spots: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Spot' }],
}, {
  collection: 'areas',
});

module.exports = mongoose.model('Area', areaSchema);
