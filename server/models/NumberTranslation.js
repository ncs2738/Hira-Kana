// Load in mongoose
const mongoose = require('mongoose');

// Lets us use promises
mongoose.Promise = global.Promise;

// Set a empty Number-Translation-model variable
let NumberTranslationModel = {};

// mongoose.Types.ObjectID is a function
// that converts string ID to a real mongo ID
const convertId = mongoose.Types.ObjectId;

// Set the Number's model
const NumberTranslationSchema = new mongoose.Schema({
  number:
  {
    type: String,
    required: true,
  },

  kanji:
  {
    type: String,
    required: true,
  },

  reading:
  {
    type: String,
    required: true,
  },

  english:
  {
    type: String,
    required: true,
  },

  owner:
  {
    type: mongoose.Schema.ObjectId,
    required: true,
    ref: 'Account',
  },

  createdData:
  {
    type: Date,
    default: Date.now,
  },
});

// Set the app.session info
NumberTranslationSchema.statics.toAPI = (doc) => ({
  translation: doc.translation,
});

// Search the database for a user, and get all of their translations
NumberTranslationSchema.statics.findByOwner = (ownerId, callback) => {
  const search = {
    owner: convertId(ownerId),
  };

  // Search for the user, then grab all the stored translations
  // clean the data, and send it back in the callback
  return NumberTranslationModel.find(search).select('number kanji reading english').lean().exec(callback);
};

// Search the database and delete a translation by it's unique id
NumberTranslationSchema.statics.deleteTranslation = (ID, callback) => {
  // Search through the models, find the unique ID, and delete it
  NumberTranslationModel.deleteOne({ _id: ID }, callback);
};


// Search the database for the specific user's translations
NumberTranslationSchema.statics.update = (data, callback) => {
  // Convert the user's ID
  const search = {
    owner: convertId(data.owner),
  };

  const updateData = {
    number: data.number,
    kanji: data.kanji,
    reading: data.reading,
    english: data.english,
  };

  // Search for the translation by it's id, and update it's translation
  return NumberTranslationModel.find(search).findOneAndUpdate({ _id: data.id }, updateData,
    { useFindAndModify: false }, callback);
};

// Set the Number-translation-model data to the database's translations
NumberTranslationModel = mongoose.model('NumberTranslation', NumberTranslationSchema);

// export the translation model and it's schema
module.exports.NumberTranslationModel = NumberTranslationModel;
module.exports.NumberTranslationSchema = NumberTranslationSchema;
