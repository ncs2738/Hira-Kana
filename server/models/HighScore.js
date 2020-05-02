// Load in mongoose
const mongoose = require('mongoose');

// Lets us use promises
mongoose.Promise = global.Promise;

// Set a score-model variable
let HighScoreModel = {};

// mongoose.Types.ObjectID is a function
// that converts string ID to a real mongo ID
const convertId = mongoose.Types.ObjectId;

// Set the score's model
const HighScoreSchema = new mongoose.Schema({
  score:
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

// Search the database for a user, and get their score
HighScoreSchema.statics.findByOwner = (ownerId, callback) => {
  const search = {
    owner: convertId(ownerId),
  };

  // Search for the user, then grab their score
  // clean the data, and send it back in the callback
  return HighScoreModel.find(search).select('score').lean().exec(callback);
};

// Search the database and delete a Score by it's unique id
HighScoreSchema.statics.deleteScore = (ID, callback) => {
  // Search through the models, find the unique ID, and delete it
  HighScoreModel.deleteOne({ _id: ID }, callback);
};


// Search the database for the specific user's Scores
HighScoreSchema.statics.update = (data, callback) => {
  // Convert the user's ID
  const search = {
    owner: convertId(data.owner),
  };

  const updateData = {
    score: data.score,
  };

  // Search for the score by it's id, and update it
  return HighScoreModel.find(search).findOneAndUpdate({ _id: data.id }, updateData,
    { useFindAndModify: false }, callback);
};

// Set the score-Score-model data to the database's Scores
HighScoreModel = mongoose.model('HighScore', HighScoreSchema);

// export the Score model and it's schema
module.exports.HighScoreModel = HighScoreModel;
module.exports.HighScoreSchema = HighScoreSchema;
