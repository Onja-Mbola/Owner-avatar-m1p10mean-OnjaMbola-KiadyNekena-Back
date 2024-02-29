const Service = require('../models/serviceModel');

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
exports.createService = async (req, res) => {
  // try {
  //   const data = await Service.create(req.body);
  //   res.json(data);
  // } catch (error) {
  //   return next(error);
  // }
  try{
    const {name,price,time,image } = req.body;
    const newService = new Service({ name, description ,price , time , image });
    await newService.save();
    res.json({ success: true, message: req.body });
  }catch(error){
    next(error);
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

