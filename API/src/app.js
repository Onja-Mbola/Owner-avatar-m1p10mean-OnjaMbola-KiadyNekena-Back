const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors')
const bodyParser = require('body-parser');
const authRoutes = require('./auth/routes/routes');
const serviceRoutes = require('./auth/routes/service.routes');
const lien = require('./auth/config/configJwt');

const app = express();
const port = 3000;

mongoose.connect('mongodb+srv://123456QWERTY:123456QWERTY@cluster0.lzyerx2.mongodb.net/?retryWrites=true&w=majority',
{ useNewUrlParser: true,
  useUnifiedTopology: true
});


// // Middleware pour gérer les CORS
// app.use((req, res, next) => {
//   res.header('Access-Control-Allow-Origin', 'http://localhost:4200'); // Remplacez par l'URL de votre frontend Angular
//   res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
//   res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
//   next();
// });

app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: false,
  }),
)

app.use(cors());
// Routes authentification
app.use('/api/auth', authRoutes);
// Routes Service
app.use('/api/service/', serviceRoutes);

// Host
// app.listen(port, '192.168.88.18', () => {
//   console.log(`Server is running on port ${port}`);
// });

// Point d'entrée pour le serveur
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
