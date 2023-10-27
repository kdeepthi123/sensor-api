const mongoose = require('mongoose')

const gsrSchema = mongoose.Schema({
  heartRateReadings: [
    {
      timestamp: Date,
      reading: Number,
    },
  ],
  gsrReadings: [
    {
      timestamp: Date,
      reading: Number,
    },
  ],
});

const SensorData = mongoose.model('GSR', gsrSchema);

module.exports = SensorData;
