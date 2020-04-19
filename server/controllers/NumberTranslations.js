const fs = require('fs');

// Variables used for the json files
// let numerics = {};
let dates = {};

// Get the current date, then translate it into japanese
const getDate = (req, res) => {
  const date = {};

  const today = new Date();
  const d = today.getDate();
  const m = today.getMonth();
  const y = today.getFullYear();
  const w = today.getDay();

  // Get the days, week, and month translations
  const day = dates.days[d];
  const weekday = dates.weekdays[w];
  const month = dates.months[m];

  // Return the JSON block
  date.date = `${m + 1}/${d + 1}/${y}`;
  date.kanji = `${month.kanji + day.kanji} (${weekday.kanji})`;
  date.reading = `${month.reading} ${day.reading} (${weekday.reading})`;
  date.english = `${month.english} ${day.english} (${weekday.english})`;
  date.translation = `${month.month} ${day.date} (${weekday.day})`;

  return res.json({ date });
};

/*
// Search the numeric array and retrieve the kanji based off the number
const appendNumbers = (num, array, response, isPower) => {
  // Parse the number and get it's json array relation
  const searchNum = Number.parseInt(num, 10);
  const number = array[searchNum];

  // Check If the current power is a single-character kanji,
  // and the number entered is either 1 or 0, we skip it.
  if ((isPower && searchNum === 1) || (isPower && searchNum === 0)) {
    response.english += ' ';
  } else {
    // The numbers valid, so append it's values to the JSON object
    response.kanji = number.kanji + response.kanji;
    response.reading = `${number.reading} ${response.reading}`;
    response.english = `${number.english} ${response.english}`;
  }
};


// Used for translating numbers from english to japanese
const getNumber = (req, res) => {
  console.log(req.body);

  const input = req.body.number;

  // Create the json object
  const data = {};

  // Create a counter
  const counter = { counter: 0 };
  // Check if the input's actually valid or not

  const checker = parseInt(input.number, 10);

  if (Number.isNaN(checker)) {
    // Letters were entered
    // Return a bad request
    data.id = 'badRequest';
    data.message = 'Please enter in a valid number!';
  }

  // translate the string back into a number, and get it's length
  const numString = input.number.toString();
  const { length } = numString;
  data.num = input.number;
  // Create the JSON variables
  data.kanji = '';
  data.reading = '';
  data.english = '';

  // Loop through the number
  for (let i = length; i >= 1; i--) {
    // Make sure there are no 0's; They are not counted in japanese
    if (numString[i - 1] !== '0') {
      // Use the counter to start at the first number on the right
      // Case 0 would be 1, case 1 would be 10, case 2 would be 100, etc
      switch (counter.counter) {
        case 9:
          appendNumbers(0, numerics.powers, data, false);
          appendNumbers(4, numerics.powers, data, false);
          appendNumbers(numString[i - 1], numerics.numbers, data, false);
          break;

        case 8:
          appendNumbers(4, numerics.powers, data, false);
          appendNumbers(numString[i - 1], numerics.numbers, data, false);
          break;

        case 7:
          appendNumbers(2, numerics.powers, data, true);
          appendNumbers(numString[i - 1], numerics.numbers, data, false);
          break;

        case 6:
          appendNumbers(1, numerics.powers, data, false);
          appendNumbers(numString[i - 1], numerics.numbers, data, true);
          break;

        case 5:
          appendNumbers(0, numerics.powers, data, false);
          appendNumbers(numString[i - 1], numerics.numbers, data, false);
          break;

        case 4:
          appendNumbers(3, numerics.powers, data, false);
          appendNumbers(numString[i - 1], numerics.numbers, data, false);
          break;

        case 3:
          appendNumbers(2, numerics.powers, data, false);
          appendNumbers(numString[i - 1], numerics.numbers, data, true);
          break;

        case 2:
          appendNumbers(1, numerics.powers, data, false);
          appendNumbers(numString[i - 1], numerics.numbers, data, true);
          break;

        case 1:
          appendNumbers(0, numerics.powers, data, false);
          appendNumbers(numString[i - 1], numerics.numbers, data, true);
          break;

        case 0:
          appendNumbers(numString[i - 1], numerics.numbers, data, false);
          break;

        default:
          data.english += ' ';
          break;
      }
    }
    // increment the counter
    counter.counter++;
  }

  return res.json({ data });
};
*/

// Read in the files at the start of the program
const init = () => {
  // load in the JSON data

  // const numberKanji = fs.readFileSync(`${__dirname}/../json/Numerical-Kanji.json`);
  const dateFile = fs.readFileSync(`${__dirname}/../json/Dates.json`);

  // numerics = JSON.parse(numberKanji).numbers;
  dates = JSON.parse(dateFile).dates;
};


// Export the functions
// module.exports.getNumber = getNumber;
module.exports.getDate = getDate;

init();
