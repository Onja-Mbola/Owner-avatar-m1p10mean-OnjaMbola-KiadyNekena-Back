const User = require('../models/userModel');
const jwt = require('jsonwebtoken');

// Fonction pour l'inscription
exports.register = async (req, res) => {
  const { username, password } = req.body;
  const newUser = new User({ username, password });
  await newUser.save();
  res.json({ success: true, message: 'User registered successfully.' });
};

// Fonction pour la connexion
exports.login = async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findOne({ username, password });

  if (!user) {
    return res.json({ success: false, message: 'Invalid username or password.' });
  }

  const token = jwt.sign({ username }, 'manjamanja');
  res.json({ success: true, token });
};
