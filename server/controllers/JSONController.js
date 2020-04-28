// Lets us read in local files
const fs = require('fs');

// A giant JSON file to hold all of my translated data + dictionary lists
let data = {};

// Read in the files at the start of the program
const init = () => {
  // load in the JSON files
  const numberKanji = fs.readFileSync(`${__dirname}/../json/Numerical-Kanji.json`);
  const dateFile = fs.readFileSync(`${__dirname}/../json/Dates.json`);
  const textFile = fs.readFileSync(`${__dirname}/../json/Text.json`);
  const dictFile = fs.readFileSync(`${__dirname}/../json/Dictionaries.json`);

  // Parse them all
  const numerics = JSON.parse(numberKanji).numbers;
  const { dates } = JSON.parse(dateFile);
  const text = JSON.parse(textFile);
  const dictionaries = JSON.parse(dictFile);

  // Combine them all into one giant dictionary to be used
  data = {
    numerics, dates, text, dictionaries,
  };
};

// Simply return the JSON dictionary
const getJSON = (req, res) => res.json(data);

// Export the functions
module.exports.getJSON = getJSON;

// Call the window on startup
init();
