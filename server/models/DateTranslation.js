// Load in mongoose
const mongoose = require('mongoose');

// Lets us use promises
mongoose.Promise = global.Promise;

// Set a empty Date-Translation-model variable
let DateTranslationModel = {};

// mongoose.Types.ObjectID is a function
// that converts string ID to a real mongo ID
const convertId = mongoose.Types.ObjectId;

// Set the Date's model
const DateTranslationSchema = new mongoose.Schema({
  date:
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

  translation:
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
DateTranslationSchema.statics.toAPI = (doc) => ({
  translation: doc.translation,
});

// Search the database for a user, and get all of their translations
DateTranslationSchema.statics.findByOwner = (ownerId, callback) => {
  const search = {
    owner: convertId(ownerId),
  };

  // Search for the user, then grab all the stored translations
  // clean the data, and send it back in the callback
  return DateTranslationModel.find(search).select('date kanji reading english translation').lean().exec(callback);
};

// Search the database and delete a translation by it's unique id
DateTranslationSchema.statics.deleteTranslation = (ID, callback) => {
  // Search through the models, find the unique ID, and delete it
  DateTranslationModel.deleteOne({ _id: ID }, callback);
};


// Search the database for the specific user's translations
DateTranslationSchema.statics.update = (data, callback) => {
  // Convert the user's ID
  const search = {
    owner: convertId(data.owner),
  };

  const updateData = {
    date: data.date,
    kanji: data.kanji,
    reading: data.reading,
    english: data.english,
    translation: data.translation,
  };

  // Search for the translation by it's id, and update it's translation
  return DateTranslationModel.find(search).findOneAndUpdate({ _id: data.id }, updateData,
    { useFindAndModify: false }, callback);
};

// Set the Date-translation-model data to the database's translations
DateTranslationModel = mongoose.model('DateTranslation', DateTranslationSchema);

// export the translation model and it's schema
module.exports.DateTranslationModel = DateTranslationModel;
module.exports.DateTranslationSchema = DateTranslationSchema;
