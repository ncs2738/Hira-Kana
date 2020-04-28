// Load in mongoose and the ability to use cryptos
const crypto = require('crypto');
const mongoose = require('mongoose');

// Lets us use promises
mongoose.Promise = global.Promise;

// mongoose.Types.ObjectID is a function
// that converts string ID to a real mongo ID
const convertId = mongoose.Types.ObjectId;

// Security info
let AccountModel = {};
const iterations = 10000;
const saltLength = 64;
const keyLength = 64;

// Set up the base account model
const AccountSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    trim: true,
    unique: true,
    match: /^[A-Za-z0-9_\-.]{1,16}$/,
  },
  salt: {
    type: Buffer,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  createdDate: {
    type: Date,
    default: Date.now,
  },
});

// Set the account's username and database ID
AccountSchema.statics.toAPI = (doc) => ({
  // _id is built into your mongo document and is guaranteed to be unique
  username: doc.username,
  _id: doc._id,
});

// Lets us create secure passwords
const validatePassword = (doc, password, callback) => {
  const pass = doc.password;

  return crypto.pbkdf2(password, doc.salt, iterations, keyLength, 'RSA-SHA512', (err, hash) => {
    if (hash.toString('hex') !== pass) {
      return callback(false);
    }
    return callback(true);
  });
};

// Search the database for the username
AccountSchema.statics.findByUsername = (name, callback) => {
  const search = {
    username: name,
  };

  // Search through all the models and return the results
  return AccountModel.findOne(search, callback);
};

// Generate a safe hash-code for logging in
AccountSchema.statics.generateHash = (password, callback) => {
  const salt = crypto.randomBytes(saltLength);

  crypto.pbkdf2(password, salt, iterations, keyLength, 'RSA-SHA512', (err, hash) => callback(salt, hash.toString('hex')));
};

// Check if the user has logged in properly
AccountSchema.statics.authenticate = (username, password, callback) => {
  // Find the user
  AccountModel.findByUsername(username, (err, doc) => {
    if (err) {
      return callback(err);
    }

    if (!doc) {
      return callback();
    }

    // Check if their password is valid
    return validatePassword(doc, password, (result) => {
      if (result === true) {
        return callback(null, doc);
      }

      return callback();
    });
  });
};

// Search the database for the specific user and update their password
AccountSchema.statics.updatePassword = (data, callback) => {
  AccountModel.findByUsername(data.username, (err, doc) => {
    if (err) {
      return callback(err);
    }

    if (!doc) {
      return callback();
    }

    // Check if their password is valid
    return validatePassword(doc, data.password, (result) => {
      if (result === true) {
        return callback(null, doc);
      }

      return callback();
    });
  });


  // Convert the user's ID
  const search = {
    _id: convertId(data.owner),
  };

  // Generate a new password hash
  AccountModel.generateHash(data.pass, (salt, hash) => {
    const updateData = {
      salt,
      password: hash,
    };

    // Search for the account by it's id, and update their password
    return AccountModel.find(search).findOneAndUpdate(search, updateData,
      { useFindAndModify: false }, callback);
  });
};

// Set the model
AccountModel = mongoose.model('Account', AccountSchema);

// Export the model and it's schema
module.exports.AccountModel = AccountModel;
module.exports.AccountSchema = AccountSchema;
