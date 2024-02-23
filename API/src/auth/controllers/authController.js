const Client = require('../models/userModel');
const nodemailer = require('nodemailer');
const jwt = require('jsonwebtoken');


// Fonction pour générer un code de validation aléatoire
function genererCodeValidation() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}


// Fonction pour générer un token d'activation aléatoire
function genererTokenActivation() {
  const codeAleatoire = genererCodeValidation;
  const token = jwt.sign({ codeAleatoire }, 'manjamanja');
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
    const activationToken = genererTokenActivation();

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
      activationToken
    });

    // Enregistrement de l'utilisateur
    await newClient.save();

    // Construire le lien d'activation
    const activationLink = `http://localhost:3000/api/auth/validationClient?email=${email}&token=${activationToken}`;

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

    if (client.isActivated) {
      return res.status(400).json({ message: 'Compte déjà activé.' });
    }

    // Activer le compte
    client.isActivated = true;
    client.activationToken = undefined;

    await client.save();

    res.status(200).json({ message: 'Compte activé avec succès. Vous pouvez maintenant vous connecter.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erreur lors de l\'activation du compte.' });
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
    console.log('Email sent successfully');
  } catch (error) {
    console.error('Error sending email:', error.message);
    // Vous pouvez gérer l'erreur ici, par exemple, en enregistrant l'erreur dans les journaux ou en prenant une action spécifique.
    throw new Error('Erreur lors de l\'envoi de l\'email de validation');
  }

}
