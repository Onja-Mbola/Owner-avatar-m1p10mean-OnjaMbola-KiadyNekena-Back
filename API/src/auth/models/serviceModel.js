const mongoose = require('mongoose');

const serviceSchema = new mongoose.Schema({
  name: String,
  price: String,
  time: Number,
  image: String
});

module.exports = mongoose.model('Service', serviceSchema);
