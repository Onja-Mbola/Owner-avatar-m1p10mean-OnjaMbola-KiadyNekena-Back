const express = require('express');
const multer = require('multer');
const employe = require('../models/employeModel');
const client = require('../models/userModel');


// Configuration de multer pour stocker les fichiers
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Fonction pour télécharger une photo
async function uploadPhoto(req, res) {
  try {
    const newPhoto = new Photo({
      title: req.body.title,
      image: {
        data: req.file.buffer,
        contentType: req.file.mimetype
      }
    });

    await newPhoto.save();
    res.status(201).json({ success: true, message: 'Photo téléchargée avec succès.' });
  } catch (error) {
    console.error('Erreur lors du téléchargement de la photo :', error);
    res.status(500).json({ success: false, message: 'Erreur lors du téléchargement de la photo.' });
  }
}


module.exports = router;
