// Load in our controllers
const controllers = require('./controllers');
// Load in our middleware routes
const mid = require('./middleware');

// Set up our endpoints
const router = (app) => {
  // Token
  app.get('/getToken', mid.requiresSecure, controllers.Account.getToken);

  // Translations
  app.get('/translations', mid.requiresLogin, controllers.TextTranslation.translationsPage);
  app.get('/getTranslations', mid.requiresLogin, controllers.TextTranslation.getTranslations);
  app.post('/translations', mid.requiresLogin, controllers.TextTranslation.save);
  app.post('/deleteTranslation', mid.requiresLogin, controllers.TextTranslation.delete);
  app.post('/updateTranslation', mid.requiresLogin, controllers.TextTranslation.update);

  app.get('/getDate', mid.requiresLogin, controllers.NumberTranslation.getDate);
  // app.get('/getNumber', mid.requiresLogin, controllers.NumberTranslation.getNumber);

  // Game
  app.get('/game', mid.requiresLogin, controllers.Game.gamePage);

  // Kanji Catcher
  app.get('/kanji', mid.requiresLogin, controllers.KanjiCatcher.kanjiPage);

  // Account
  app.get('/login', mid.requiresSecure, mid.requiresLogout, controllers.Account.loginPage);
  app.post('/login', mid.requiresSecure, mid.requiresLogout, controllers.Account.login);
  app.post('/signup', mid.requiresSecure, mid.requiresLogout, controllers.Account.signup);
  app.get('/logout', mid.requiresLogin, controllers.Account.logout);
  app.get('/', mid.requiresSecure, mid.requiresLogout, controllers.Account.loginPage);
};

// Export our routes
module.exports = router;
