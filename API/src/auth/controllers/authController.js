const Client = require('../models/userModel');
const nodemailer = require('nodemailer');
const jwt = require('jsonwebtoken');


// Fonction pour générer un code de validation aléatoire
function genererCodeValidation() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}


// Fonction pour envoyer le code de validation par e-mail
async function envoyerCodeValidationParEmail(email, codeValidation) {
  
  const transporter = nodemailer.createTransport({
    // Configuration du service de messagerie
    service: 'gmail',
    auth: {
      user: 'mdgmanjamanja@gmail.com',
      pass: 'zrdp fnrh pquw jimo',
    },
    secure: true,
  });


  const mailOptions = {
    from: 'mdgmanjamanja@gmail.com',
    to: email,
    subject: 'Code de validation',
    text: `Votre code de validation est : ${codeValidation}`,
  };


  try {
    // Utilisation de await pour s'assurer que l'envoi de l'email est terminé avant de passer à la suite
    await transporter.sendMail(mailOptions);
    console.log('Email sent successfully');
  } catch (error) {
    console.error('Error sending email:', error.message);
    // Vous pouvez gérer l'erreur ici, par exemple, en enregistrant l'erreur dans les journaux ou en prenant une action spécifique.
    throw new Error('Erreur lors de l\'envoi de l\'email de validation');
  }

}


// Contrôleur pour l'insertion d'un nouvel utilisateur
exports.registerClient = async (req, res) => {
  try {

    const { firstName, lastName, email, password, dateOfBirth, sexe, address, phoneNumber } = req.body;

    const existingUser = await Client.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Utilisateur déjà enregistré.' });
    }

    // Générer le code de validation
    const codeValidation = genererCodeValidation();

    // Enregistrer l'utilisateur avec le code de validation
    const newClient = new Client({
      firstName, 
      lastName, 
      email, 
      password, 
      dateOfBirth, 
      sexe, 
      address, 
      phoneNumber,
      codeValidation
    });

    // Envoi du code de validation par e-mail
    await envoyerCodeValidationParEmail(email, codeValidation);

    // Enregistrement de l'utilisateur
    await newClient.save();

    res.status(200).json({ message: 'Veuillez vérifier votre email pour valider votre code' });
    return;
  } catch (erreur) {
    res.status(400).json({ success: false, message: erreur.message });
  }
}



exports.validationClient = async (req, res) => {
  try {
    const { email, codeValidation } = req.body;

    const client = await Client.findOne({ email });

    if (!client) {
      return res.status(400).json({ message: 'Utilisateur non enregistré.' });
    }

    if (client.isVerified) {
      return res.status(400).json({ message: 'Utilisateur déjà validé.' });
    }

    if (client.codeValidation !== codeValidation) {
      return res.status(400).json({ message: 'Code de validation incorrect.' });
    }

    client.isVerified = true;
    client.codeValidation = '';

    await client.save();

    res.status(200).json({ message: 'Validation réussie. Vous pouvez maintenant vous connecter.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erreur lors de la validation.' });
  }
};


exports.loginClient = async (req, res) => {
  const { email, password } = req.body;
  const user = await Client.findOne({ email, password });

  if (!user) {
    return res.json({ success: false, message: 'Invalid username or password.' });
  }

  if (!user.isVerified) {
    return res.json({ success: false, message: 'Utilisateur non verifier. Veuillez valider votre compte.' });
  }

  const token = jwt.sign({ email }, 'manjamanja');
  res.json({ success: true, token });
};

// Fonction pour récupérer la liste des utilisateurs
exports.getListeClient = async (req, res) => {
  try {
    const utilisateurs = await Client.find();
    res.json({ success: true, utilisateurs });
  } catch (erreur) {
    res.status(500).json({ success: false, message: 'Erreur lors de la récupération des utilisateurs.' });
  }
};