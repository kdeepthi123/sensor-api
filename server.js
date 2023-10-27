// const express = require('express')
// const mongoose = require('mongoose');
// const app = express()
// const port = 3000
// const GSR = require('./models/gsrmodel')

// app.use(express.json())
// const mongoURI = 'mongodb://localhost:27017/sensor_data';



// //routes declaration
// app.get('/', (req, res) => {
//   res.send('Hello World!')
// })

// app.get('/data', (req, res) => {
//   res.send('Hello Data New Change!')
// })

// app.post('/readings', async(req, res) => {
  

//   try {
//       const gsr = await GSR.create(req.body)
//       res.status(200).json(gsr);
      
//   } catch (error) {
//       console.log(error.message);
//       res.status(500).json({message: error.message})
//   }
// })

// mongoose.connect(mongoURI, {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
// });

// app.js

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const SensorData = require('./models/gsrmodel');

const app = express();
app.use(bodyParser.json());

// Connect to MongoDB (replace 'yourMongoDBURI' with your MongoDB URI)
mongoose.connect('mongodb://localhost:27017/sensor_data', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Define routes for your APIs
app.post('/api/sensor-data', async (req, res) => {
  try {
    const { gsrReadings, heartRateReadings } = req.body;
    console.log(req.body)
    const sensorData = new SensorData({ gsrReadings, heartRateReadings  });
    await sensorData.save();
    res.status(201).json(sensorData);
  } catch (error) {
    res.status(500).json({ error: 'Error saving sensor data' });
  }
});

app.get('/api/sensor-data', async (req, res) => {
  try {
    const data = await SensorData.find();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: 'Error retrieving sensor data' });
  }
});

app.get('/api/sensor-data/:id', async (req, res) => {
  try {
    const data = await SensorData.findById(req.params.id);
    if (!data) {
      return res.status(404).json({ error: 'Data not found' });
    }
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: 'Error retrieving sensor data by ID' });
  }
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
