// Require models
const models = require('../models');

// Set up the Translation models
const { TextTranslation } = models;

// Used for saving a new translation
const saveTextTranslation = (req, res) => {
  // Make sure all fields are there
  if (!req.body.translation) {
    return res.status(400).json({ error: 'Please enter a translation to be saved!' });
  }

  // Set an object to the variables + the owner's id
  const translationData = {
    translation: req.body.translation,
    owner: req.session.account._id,
  };

  // Create a new model in the database
  const newTranslation = new TextTranslation.TextTranslationModel(translationData);

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

const updateTextTranslation = (req, res) => {
  req.body.owner = req.session.account._id;
  TextTranslation.TextTranslationModel.update(req.body, (err, docs) => {
    // A error occured
    if (err) {
      console.log(err);
      return res.status(400).json({ err: 'An error occurred. Our apologies.' });
    }

    // The app loaded right; reload the app again, and get a new token
    return res.json({ translations: docs });
  });
};

// used for deleting the user's translations
const deleteTextTranslation = (req, res) => {
  // Send the translation-id, and check for errors
  TextTranslation.TextTranslationModel.deleteTranslation(req.body.id, (err, docs) => {
    // Failed in deleting right
    if (err) {
      console.log(err);
      return res.status(400).json({ error: 'Error in deleting. Our apologies.' });
    }

    // Deleted properly.
    return res.json({ translations: docs });
  });
};

// Get all of the user's translations
const getTextTranslations = (request, response) => {
  const req = request;
  const res = response;

  // Search for the owner
  return TextTranslation.TextTranslationModel.findByOwner(req.session.account._id, (err, docs) => {
    // An error occurred
    if (err) {
      console.log(err);
      return res.status(400).json({ error: 'An error occurred. Our apologies.' });
    }

    // Return the translations
    return res.json({ translations: docs });
  });
};

// Load the translation page
const translationsPage = (req, res) => {
  // Grab the user's translations

  TextTranslation.TextTranslationModel.findByOwner(req.session.account._id, (err, docs) => {
    // A error occured
    if (err) {
      console.log(err);
      return res.status(400).json({ err: 'An error occurred. Our apologies.' });
    }

    // The app loaded right; reload the app again, and get a new token
    return res.render('translations', { csrfToken: req.csrfToken(), translations: docs });
  });
};

// Export the functions
module.exports.translationsPage = translationsPage;
module.exports.getText = getTextTranslations;
module.exports.saveText = saveTextTranslation;
module.exports.deleteText = deleteTextTranslation;
module.exports.updateText = updateTextTranslation;
