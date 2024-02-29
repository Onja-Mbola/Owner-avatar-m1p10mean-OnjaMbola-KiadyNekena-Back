const mongoose = require('mongoose');
const Schema = mongoose.Schema;
let Service = new Schema({
  name: {
     type: String
  },
  description: {
     type: String
  },
  price: {
     type: Number
  },
  time: {
     type: Number
  },
  image: {
    data: Buffer,
    contentType: String,
  }
}, {
  collection: 'services'
})

// const serviceSchema = new mongoose.Schema({
//   name: String,
//   price: String,
//   time: Number,
//   image: String
// });

module.exports = mongoose.model('Service', Service);
