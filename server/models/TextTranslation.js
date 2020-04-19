// Load in mongoose
const mongoose = require('mongoose');

// Lets us use promises
mongoose.Promise = global.Promise;

// Set a empty Text-Translation-model variable
let TextTranslationModel = {};

// mongoose.Types.ObjectID is a function
// that converts string ID to a real mongo ID
const convertId = mongoose.Types.ObjectId;

// Set the Text's model
const TextTranslationSchema = new mongoose.Schema({
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
TextTranslationSchema.statics.toAPI = (doc) => ({
  translation: doc.translation,
});

// Search the database for a user, and get all of their translations
TextTranslationSchema.statics.findByOwner = (ownerId, callback) => {
  const search = {
    owner: convertId(ownerId),
  };

  // Search for the user, then grab all the stored translations
  // clean the data, and send it back in the callback
  return TextTranslationModel.find(search).select('translation').lean().exec(callback);
};

// Search the database and delete a translation by it's unique id
TextTranslationSchema.statics.deleteTranslation = (ID, callback) => {
  // Search through the models, find the unique ID, and delete it
  TextTranslationModel.deleteOne({ _id: ID }, callback);
};


// Search the database for the specific user's translations
TextTranslationSchema.statics.update = (data, callback) => {
  // Convert the user's ID
  const search = {
    owner: convertId(data.owner),
  };


  const updateData = {
    translation: data.translation,
  };

  // Search for the translation by it's id, and update it's translation
  return TextTranslationModel.find(search).findOneAndUpdate({ _id: data.id }, updateData,
    { useFindAndModify: false }, callback);
};

// Set the text-translation-model data to the database's translations
TextTranslationModel = mongoose.model('TextTranslation', TextTranslationSchema);

// export the translation model and it's schema
module.exports.TextTranslationModel = TextTranslationModel;
module.exports.TextTranslationSchema = TextTranslationSchema;
