const mongoose = require('mongoose');
const serviceModel = require('./serviceModel');
const { Timestamp } = require('mongodb');


const rendezVousSchema = new mongoose.Schema({
  _id : {
    type : mongoose.Schema.Types.ObjectId,
    auto: true,
  },
  _idClient : {
    type :  mongoose.Schema.Types.ObjectId,
    ref : 'Client',
    required: true,
  },
  _idEmploye : {
    type :  mongoose.Schema.Types.ObjectId,
    ref : 'Employe',
    required: true,
  },
  date : {
    type: Date,
    required: true,
  },
  heure : {
    type : String,
    required: true,
  },
  service: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Service',
  }],
  etat : {
    type : String,
    enum: ['En_Cours', 'annuler','terminer'],
    required: true,
  }
});


module.exports = mongoose.model('RendezVous', rendezVousSchema);
