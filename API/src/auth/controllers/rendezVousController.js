const rendezVous = require('../models/rendezVousModel');
const Employe = require('../models/employeModel');
const moment = require('moment');
const Service = require('../models/serviceModel');


function ajouterMinutes(heure, minutesToAdd) {
  const heureMoment = moment(heure, 'HH:mm');
  const nouvelleHeureMoment = heureMoment.add(minutesToAdd, 'minutes');
  return nouvelleHeureMoment.format('HH:mm');
}


// Fonction pour comparer deux heures spécifiques
function comparerHeures(heure1, heure2) {
  const momentHeure1 = moment(heure1, 'HH:mm');
  const momentHeure2 = moment(heure2, 'HH:mm');

  if (momentHeure1.isBefore(momentHeure2)) {
    return -1; // heure1 est avant heure2
  } else if (momentHeure1.isAfter(momentHeure2)) {
    return 1; // heure1 est après heure2
  } else {
    return 0; // heures identiques
  }
}




exports.registerRendezVous = async (req, res) => {
  try {
    if (!req.body && !req.body._idEmploye && !req.body.date && !req.body.heure && !req.body.service) {
      return res.status(400).json({ success: false, message: 'Veuillez remplir tout les champs.' });
    }
    const { _idEmploye, date, heure, service } = req.body;
    const employe = await Employe.findById(_idEmploye);
    heureDebut = req.body.heure;

    if ( comparerHeures(heureDebut,employe.heureEntre) == -1 || comparerHeures(heureDebut,employe.heureEntre) == 1) {
      return res.status(400).json({ success: false, message: "Verifiez l'heure du rendez-vous" });
    }

    let sommeHeureService = 0;
    for (const serviceId of service) {
      const serviceDetails = await Service.findById(serviceId);
      sommeHeureService += serviceDetails.time;
    }
    const heureFin = ajouterMinutes(heureDebut, sommeHeureService);


    if ( comparerHeures(heureFin,employe.heureSortie) == 1) {
      return res.status(400).json({ success: false, message: "Duree du rendez vous depasse l'heure de sortie de "+employe.firstName });
    }

    const rendezVousExistants = await rendezVous.find({
      _idEmploye: _idEmploye,
      date: date,
      etat: { $ne: 'annuler' }
    });

    for (const rendezVous of rendezVousExistants) {
      let sommeHeureServices = 0;
    for (const serviceId of rendezVous.service) {
      const serviceDetails = await Service.findById(serviceId);
      sommeHeureServices += serviceDetails.time;
    }
    const heureFinExistante = ajouterMinutes(rendezVous.heure, sommeHeureServices);

      if (comparerHeures(heureDebut,heureFinExistante) == -1 &&  comparerHeures(heureFin,rendezVous.heure) == 1 ) {
        return res.status(400).json({ success: false, message: "Le rendez-vous chevauche avec un autre rendez-vous existant" });
      }
    }


    const newRendezVous = new rendezVous({
      _idClient : req.client._id,
      _idEmploye,
      date,
      heure,
      service,
      etat : "En_Cours",
    });

    await newRendezVous.save();
    res.status(200).json({ success : true, message: 'Rendez Vous Valider' });
    return;
  } catch (erreur) {
    return res.status(400).json({ success: false, message: erreur.message });
  }
}



exports.getListeRendezVousById = async (req,res) => {
  try {
    const rendezVous = await rendezVous.find(
      {
        _idClient : req.params.id,
      }
    );
    return res.status(200).json({ success: true, rendezVous });
  } catch (error) {
    return res.status(400).json({ success: false, message: erreur.message });
  }
}


exports.getListeRendezVous = async (req,res) => {
  try {
    const rendezVouss = await rendezVous.find(
      {
        _idClient : req.client._id,
      }
    );
    return res.status(200).json({ success: true, rendezVous : rendezVouss });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
}
