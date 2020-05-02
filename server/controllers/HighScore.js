// Require models
const models = require('../models');

// Set up the Score models
const { HighScore } = models;

// Used for saving a new number Score
const saveHighScore = (req, res) => {
  // Make sure all fields are there
  if (!req.body) {
    return res.status(400).json({ error: 'An error occured. Our apologies.' });
  }

  // Set an object to the variables + the owner's id
  const ScoreData = {
    score: '0',
    owner: req.session.account._id,
  };

  // Create a new model in the database
  const newScore = new HighScore.HighScoreModel(ScoreData);

  // Make the promise
  const ScorePromise = newScore.save();

  // Set the promise
  ScorePromise.then(() => res.json({ redirect: '/game' }));

  // Check for errors
  ScorePromise.catch((err) => {
    console.log(err);

    // The Score already exists
    if (err.code === 11000) {
      return res.status(400).json({ error: 'You already have that Score saved!' });
    }

    // There's a error, so return the problem
    return res.status(400).json({ error: 'An error occured. Our apologies' });
  });

  return ScorePromise;
};

const updateHighScore = (req, res) => {
  req.body.owner = req.session.account._id;

  HighScore.HighScoreModel.update(req.body, (err, docs) => {
    // A error occured
    if (err) {
      console.log(err);
      return res.status(400).json({ err: 'An error occurred. Our apologies.' });
    }

    // The app loaded right; reload the app again, and get a new token
    return res.json({ Score: docs });
  });
};

// Get all of the user's number Scores
const getHighScores = (request, response) => {
  const req = request;
  const res = response;

  // Search for the owner
  return HighScore.HighScoreModel
    .findByOwner(req.session.account._id, (err, docs) => {
    // An error occurred
      if (err) {
        console.log(err);
        return res.status(400).json({ error: 'An error occurred. Our apologies.' });
      }

      // Return the Score Scores
      return res.json({ Scores: docs });
    });
};

// Load the game page
const gamePage = (req, res) => {
  res.render('game', { username: req.session.account.username });
};

// Export the functions
module.exports.getScore = getHighScores;
module.exports.saveScore = saveHighScore;
module.exports.updateScore = updateHighScore;
module.exports.gamePage = gamePage;
