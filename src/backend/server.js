const express = require('express');
const app = express();
const port = 4000;

const cors = require('cors');
app.use(cors());

//allows the frontend and backend to communicate
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

// body parser to parse incoming request bodies(json)
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

//MongoDB connection using mongoose
const mongoose = require('mongoose');

mongoose.connect('mongodb+srv://admin:user@car.bjz0r.mongodb.net/', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('Connected to MongoDB'))
.catch(err => console.error('MongoDB connection error:', err));

//Car Ad Schema
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

// message Schema for handling messages between users
const messageSchema = new mongoose.Schema({
  adId: { type: mongoose.Schema.Types.ObjectId, ref: 'CarAd', required: true },
  sender: { type: String, required: true },
  receiver: { type: String, required: true },
  content: { type: String, required: true },
  read: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

// mongoose models for messages and car ads
const Message = mongoose.model('Message', messageSchema);
const CarAd = mongoose.model('CarAd', carAdSchema);

// post route for adding a new car ad
app.post('/api/ads', async (req, res) => {
  const { 
    make, model, year, price, mileage, location, description, image, postedBy
  } = req.body;
  
  try {
    const newAd = new CarAd({ 
      make, model, year, price, mileage, location, description, image, postedBy
    });
    await newAd.save(); //save the ad to the db
    res.status(201).json({ message: 'Car ad added successfully', ad: newAd });
  } catch (error) {
    res.status(500).json({ message: 'Error adding car ad', error });
  }
});

// post route for sending messages between users
app.post('/api/messages', async (req, res) => {
  const { adId, sender, receiver, content } = req.body;
  
  try {
    const newMessage = new Message({ adId, sender, receiver, content });
    await newMessage.save();
    res.status(201).json({ message: 'Message sent successfully', data: newMessage });
  } catch (error) {
    res.status(500).json({ message: 'Error sending message', error });
  }
});

// get route to fetch all car ads
app.get('/api/ads', async (req, res) => {
  try {
    const ads = await CarAd.find();
    res.status(200).json({ ads });
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving car ads', error });
  }
});

// get route to fetch details of a specific car ad by id
app.get('/api/ad/:id', async (req, res) => {
  try {
    const adId = req.params.id;
    const ad = await CarAd.findById(adId);
    if (!ad) {
      return res.status(404).json({ message: 'Car ad not found' });
    }
    res.status(200).json(ad);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving car ad', error });
  }
});

// get route to fetch messages
app.get('/api/messages/user/:userId', async (req, res) => {
  const userId = req.params.userId;
  
  try {
    const messages = await Message.find({
      $or: [{ sender: userId }, { receiver: userId }] // $or operator to match either sender or receiver
    }).populate('adId');
    
    const conversations = {};

    //loop through all messages and group them into conversations
    messages.forEach(msg => {
      const otherUser = msg.sender === userId ? msg.receiver : msg.sender;
      const adId = msg.adId._id.toString();
      
      // make a unique key for each conversation using otherUser and adId
      const key = `${otherUser}_${adId}`;
      if (!conversations[key]) {
        conversations[key] = {
          adId: msg.adId._id,
          adTitle: `${msg.adId.make} ${msg.adId.model}`,
          otherUserId: otherUser,
          messages: [] // array to store all messages for this conversation
        };
      }
      conversations[key].messages.push(msg);
    });
    
    res.status(200).json(Object.values(conversations));
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving messages', error });
  }
});

//fetches specific conversation between 2 users
app.get('/api/messages/conversation/:adId/:userId1/:userId2', async (req, res) => {
  const { adId, userId1, userId2 } = req.params;
  
  try {
    const messages = await Message.find({
      adId, //match messages for the specific car ad
      $or: [
        { sender: userId1, receiver: userId2 },
        { sender: userId2, receiver: userId1 }
      ]
    }).sort({ createdAt: 1 });  // sort messages by the creation date
    
    res.status(200).json(messages);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving conversation', error });
  }
});

//mark messages as read
app.put('/api/messages/read', async (req, res) => {
  const { messageIds } = req.body;
  
  try {
    await Message.updateMany(
      { _id: { $in: messageIds } },
      { $set: { read: true } }
    );
    
    res.status(200).json({ message: 'Messages marked as read' });
  } catch (error) {
    res.status(500).json({ message: 'Error updating messages', error });
  }
});

// delete route to delete a car ad by id
app.delete('/api/ad/:id', async (req, res) => {
  try {
    const adId = req.params.id;
    const ad = await CarAd.findByIdAndDelete(adId);
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