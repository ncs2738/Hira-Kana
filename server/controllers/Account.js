// Require models
const models = require('../models');

// A variable for where the functions redirect you to
// Makes my life easier for changing the homepage
const redirectPage = '/translations';

// Set up the Account models
const { Account } = models;

// Get the login page
const loginPage = (req, res) => {
  // Load the login page, and get a new crsf Token
  res.render('login', { csrfToken: req.csrfToken() });
};

// Logout Function
const logout = (req, res) => {
  // Kill the request's session
  // This is found in the app.js function
  req.session.destroy();
  // Redirect them back to the main page
  res.redirect('/');
};

// Login Function
const login = (request, response) => {
  const req = request;
  const res = response;

  // force cast to strings to cover security flaws
  const username = `${req.body.username}`;
  const password = `${req.body.pass}`;

  // Check if the user entered both the password and username
  if (!username || !password) {
    return res.status(400).json({ error: 'All fields are required.' });
  }

  // Check if the password and usernames match
  return Account.AccountModel.authenticate(username, password, (err, account) => {
    if (err || !account) {
      return res.status(401).json({ error: 'Wrong username or password.' });
    }

    // Set the account's info in the app.session data
    req.session.account = Account.AccountModel.toAPI(account);

    // Redirect them to the main app
    return res.json({ redirect: redirectPage });
  });
};

// Sign Up Function
const signup = (request, response) => {
  const req = request;
  const res = response;

  // cast to strings to cover up security flaws
  req.body.username = `${req.body.username}`;
  req.body.pass = `${req.body.pass}`;
  req.body.pass2 = `${req.body.pass2}`;

  // Check if the user entered a username and 2 passwords
  if (!req.body.username || !req.body.pass || !req.body.pass2) {
    return res.status(400).json({ error: 'All fields are required.' });
  }

  // Check if the passwords match
  if (req.body.pass !== req.body.pass2) {
    return res.status(400).json({ error: 'Your passwords failed to match.' });
  }

  // Set up new security info for the new account
  return Account.AccountModel.generateHash(req.body.pass, (salt, hash) => {
    const accountData = {
      username: req.body.username,
      salt,
      password: hash,
    };

    // Create a new account model for the user
    const newAccount = new Account.AccountModel(accountData);


    // Start a new promise for the new account
    const savePromise = newAccount.save();

    // Set the promise
    savePromise.then(() => {
      // Set the account's info in the app.session data
      req.session.account = Account.AccountModel.toAPI(newAccount);
      // Then redirect it to the main app page
      res.json({ redirect: redirectPage });
    });

    // Check for errors
    savePromise.catch((err) => {
      // Already logged in
      if (err.code === 11000) {
        return res.status(400).json({ error: 'That username is already in use. Please choose another.' });
      }

      // There's a error, so return the problem
      return res.status(400).json({ error: 'An error occurred. Our apologies.' });
    });
  });
};

// Update Password
// /There's a bit to it sadly, but it's fairly clean.
const updatePassword = (request, response) => {
  const req = request;
  const res = response;

  // cast to strings to cover up security flaws
  req.body.curPassword = `${req.body.curPassword}`;
  req.body.pass = `${req.body.pass}`;
  req.body.pass2 = `${req.body.pass2}`;

  // Check if the user entered a username and 2 passwords
  if (!req.body.curPassword || !req.body.pass || !req.body.pass2) {
    return res.status(400).json({ error: 'All fields are required.' });
  }

  // Check if they aren't just entering the same password in
  if (req.body.curPassword === req.body.pass) {
    return res.status(400).json({ error: 'Please enter in a new password!' });
  }

  // Check if the new passwords match
  if (req.body.pass !== req.body.pass2) {
    return res.status(400).json({ error: 'Your passwords failed to match.' });
  }

  // Add the current owner to the body
  req.body.owner = req.session.account._id;

  // Update the password
  Account.AccountModel.updatePassword(req.body, (err) => {
    // A error occured
    if (err) {
      console.log(err);
      return res.status(400).json({ err: 'An error occurred. Our apologies.' });
    }

    // The password updated right, return successfully
    // Need a return statement here, so I just essentially return nothing.
    return 'success';
  });

  // return with a successfull 204 message
  return res.status(204).json({ message: 'Your password has been updated!' });
};

// Load the password update page
const passwordPage = (req, res) => {
  res.render('updatePassword', { username: req.session.account.username });
};

// Used for generating CSRF tokens
const getToken = (request, response) => {
  const req = request;
  const res = response;

  const csrfJSON = {
    csrfToken: req.csrfToken(),
  };

  res.json(csrfJSON);
};

// Export our login info
module.exports.loginPage = loginPage;
module.exports.login = login;
module.exports.logout = logout;
module.exports.signup = signup;
module.exports.getToken = getToken;
module.exports.passwordPage = passwordPage;
module.exports.update = updatePassword;
