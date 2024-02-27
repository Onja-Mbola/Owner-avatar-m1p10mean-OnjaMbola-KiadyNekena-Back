const mongoose = require('mongoose');
const bcrypt = require('bcrypt');


function numeroValide(numero) {
  return numero.length === 10;
}


function estAdresseEmailValide(email) {
  const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  return regexEmail.test(email);
}

const employeSchema = new mongoose.Schema({
  _id : {
    type : mongoose.Schema.Types.ObjectId,
    required: true,
  },
  firstName : {
    type : String,
    required: true,
  },
  lastName : {
    type : String,
    required: true,
  },
  photo : {
    title: String,
    data: Buffer,
    contentType: String,
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
  salt: {
    type: String,
    required: true
  },
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
      message: 'Le numéro doit contenir 10 caracteres',
    },
    required: true,
  },
  salaire: {
    type: Number,
    default: 0
  },
  role: {
    type: String,
    enum: ['admin', 'employe'],
    required: true,
    message: 'Role invalide',
  },
  codeValidation: String,
  isVerified: {
    type: Boolean,
    default: false,
  },
  activationToken: String,

});


employeSchema.pre('save', async function (next) {
  // Si le mot de passe n'est pas modifié, ou si le sel existe déjà, passez à l'étape suivante
  if (!this.isModified('password') || this.salt) {
    return next();
  }

  // Génération du sel
  const salt = await bcrypt.genSalt(10);

  // Hachage du mot de passe avec le sel
  const hashedPassword = await bcrypt.hash(this.password, salt);

  // Stockage du sel et du mot de passe haché
  this.salt = salt;
  this.password = hashedPassword;
  next();
});


module.exports = mongoose.model('Employe', employeSchema);
