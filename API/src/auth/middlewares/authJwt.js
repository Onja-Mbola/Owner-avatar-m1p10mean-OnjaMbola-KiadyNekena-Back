const jwt = require("jsonwebtoken");
const configJwt = require("../config/configJwt");
const Client = require("../models/userModel");
const mongoose = require('mongoose');

const authenticateToken = async (req, res, next) => {
  const authHeader = req.headers["authorization"];

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ success: false, message: "Format de jeton non valide ou vous n'etes pas connecter." });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, configJwt.secret);
    const _id = decoded._id;

    // Rechercher directement par _id
    const client = await Client.findOne({ _id });

    if (!client) {
      return res.status(404).json({ success: false, message: "Client non trouvé." });
    }

    // Ajouter les informations du client à la requête pour une utilisation ultérieure
    req.client = client;

    // Passer au middleware suivant
    next();
  } catch (error) {
    console.error('Erreur lors de la vérification du token :', error);
    return res.status(403).json({ success: false, message: "Token invalide." });
  }
};


module.exports = authenticateToken;
