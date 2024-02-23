const mongoose = require('mongoose');

function numeroValide(numero) {
  return numero.startsWith('+');
}

function estAdresseEmailValide(email) {
  const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  return regexEmail.test(email);
}

const clientSchema = new mongoose.Schema({
  firstName : {
    type : String,
    required: true,
  },
  lastName : {
    type : String,
    required: true,
  },
  email : {
    type: String,
    validate: {
      validator: estAdresseEmailValide,
      message: 'Inserer une adresse email valide',
    },
    required: true,
  },
  password : String,
  dateOfBirth : Date,
  sexe: {
    type: String,
    enum: ['homme', 'femme'],
    required: true,
  },
  address : String,
  phoneNumber: {
    type: String,
    validate: {
      validator: numeroValide,
      message: 'Le numéro doit commencer par le caractère "+"',
    },
    required: true,
  },
  codeValidation: String,
  isVerified: {
    type: Boolean,
    default: false,
  },
  activationToken: String,

});

module.exports = mongoose.model('Client', clientSchema);
