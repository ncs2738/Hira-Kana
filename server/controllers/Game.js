
// Load the game page
const gamePage = (req, res) => {
// Grab the user's translations

  // The app loaded right; reload the app again, and get a new token
  res.render('game');
};

// Export the functions
module.exports.gamePage = gamePage;
