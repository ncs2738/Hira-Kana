// Require models
const models = require('../models');

// Set up the Translation models
const { NumberTranslation } = models;

// Used for saving a new number translation
const saveNumberTranslation = (req, res) => {
  // Make sure all fields are there
  if (!req.body) {
    return res.status(400).json({ error: 'Please enter a number to be saved!' });
  }

  // Set an object to the variables + the owner's id
  const translationData = {
    number: req.body.number,
    kanji: req.body.kanji,
    reading: req.body.reading,
    english: req.body.english,
    translation: req.body.translation,
    owner: req.session.account._id,
  };

  // Create a new model in the database
  const newTranslation = new NumberTranslation.NumberTranslationModel(translationData);

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

const updateNumberTranslation = (req, res) => {
  req.body.owner = req.session.account._id;
  NumberTranslation.NumberTranslationModel.update(req.body, (err, docs) => {
    // A error occured
    if (err) {
      console.log(err);
      return res.status(400).json({ err: 'An error occurred. Our apologies.' });
    }

    // The app loaded right; reload the app again, and get a new token
    return res.json({ translations: docs });
  });
};

// used for deleting the user's number translations
const deleteNumberTranslation = (req, res) => {
  // Send the number translation's-id, and check for errors
  NumberTranslation.NumberTranslationModel.deleteTranslation(req.body.id, (err, docs) => {
    // Failed in deleting right
    if (err) {
      console.log(err);
      return res.status(400).json({ error: 'Error in deleting. Our apologies.' });
    }

    // Deleted properly.
    return res.json({ numbers: docs });
  });
};

// Get all of the user's number translations
const getNumberTranslations = (request, response) => {
  const req = request;
  const res = response;

  // Search for the owner
  return NumberTranslation.NumberTranslationModel
    .findByOwner(req.session.account._id, (err, docs) => {
    // An error occurred
      if (err) {
        console.log(err);
        return res.status(400).json({ error: 'An error occurred. Our apologies.' });
      }

      // Return the number translations
      return res.json({ numbers: docs });
    });
};

// Export the functions
module.exports.getNumbers = getNumberTranslations;
module.exports.saveNumber = saveNumberTranslation;
module.exports.deleteNumber = deleteNumberTranslation;
module.exports.updateNumber = updateNumberTranslation;
