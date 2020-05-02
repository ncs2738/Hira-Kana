// Require models
const models = require('../models');

// Set up the Translation models
const { DateTranslation } = models;

// Used for saving a new date translation
const saveDateTranslation = (req, res) => {
  // Make sure all fields are there
  if (!req.body) {
    return res.status(400).json({ error: 'Please enter a date to be saved!' });
  }

  // Set an object to the variables + the owner's id
  const translationData = {
    date: req.body.date,
    kanji: req.body.kanji,
    reading: req.body.reading,
    english: req.body.english,
    translation: req.body.translation,
    owner: req.session.account._id,
  };

  // Create a new model in the database
  const newTranslation = new DateTranslation.DateTranslationModel(translationData);

  // Make the promise
  const translationPromise = newTranslation.save();

  // Set the promise
  translationPromise.then(() => res.json({ redirect: '/translations' }));

  // Check for errors
  translationPromise.catch((err) => {
    console.log(err);

    // The translation already exists
    if (err.code === 11000) {
      return res.status(400).json({ error: 'You already have that translation saved!' });
    }

    // There's a error, so return the problem
    return res.status(400).json({ error: 'An error occured. Our apologies' });
  });

  return translationPromise;
};

const updateDateTranslation = (req, res) => {
  req.body.owner = req.session.account._id;
  DateTranslation.DateTranslationModel.update(req.body, (err, docs) => {
    // A error occured
    if (err) {
      console.log(err);
      return res.status(400).json({ err: 'An error occurred. Our apologies.' });
    }

    // The app loaded right; reload the app again, and get a new token
    return res.json({ translations: docs });
  });
};

// used for deleting the user's date translations
const deleteDateTranslation = (req, res) => {
  // Send the date translation-id, and check for errors
  DateTranslation.DateTranslationModel.deleteTranslation(req.body.id, (err, docs) => {
    // Failed in deleting right
    if (err) {
      console.log(err);
      return res.status(400).json({ error: 'Error in deleting. Our apologies.' });
    }

    // Deleted properly.
    return res.json({ translations: docs });
  });
};

// Get all of the user's dat etranslations
const getDateTranslations = (request, response) => {
  const req = request;
  const res = response;

  // Search for the owner
  return DateTranslation.DateTranslationModel.findByOwner(req.session.account._id, (err, docs) => {
    // An error occurred
    if (err) {
      console.log(err);
      return res.status(400).json({ error: 'An error occurred. Our apologies.' });
    }

    // Return the date translations
    return res.json({ dates: docs });
  });
};

// Export the functions
module.exports.getDates = getDateTranslations;
module.exports.saveDate = saveDateTranslation;
module.exports.deleteDate = deleteDateTranslation;
module.exports.updateDate = updateDateTranslation;
