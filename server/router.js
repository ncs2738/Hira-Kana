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
  // JSON loader for the translations
  app.get('/getJSON', mid.requiresLogin, controllers.JSONController.getJSON);

  // Text
  app.get('/getText', mid.requiresLogin, controllers.TextTranslation.getText);
  app.post('/translations', mid.requiresLogin, controllers.TextTranslation.saveText);
  app.post('/deleteText', mid.requiresLogin, controllers.TextTranslation.deleteText);
  app.post('/updateText', mid.requiresLogin, controllers.TextTranslation.updateText);

  // Date
  app.post('/dates', mid.requiresLogin, controllers.DateTranslation.saveDate);
  app.get('/getDate', mid.requiresLogin, controllers.DateTranslation.getDates);
  app.post('/deleteDate', mid.requiresLogin, controllers.DateTranslation.deleteDate);
  app.post('/updateDate', mid.requiresLogin, controllers.DateTranslation.updateDate);

  // Number
  app.post('/number', mid.requiresLogin, controllers.NumberTranslation.saveNumber);
  app.get('/getNumber', mid.requiresLogin, controllers.NumberTranslation.getNumbers);
  app.post('/deleteNumber', mid.requiresLogin, controllers.NumberTranslation.deleteNumber);
  app.post('/updateNumber', mid.requiresLogin, controllers.NumberTranslation.updateNumber);

  // Game
  app.get('/game', mid.requiresLogin, controllers.Game.gamePage);

  // Kanji Catcher
  app.get('/kanji', mid.requiresLogin, controllers.KanjiCatcher.kanjiPage);

  // Update Password
  app.get('/password', mid.requiresSecure, mid.requiresLogin, controllers.Account.passwordPage);
  app.post('/updatePassword', mid.requiresSecure, mid.requiresLogin, controllers.Account.update);

  // Account
  app.get('/login', mid.requiresSecure, mid.requiresLogout, controllers.Account.loginPage);
  app.post('/login', mid.requiresSecure, mid.requiresLogout, controllers.Account.login);
  app.post('/signup', mid.requiresSecure, mid.requiresLogout, controllers.Account.signup);
  app.get('/logout', mid.requiresLogin, controllers.Account.logout);
  app.get('/', mid.requiresSecure, mid.requiresLogout, controllers.Account.loginPage);
};

// Export our routes
module.exports = router;
