const express = require('express');
const app = express();
const port = 4000;

const cors = require('cors');
app.use(cors());

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const mongoose = require('mongoose');

mongoose.connect('mongodb+srv://admin:user@car.bjz0r.mongodb.net/', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('Connected to MongoDB'))
.catch(err => console.error('MongoDB connection error:', err));

const carAdSchema = new mongoose.Schema({
  make: { type: String, required: true },
  model: { type: String, required: true },
  year: { type: Number, required: true },
  price: { type: Number, required: true },
  mileage: { type: Number },
  location: { type: String, required: true },
  description: { type: String },
  image: { type: String },
  postedBy: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

const CarAd = mongoose.model('CarAd', carAdSchema);

app.post('/api/ads', async (req, res) => {
  const { make, model, year, price, mileage, location, description, image, postedBy } = req.body;
  try {
    const newAd = new CarAd({ make, model, year, price, mileage, location, description, image, postedBy });
    await newAd.save();
    res.status(201).json({ message: 'Car ad added successfully', ad: newAd });
  } catch (error) {
    res.status(500).json({ message: 'Error adding car ad', error });
  }
});


app.get('/api/ads', async (req, res) => {
  try {
    const ads = await CarAd.find();
    res.status(200).json({ ads });
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving car ads', error });
  }
});

app.get('/api/ad/:id', async (req, res) => {
  try {
    const ad = await CarAd.findById(req.params.id);
    if (!ad) {
      return res.status(404).json({ message: 'Car ad not found' });
    }
    res.status(200).json(ad);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving car ad', error });
  }
});

app.delete('/api/ad/:id', async (req, res) => {
  try {
    const ad = await CarAd.findByIdAndDelete(req.params.id);
    if (!ad) {
      return res.status(404).json({ message: 'Car ad not found' });
    }
    res.status(200).json({ message: 'Car ad deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting car ad', error });
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});