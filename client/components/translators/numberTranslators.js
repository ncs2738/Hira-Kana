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

  const input = document.querySelector("#numberInput").value;

  // Create the json object
  const data = {};

  // Create a counter
  const counter = { counter: 0 };
  // Check if the input's actually valid or not

  if (Number.isNaN(input)) {
    // Letters were entered
    console.log("AAAA");
    return false;
  }

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

  console.log(data);

    sendAjax('GET', '/getToken', null, (result) =>
    {        
        ReactDOM.render(
            <NumberOutput number = {data} csrf={result.csrfToken}/>, output
        );
    });
};

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


  //const getTime = (e) =>
  //{
    /*

 //Takes the time inputs and finds if they are AM or PM
          //Also turns the times from strings into numbers                  
          getTime(time) {
            const [strHour, strMin] = time.split(':');
            hour = parseInt(strHour, 10);
            min = parseInt(strMin, 10);
            const midday = this.getMidday(hour);
            if (hour == 0) hour = 12;
            const scheduleTime = (hour * 100) + min;
            if (hour >= 13) hour -= 12;

            return [hour, min, midday, strHour, strMin, scheduleTime];
          },
        
          //Used for checking if the time is past or before midday
          getMidday(hour) {
            if (hour >= 12) {
              return 'PM';
            }

            return 'AM';
          },


    */

  /*
            //Add schedule does not post the schedule, but rather creates a entry in the schedule
          addSchedule() {
            // Check if the time fields have input
            if (this.timeX && this.timeY && this.message) {
                //They do, so grab them, and get their values
              const timeA = this.getTime(this.timeX);
              const timeB = this.getTime(this.timeY);
        
              //timeA is the starting time, and timeB is the ending
              const startTime = timeA[5];
              const endTime = timeB[5];
              //Flag to see if the new schedule's time was valid
              let valid = true;
        
              //Check to see if the schedule exists (For safety)
              if (this.schedule) {
                  //Check to see if the times actually are coherent; you can't have a schedule that starts at a later time than when it ends
                if (startTime >= endTime) {
                  this.status = 'Invalid time entererd!';
                  valid = false;
                }
        
                //Loop through the schedule and check the times; if one overlaps, it's invalid. Can't do 2 things at once.
                for (let i = 0; i < this.schedule.length; i++) {
                  if (this.schedule[i].startTime <= startTime && this.schedule[i].endTime >= endTime) {
                    this.status = 'That time slot is already taken!';
                    valid = false;
                  } else {
                    this.status = '';
                  }
                }
        
                //There's no invalid entries; create a new entry
                if (valid) {
                  const entry = {
                    startTime,
                    endTime,
                    time: `${timeA[0]}:${timeA[4]} ${timeA[2]} - ${timeB[0]}:${timeB[4]} ${timeB[2]}`,
                    entry: this.message,
                  };
        
                  //Push it onto the schedule, and sort it
                  this.schedule.push(entry);
                  this.schedule.sort((a, b) => a.startTime - b.startTime);
                }
              }
            }
          },
        
          //Get the user's previous schedule
          getSchedule() {
            const formData = `/getSchedule?username=${this.username}`;
            this.sendAjax(formData, 0, false);
            this.status = "Finding your Schedule..."
          },
        
          //Post your current schedule to the server and save it.
          postSchedule() {
            if(this.schedule.length > 0)
            {
              const jsonSchedule = JSON.stringify(this.schedule);
            const formData = `username=${this.username}&schedule=${jsonSchedule}`;
            this.sendPost('/addSchedule', formData, 0, false);
            this.status = "Saving your Schedule..."
            }
            else
            {
              this.status = "Please fill out your schedule before posting it!"
            }
          },
        
         
  */