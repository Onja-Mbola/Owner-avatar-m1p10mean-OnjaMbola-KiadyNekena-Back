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
exports.createService = async (req, res) => {
  try {
    const data = await Service.create(req.body);
    res.json(data);
  } catch (error) {
    return next(error);
  }
  // try{
  //   const { name, price , time , image } = req.body;
  //   const newService = new Service({ name, price , time , image });
  //   await newService.save();
  //   res.json({ success: true, message: 'Service added succesfully' });
  // }catch(error){
  //   next(error);
  // }
};


