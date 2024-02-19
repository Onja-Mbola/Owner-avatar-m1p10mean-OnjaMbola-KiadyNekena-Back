const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const authRoutes = require('./auth/routes/routes');

const app = express();
const port = 3000;

mongoose.connect('mongodb+srv://123456QWERTY:123456QWERTY@cluster0.lzyerx2.mongodb.net/?retryWrites=true&w=majority', 
{ useNewUrlParser: true, 
  useUnifiedTopology: true 
});

app.use(bodyParser.json());

// Routes authentification
app.use('/api/auth', authRoutes);

// Point d'entrée pour le serveur
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
