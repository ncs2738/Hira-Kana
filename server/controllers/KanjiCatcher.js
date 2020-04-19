
// Load the game page
const kanjiPage = (req, res) => {
// Grab the user's translations

  // The app loaded right; reload the app again, and get a new token
  res.render('kanjiCatcher');
};

// Export the functions
module.exports.kanjiPage = kanjiPage;
