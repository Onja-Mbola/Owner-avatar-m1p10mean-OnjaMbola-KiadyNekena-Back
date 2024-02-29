const Service = require('../models/serviceModel');
const multer = require('multer');


const filtreImage = (req, file, cb) => {
  const allowedFormats = ['image/jpeg', 'image/jpg', 'image/png'];
  if (allowedFormats.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Format de fichier non pris en charge. Veuillez télécharger une image JPEG ou JPG.'), false);
  }
};


const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  fileFilter: filtreImage,
});


exports.upload = upload;



// Fonction pour l'inscription
exports.getServices = async (req, res) => {
  try{
    // const data = await Service.find().exec();
    // res.json({ success: true, data: data });

    Service.find()
    .exec()
    .then((data) => {
      res.json(data);
    })
  }catch(error){
    next(error);
  }
};
exports.getServiceById = async (req, res,next) => {
  try {
    const data = await Service.findById(req.params.id).exec();

    if (!data) {
      return res.status(404).json({ error: 'Not found' });
    }

    res.json(data);
  } catch (error) {
    next(error);
  }
};

exports.getImageService = async (req, res) => {
  try {
    const service = await Service.findById(req.params.id);

    if (!service) {
      return res.status(404).json({ success: false, message: 'Service non trouvé.' });
    }

    res.set('Content-Type', service.image.contentType);
    res.send(service.image.data);
  } catch (error) {
    console.error('Erreur lors de la récupération de l\'image :', error);
    res.status(500).json({ success: false, message: `Erreur lors de la récupération de l'image : ${error.message}` });
  }
}

exports.createService = async (req, res) => {
  // try {
  //   const data = await Service.create(req.body);
  //   res.json(data);
  // } catch (error) {
  //   return next(error);
  // }

  if (!req.body && req.client.role !== "admin" ) {
    return res.status(403).json({ success: false, message: 'Acces interdit' });
  }

  try{
    const {name,price,time,image } = req.body;
    const _id = req.client._id;
    const photoData = req.file.buffer;
    const contentType = req.file.mimetype;


    const newService = new Service({ name, price , time , image : { data: photoData, contentType } });
    await newService.save();
    res.json({ success: true, message: req.body });
  }catch(error){
    return res.status(400).json({ success: false, message: error.message });;
  }
};

exports.updateService = async (req, res, next) => {
  try {
    const updatedData = req.body;

    // Log the update data for debugging
    console.log('Update Data:', updatedData);

    const data = await Service.findByIdAndUpdate(req.params.id, { $set: updatedData }, { new: true }).exec();

    if (!data) {
      return res.status(404).json({ error: 'Not found' });
    }

    // Log the updated document for debugging
    console.log('Updated Document:', data);

    res.json(data);
  } catch (error) {
    console.error('Update Error:', error);
    next(error);
  }
};
exports.deleteService = async (req, res, next) => {
  try {
    const data = await Service.findOneAndDelete({ _id: req.params.id }).exec();

    if (!data) {
      return res.status(404).json({ error: 'Not found' });
    }

    res.status(200).json({
      msg: data
    });
  } catch (error) {
    next(error);
  }
};
// exports.createService = async (req, res, next) => {
//   try {
//     const newService = await Service.create(req.body);
//     const savedService = await newService.save();
//     res.json(savedService);
//   } catch (error) {
//     next(error);
//   }
// };

