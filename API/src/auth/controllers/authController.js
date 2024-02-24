const Client = require('../models/userModel');
const nodemailer = require('nodemailer');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const secretToken = require('../config/configJwt');
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

          <p>Merci de vous être inscrit sur notre site web.</p>

          <p>Pour valider votre compte, veuillez cliquer sur le lien suivant : </p>

          <a href="${lienActivation}">Valider mon compte</a>

          <p>Ce lien est valide pendant 24 heures.</p>

          <p>Si vous ne recevez pas cet email, veuillez vérifier vos spams.</p>

          <p>Cordialement,</p>

          <p>L'équipe du site web</p>
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


// Contrôleur pour l'insertion d'un nouvel utilisateur
exports.registerClient = async (req, res) => {
  const { firstName, lastName, email, password, dateOfBirth, sexe, address, phoneNumber } = req.body;

    // Vérifier si le corps de la requête contient les informations nécessaires
   if (!req.body && !req.body.firstName && !req.body.lastName && !req.body.email && !req.body.password && !req.body.dateOfBirth && !req.body.sexe  && !req.body.address && !req.body.phoneNumber) {
    return res.status(400).json({ success: false, message: 'Veuillez remplir tout les champs.' });
  }

  try {

    // Génération du sel
    const salt = await bcrypt.genSalt(saltRounds);

    // Hachage du mot de passe avec le sel
    const hashedPassword = await bcrypt.hash(password, salt);

    const existingUser = await Client.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Utilisateur déjà enregistré.' });
    }

    // Générer le code de validation
    const activationToken = genererTokenActivation();

    // Enregistrer l'utilisateur avec le code de validation
    const newClient = new Client({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      salt,
      dateOfBirth,
      sexe,
      address,
      phoneNumber,
      activationToken
    });

    // Enregistrement de l'utilisateur
    await newClient.save();

    // Construire le lien d'activation
    const activationLink = `http://192.168.88.18:3000/api/auth/validationClient?email=${email}&token=${activationToken}`;

    // Générer le contenu de l'e-mail
    const contenuEmail = genererContenuEmailValidation(firstName, activationLink);

    // Envoyer l'e-mail avec le contenu généré
    await envoyerCodeValidationParEmail(email, 'Validation de votre compte chez ManjaManja MDG', contenuEmail);

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

// Fonction pour valider le compte du client
exports.activateAccount = async (req, res) => {
  try {
    const { email, token } = req.query;

    const client = await Client.findOne({ email, activationToken: token });

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


exports.loginClient = async (req, res) => {
  // Vérifier si le corps de la requête contient les informations nécessaires
  if (!req.body || !req.body.email || !req.body.password) {
    return res.status(400).json({ success: false, message: 'Email et mot de passe requise.' });
  }

  const { email, password } = req.body;

  try {
    const user = await Client.findOne({ email });

    if (!user) {
      return res.status(401).json({ success: false, message: 'Email ou Mot de passe invalide.' });
    }

    if (!user.isVerified) {
      return res.status(403).json({ success: false, message: 'Utilisateur non vérifié. Veuillez valider votre compte.' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ success: false, message: 'Email ou Mot de passe invalide.' });
    }

    console.log('Valeur de isVerified dans la base de données :', user.isVerified);

    const token = jwt.sign({ email }, configJwt.secret);
    res.status(200).json({ success: true, client_id: user.id, userName: user.firstName + " " + user.lastName, email: user.email, token });
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).json({ success: false, message: 'Internal server error.' });
  }
};





// Fonction pour récupérer la liste des utilisateurs
exports.getListeClient = async (req, res) => {
  try {
    const utilisateurs = await Client.find();
    res.status(200).json({ success: true, utilisateurs });
  } catch (erreur) {
    res.status(500).json({ success: false, message: 'Erreur lors de la récupération des utilisateurs.' });
  }
};


//Fonction qui affiche les information du client
exports.getInfoClient = async (req, res) => {
  try {
    const email = req.client.email;
    const infoClient = await Client.findOne({ email: email });
    if (!infoClient) {
      return res.status(401).json({ success: false, message: 'Utilisateur inexistant.' });
    }
    res.status(200).json({ success: true, infoClient});
  } catch (erreur) {
    console.log(erreur);
    res.status(500).json({ success: false, message: 'Erreur lors de la récupération de vos informations.' });
  }
}


// Fonction pour envoyer e-mail
async function envoyerEmail(email,subject, message) {

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
    subject: subject,
    text: message,
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
