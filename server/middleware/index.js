// A variable for where the functions redirect you to
// Makes my life easier for changing the homepage
const redirectPage = '/translations';

// Middleware for logging in
const requiresLogin = (req, res, next) => {
  // If we're not logged in, go back to the main login page
  if (!req.session.account) {
    return res.redirect('/');
  }
  return next();
};

// Middleware for logging out
const requiresLogout = (req, res, next) => {
  // If we can actually log out, redirect to the maker page
  if (req.session.account) {
    return res.redirect(redirectPage);
  }

  return next();
};

// Makes sure the users does things securely; that we are always using HTTPS
const requiresSecure = (req, res, next) => {
  if (req.headers['x-forwarded-proto'] !== 'https') {
    return res.redirect(`https://${req.hostname}${req.url}`);
  }
  return next();
};

const bypassSecure = (req, res, next) => {
  next();
};

module.exports.requiresLogin = requiresLogin;
module.exports.requiresLogout = requiresLogout;

// Checks our current environment; if we're using heroku, use the first one
if (process.env.NODE_ENV === 'production') {
  module.exports.requiresSecure = requiresSecure;
} else {
  module.exports.requiresSecure = bypassSecure;
}
