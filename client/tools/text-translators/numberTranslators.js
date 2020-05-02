let dates;
let numerics;
let today;

let output = document.querySelector("#translationOutput");

const setNumberJSON = (jsonDictionary) =>
{
    //Read in the JSON file data
    dates = jsonDictionary.dates
    numerics = jsonDictionary.numerics;

    //Get today's current date
    today = new Date();
    //Get the time-zone offset
    const offset = today.getTimezoneOffset()/60;
    //Set the offset
    today.setHours(today.getHours() + offset);
}

const getDate = (e) => 
{
    //Keep the page from updating
    e.preventDefault();
    
    //new JSON object
    const date = {};

    //Read in the search
    const search = document.querySelector("#dateInput").value;
    //Parse it's data
    const info = search.split("-");

    //Get each individual date from the search
    const d = info[2] - 1;
    const m = info[1] - 1;
    const y = info[0] - 0;
    //Find what day the date is using a new date
    const w = new Date(search).getDay();

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
    
    //return date;
    
    sendAjax('GET', '/getToken', null, (result) =>
    {        
        ReactDOM.render(
            <DateOutput date = {date} csrf={result.csrfToken}/>, output
        );
    });
};

// Used for translating numbers from english to japanese
const getNumber = (e) =>
{
    e.preventDefault();     

  //get the number value
  const input = document.querySelector("#numberInput").value;

  //Check if there's no input
  if(input == "")
  {
    //There was, so return false
    handleError("Please enter in a number to be translated.");
    //Send the nothing to be displayed
    loadNumber([]);
    return false;
  }
  //Check if a letter was entered
  else if (isNaN(input)) {
    // Letters were entered
    handleError("No text is allowed.");
    //Send the nothing to be displayed
    loadNumber([]);
    return false;
  }
  else
  {
    //A valid number was entered
    clearError();
  }

  // Create the json object
  const data = {};

  // Create a counter
  const counter = { counter: 0 };
  // Check if the input's actually valid or not



  // translate the string back into a number, and get it's length
  const numString = input.toString();
  const { length } = numString;
  data.number = input;
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

  //Send the number to be displayed
  loadNumber(data);
};

const loadNumber = (data) =>
{
  sendAjax('GET', '/getToken', null, (result) =>
  {        
      ReactDOM.render(
          <NumberOutput number = {data} csrf={result.csrfToken}/>, output
      );
  });
}

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