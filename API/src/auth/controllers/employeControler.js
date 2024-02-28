const Employe = require('../models/employeModel');
const nodemailer = require('nodemailer');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const secretToken = require('../config/configJwt');
const mongoose = require('mongoose');
const configJwt = require('../config/configJwt');
const authenticateToken = require("../middlewares/authJwt");
const saltRounds = 10;


// Fonction pour générer un code de validation aléatoire
function genererCodeValidation() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}


// Fonction pour générer un token d'activation aléatoire
function genererTokenActivation() {
  const codeAleatoire = genererCodeValidation;
  const token = jwt.sign({ codeAleatoire }, secretToken.secret,
    {
      algorithm: 'HS256',
      allowInsecureKeySizes: true,
      expiresIn: 86400, // 24 hours
    });
  return token;
}


//Fonction pour generer le Contenu de l'email
function genererContenuEmailValidation(nom, lienActivation) {
  return `
    <!DOCTYPE html>
    <html lang="fr">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Validation de votre compte</title>
      <style>
        body {
          font-family: sans-serif;
          font-size: 16px;
          line-height: 1.5;
          color: #333;
        }

        a {
          color: #0073b7;
          text-decoration: none;
        }

        .container {
          max-width: 600px;
          margin: 0 auto;
          padding: 20px;
        }

        .header {
          text-align: center;
        }

        .content {
          margin-top: 20px;
        }

        .footer {
          text-align: center;
          margin-top: 20px;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Validation de votre compte</h1>
        </div>

        <div class="content">
          <p>Bonjour ${nom},</p>

          <p>Merci d'avoir rejoint la grande famille de ManjaManja MDG'.</p>

          <p>Pour valider votre compte et commencez a connaitre votre planning, veuillez cliquer sur le lien suivant : </p>

          <a href="${lienActivation}">Valider mon compte</a>

          <p>Si vous ne recevez pas cet email, veuillez vérifier vos spams.</p>

          <p>Cordialement,</p>

          <p>L'équipe de ManjaManja MDG</p>
        </div>

        <div class="footer">
          <p>&copy;2024 - ManjaManja MDG</p>
        </div>
      </div>
    </body>
    </html>
  `;
}


// Fonction pour envoyer le code de validation par e-mail
async function envoyerCodeValidationParEmail(email, objetDuMail, contenu) {

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
    subject: objetDuMail,
    html: contenu,
  };


  try {
    // Utilisation de await pour s'assurer que l'envoi de l'email est terminé avant de passer à la suite
    await transporter.sendMail(mailOptions);
    console.log('Email sent statusfully');
  } catch (error) {
    console.error('Error sending email:', error.message);
    // Vous pouvez gérer l'erreur ici, par exemple, en enregistrant l'erreur dans les journaux ou en prenant une action spécifique.
    throw new Error('Erreur lors de l\'envoi de l\'email de validation');
  }

}


// Fonction pour valider le compte de l'utilisateur
exports.activateAccount = async (req, res) => {
  try {
    const { email, token } = req.query;

    const client = await Employe.findOne({ email, activationToken: token });

    if (!client) {
      return res.status(400).json({ message: 'Token d\'activation invalide ou expiré.' });
    }

    if (client.isVerified) {
      return res.status(400).json({ message: 'Compte déjà activé.' });
    }

    // Activer le compte
    client.isVerified = true;
    client.activationToken = undefined;

    await client.save();

    res.status(200).json({ message: 'Compte activé avec succès. Vous pouvez maintenant vous connecter.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erreur lors de l\'activation du compte.' });
  }
};


exports.registerEmploye = async (req, res) => {
  const { firstName, lastName, email, password, dateOfBirth, sexe, address, phoneNumber, salaire, role } = req.body;

    // Vérifier si le corps de la requête contient les informations nécessaires
   if (!req.body && !req.body.firstName && req.client.role !== "admin" && !req.body.lastName && !req.body.email && !req.body.password && !req.body.dateOfBirth && !req.body.sexe  && !req.body.address && !req.body.phoneNumber && !req.body.salaire && !req.body.role) {
    return res.status(400).json({ success: false, message: 'Veuillez remplir tout les champs.' });
  }

  try {

    // Génération du sel
    const salt = await bcrypt.genSalt(saltRounds);

    // Hachage du mot de passe avec le sel
    const hashedPassword = await bcrypt.hash(password, salt);

    const existingUser = await Employe.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Employe déjà enregistré.' });
    }

    // Générer le code de validation
    const activationToken = genererTokenActivation();

    // Enregistrer l'utilisateur avec le code de validation
    const newEmploye = new Employe({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      salt,
      dateOfBirth,
      sexe,
      address,
      phoneNumber,
      salaire,
      role,
      activationToken
    });

    // Enregistrement de l'utilisateur
    await newEmploye.save();

    // Construire le lien d'activation
    const activationLink = `http://${secretToken.lien}:3000/api/auth/validationEmploye?email=${email}&token=${activationToken}`;

    // Générer le contenu de l'e-mail
    const contenuEmail = genererContenuEmailValidation(firstName, activationLink);

    // Envoyer l'e-mail avec le contenu généré
    await envoyerCodeValidationParEmail(email, 'Validation de votre Employe compte chez ManjaManja MDG', contenuEmail);

    res.status(200).json({ message: 'Veuillez vérifier votre email pour valider votre code' });
    return;
  } catch (erreur) {
    res.status(400).json({ success: false, message: erreur.message });
  }
}


exports.loginEmploye = async (req, res) => {
  // Vérifier si le corps de la requête contient les informations nécessaires
  if (!req.body || !req.body.email || !req.body.password) {
    return res.status(400).json({ success: false, message: 'Email et mot de passe requise.' });
  }

  const { email, password } = req.body;

  try {
    const user = await Employe.findOne({ email });

    if (!user) {
      return res.status(401).json({ success: false, message: 'Email ou Mot de passe invalide.' });
    }

    if (!user.isVerified) {
      return res.status(403).json({ success: false, message: 'Utilisateur non vérifié. Veuillez valider votre compte.' });
    }
    const _id = user._id;
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ success: false, message: 'Email ou Mot de passe invalide.' });
    }


    const token = jwt.sign({ _id }, configJwt.secretAdmin);
    res.status(200).json({ success: true, employe_id: user.id, userName: user.firstName + " " + user.lastName, email: user.email, role: user.role, token });
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).json({ success: false, message: 'Internal server error.' });
  }
};


// Fonction pour récupérer la liste des utilisateurs
exports.getListeEmploye = async (req, res) => {
  try {
      if( req.client.role == "admin") {
        const utilisateurs = await Employe.find();
        return res.status(200).json({ success: true, utilisateurs });
      } else {
        return res.status(403).json({ success : false , message: 'Acces interdit, vous n avez pas acces a ce ressource'});
      }
    } catch (erreur) {
    res.status(500).json({ success: false, message: 'Erreur lors de la récupération des utilisateurs.' });
  }
};


//Fonction qui affiche les information de l'Employe
exports.getInfoEmploye = async (req, res) => {
  try {
    const _id = req.client._id;
    const infoClient = await Employe.findOne({ _id: _id });
    if (!infoClient) {
      return res.status(401).json({ success: false, message: 'Utilisateur inexistant.' });
    }
    res.status(200).json({ success: true, _id : infoClient._id, firstName : infoClient.firstName, lastName : infoClient.lastName, email : infoClient.email, sexe : infoClient.sexe, address : infoClient.address, phoneNumber : infoClient.phoneNumber, salaire: infoClient.salaire});
  } catch (erreur) {
    console.log(erreur);
    res.status(500).json({ success: false, message: 'Erreur lors de la récupération de vos informations.' });
  }
}


//Fonction qui affiche les information de l' Empolye
exports.getInfoEmployebyId = async (req, res) => {
  try {
    if (!req.body || !req.body._id ) {
      return res.status(400).json({ success: false, message: 'Identifiant requis.' });
    }
    const _id = req.client._id;
    if( req.client.role == "admin") {
      const infoClient = await Employe.findOne({ _id: _id });
      if (!infoClient) {
        return res.status(401).json({ success: false, message: 'Utilisateur inexistant.' });
      }
      res.status(200).json({ success: true, _id : infoClient._id, firstName : infoClient.firstName, lastName : infoClient.lastName, email : infoClient.email, sexe : infoClient.sexe, address : infoClient.address, phoneNumber : infoClient.phoneNumber, salaire: infoClient.salaire, role: infoClient.role});
    }
    if( req.client.role !== "admin") {
      return res.status(403).json({ success: false, message: 'Acces interdit! Vous n avez pas acces a cette information' });
    }
  } catch (erreur) {
    console.log(erreur);
    res.status(500).json({ success: false, message: 'Erreur lors de la récupération de vos informations.' });
  }
}


//Fonction modif generaliser pour les utilisateurs
exports.modifGeneral = async (req, res) => {
  try {
    const _id = req.client._id;
    const nomModel = req.body.models;
    const modifications = req.body.modification;

    if (!_id || nomModel !== "Employe" || !modifications || (req.client.role !== "admin" && req.client.role !== "employe")) {
      return res.status(400).json({ success: false, message: 'Paramètres invalides.' });
    }

    const model = mongoose.model(nomModel);
    const result = await model.updateOne({ _id }, modifications);

    if (result.modifiedCount > 0) {
      return res.status(200).json({ success: true, message: 'Document mis à jour avec succès.' });
    } else {
      return res.status(404).json({ success: false, message: 'Aucun document mis à jour.' });
    }

  } catch (error) {
    return res.status(500).json({ success: false, message: `Erreur lors de la mise à jour : ${error.message}` });
  }
};


//Fonction modif generaliser pour admin seulement
exports.modifGeneralbyId = async (req, res) => {
  try {
    const _id = req.body._id;
    const role = req.client.role;
    const nomModel = req.body.models;
    const modifications = req.body.modification;

    if (!_id || !nomModel || !modifications) {
      return res.status(400).json({ success: false, message: 'Paramètres invalides.' });
    }


    if ( role == 'admin' ) {
      const model = mongoose.model(nomModel);
      const result = await model.updateOne({ _id }, modifications);

      if (result.modifiedCount > 0) {
        return res.status(200).json({ success: true, message: 'Document mis à jour avec succès.' });
      } else {
        return res.status(404).json({ success: false, message: 'Aucun document mis à jour.' });
      }
    }

    if ( role !== 'admin' ) {
      return res.status(403).json({ success: false, message: 'Acces interdit, Vous n avez pas acces a ce ressource.' });
    }

  } catch (error) {
    return res.status(500).json({ success: false, message: `Erreur lors de la mise à jour : ${error.message}` });
  }
};
