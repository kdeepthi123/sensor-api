const express = require('express');
const bodyParser = require('body-parser');
const nano = require('nano')('http://admin:mysecretpassword@68.180.95.222:5984'); // Replace adminusername and adminpassword with your CouchDB admin credentials
const dbName = 'sensordata'; // Replace with your CouchDB database name
const db = nano.use(dbName);

const app = express();
app.use(bodyParser.json());

app.post('/api/sensor-data', async (req, res) => {
  try {
    const { gsrReadings, heartRateReadings} = req.body;
    const data = {
      gsrReadings,
      heartRateReadings
    }
    db.insert(data, null, (err, body) => {
      if (err) {
        res.status(500).json({ error: 'Error saving sensor data' });
      } else {
        res.status(201).json(body);
      }
    });
  } catch (error) {
    res.status(500).json({ error: 'Error saving sensor data' });
  }
});

app.get('/api/sensor-data', async (req, res) => {
  try {
    db.list({ include_docs: true }, (err, body) => {
      if (err) {
        res.status(500).json({ error: 'Error retrieving sensor data' });
      } else {
        const data = body.rows.map(row => row.doc);
        res.json(data);
      }
    });
  } catch (error) {
    res.status(500).json({ error: 'Error retrieving sensor data' });
  }
});

app.get('/api/sensor-data/:id', async (req, res) => {
  try {
    const { id } = req.params;
    db.get(id, (err, body) => {
      if (err) {
        res.status(404).json({ error: 'Data not found' });
      } else {
        res.json(body);
      }
    });
  } catch (error) {
    res.status(500).json({ error: 'Error retrieving sensor data by ID' });
  }
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
