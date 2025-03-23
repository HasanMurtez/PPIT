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
mongoose.connect('mongodb+srv://user1:user1@cluster0.vrhww.mongodb.net/');

const carAdSchema = new mongoose.Schema({
  make: { type: String, required: true },
  model: { type: String, required: true },
  year: { type: Number, required: true },
  price: { type: Number, required: true },
  mileage: { type: Number },
  description: { type: String },
  image: { type: String },
  postedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  createdAt: { type: Date, default: Date.now },
});

const CarAd = mongoose.model('CarAd', carAdSchema);

//fetch all ads
app.get('/api/ads', async (req, res) => {
    const ads = await CarAd.find({});
    res.status(200).json({ ads });
  });
  










  