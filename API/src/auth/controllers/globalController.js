const employe = require('../models/employeModel');
const client = require('../models/userModel');


exports.uploadPhotoClient = async (req, res) => {
  try {
    const _id = req.client._id;
    const photoData = req.body.photoData;
    const contentType = req.body.contentType;

    // Mise à jour du champ photo dans le modèle Employe
    const result = await client.updateOne({ _id }, { $set: { photo: { data: photoData, contentType } } });

    if (result.modifiedCount > 0) {
      return res.status(200).json({ success: true, message: 'Photo mise à jour avec succès.' });
    } else {
      return res.status(404).json({ success: false, message: 'Aucune photo mise à jour.' });
    }
  } catch (error) {
    console.error('Erreur lors du téléchargement de la photo :', error);
    return res.status(500).json({ success: false, message: `Erreur lors du téléchargement de la photo : ${error.message}` });
  }
};



exports.uploadPhoto = async (req, res) => {
  try {
    const _id = req.client._id;
    const photoData = req.body.photoData;
    const contentType = req.body.contentType;

    // Mise à jour du champ photo dans le modèle Employe
    const result = await employe.updateOne({ _id }, { $set: { photo: { data: photoData, contentType } } });

    if (result.modifiedCount > 0) {
      return res.status(200).json({ success: true, message: 'Photo mise à jour avec succès.' });
    } else {
      return res.status(404).json({ success: false, message: 'Aucune photo mise à jour.' });
    }
  } catch (error) {
    console.error('Erreur lors du téléchargement de la photo :', error);
    return res.status(500).json({ success: false, message: `Erreur lors du téléchargement de la photo : ${error.message}` });
  }
};
