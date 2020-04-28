"use strict";

//Load the page and set off the chain of events
$(document).ready(function () {//getToken();
});
"use strict";

//Show our domo friend if there's an error
var handleError = function handleError(message) {
  $("#errorMessage").text(message);
  $("#domoMessage").animate({
    width: 'toggle'
  }, 350);
}; //Hide the domo-friend when they're not needed


var redirect = function redirect(response) {
  $("#domoMessage").animate({
    width: 'hide'
  }, 350);
  window.location = response.redirect;
}; //Send AJAX info between our scripts


var sendAjax = function sendAjax(type, action, data, success) {
  $.ajax({
    cache: false,
    type: type,
    url: action,
    data: data,
    dataType: "json",
    success: success,
    error: function error(xhr, status, _error) {
      var messageObj = JSON.parse(xhr.responseText);
      handleError(messageObj.error);
    }
  });
};
"use strict";

///This is a very small file with only one function
//But it did not belong in either the textTranslations.js file
//nor did it belong in the numberTranslations.js fule
//due to both of these files relying on the JSON files being read in.
//Load the page and set off the chain of events
$(document).ready(function () {
  //Get the JSON files read in from file
  sendAjax('GET', '/getJSON', null, function (res) {
    //Set the text dictionaries
    setTextJSON(res); //Set the number dictionaries

    setNumberJSON(res);
  });
});
"use strict";

var alphabet;
var dictionaries;
var inputData = {
  title: 'Kanji Finder',
  //Title for the page
  placeholder: "Type here to translate!",
  //Placeholder text for the textbox
  message: "",
  //Variable used for the vue-model
  characterArray: "",
  //Variable used for holding the current character array (Either hiragana or Katakana)
  arrayName: "",
  //Variable used for holding the current alpahbet array's name (EX: k, s, g, z)
  state: 1,
  //Variable used for controlling the case checking state
  stateIndex: 0,
  //Index used for getting specific character array in the overall alphabet array; EX: if index == 1, the character array is K
  pos: 0,
  //Value containing input field position 
  tmpPos: 0,
  //Temp value used for comparing position
  selectedTerm: "Kunyomi",
  //Variable used for holding current select option
  textBoxReference: "" //Variable used for storing the textbox target

};

var inputHandler = function inputHandler(e) {
  inputData.message = e.target.value;
  inputData.textBoxReference = e.target; // this.setState({message: this.refs.inputField.value});   
  //If the chosen reading term is english, literally ignore all of this. Nothing needs to be translated

  if (inputData.selectedTerm != "English") {
    inputData.pos = e.target.selectionStart; //Gets the current position of the input field

    if (inputData.tmpPos == inputData.pos || inputData.tmpPos > inputData.pos || inputData.tmpPos + 1 < inputData.pos) //Checks to see if the position has moved too far from where they last typed
      {
        inputData.state = 1; //If they have, reset the state back to 1
      }

    inputData.tmpPos = inputData.pos; //Sets reference value of where they last typed
    //If the input was not at the end of the string...

    if (inputData.pos != inputData.message.length) {
      //Check the farthest case away (four characters), and check to see if the character correlates any valid Japanese characters
      for (var i = 4; i >= 1; i--) {
        var tmp = inputData.message.charAt(inputData.pos - i); //Finds the character last typed in the text field

        if (alphabet[tmp] !== undefined || dictionaries.specialDictionary[tmp] !== undefined) //Checks to see if the character exists in either dictionary
          {
            //It does, so check which dictionary it's in
            alphabet[tmp] !== undefined ? inputData.characterArray = tmp : inputData.characterArray = dictionaries.specialDictionary[tmp]; //Set the state to the current loop's number. The state-check will handle the rest now.

            inputData.state = i;
            break;
          }
      }
    } //Reads in the complete string from the text field


    var _char = inputData.message.charAt(inputData.pos - 1); //Finds the character last typed in the text field
    //Sets the alphabet to be typed in. Kunyomi is for hiragana, and Onyumi is for katakana.


    _char.toLowerCase() == _char ? inputData.arrayName = "hiraVowels" : inputData.arrayName = "kataVowels"; //(inputData.selectedTerm == "Kunyomi" ? inputData.arrayName = "hiraVowels" : inputData.arrayName = "kataVowels")

    _char = _char.toLowerCase(); //Set the character back to lowercase

    stateCheck(_char); //Check which state we are in.
  }
}; //Handles the state variable. The state is essentially the length of the input the user is typing.
//EX: For the character "ka", it would go from case one for 'k', then to case 2 for 'a', and then print the character for 'ka'
//So for the character 'kya', it would need to go to state 3 to be printed. 
//Two special characters, 'chi' and 'shi' could be spelt "chya" or "shya" for their y values, so the most amount of cases would be 4
//Parameters: user keystroke input


var stateCheck = function stateCheck(input) {
  switch (inputData.state) {
    case 1:
      {
        firstCase(input);
        break;
      }

    case 2:
      {
        secondCase(input);
        break;
      }

    case 3:
      {
        thirdCase(input);
        break;
      }

    case 4:
      {
        fourthCase(input);
        break;
      }
  }
}; //Handles base inputs. At the start of every valid input chain, checks to see if the character has any japanese characters related to it.
//Parameters: user keystroke input


var firstCase = function firstCase(input) {
  if (dictionaries.vowelDictionary[input] !== undefined) //If the user tpyed a vowel, check to see which vowel
    {
      inputData.characterArray = "vowels";
      printCharacter(setCharacter(dictionaries.vowelDictionary[input]), 1);
    }

  if (input == "v") {
    printCharacter(alphabet["special"]["kataV"], inputData.state);
  } else if (alphabet[input] !== undefined) //If the user typed a letter, check which letter to set the stateIndex to it's array position
    {
      if (input == "n") //n is a special case; it has both a single character, a vowel array, and a y array.
        {
          setArray("hiraN", "kataN");
          printCharacter(alphabet[input][inputData.arrayName], inputData.state);
        }

      inputData.characterArray = input; //Set the array's pointer to be to the input just entered

      inputData.state = 2; //and set the state to 2 so we move onto the second case
    } else if (dictionaries.specialDictionary[input] !== undefined) {
    inputData.characterArray = dictionaries.specialDictionary[input]; //Set the array's pointer to be to the input just entered

    inputData.state = 2;
  } else if (dictionaries.punctuationDictionary[input] !== undefined) {
    printCharacter(alphabet["punctuation"][dictionaries.punctuationDictionary[input]], inputData.state);
  } else {
    inputData.state = 1;
  }
}; //Handles second case inputs (IE, If the input will be 2 characters long).
//Parameters: user keystroke input


var secondCase = function secondCase(input) {
  var preChar = inputData.message.charAt(inputData.pos - 2).toLowerCase(); //Gets the character right before the current position
  //If the character is a tsu, (so for example, kk was entered)...

  if (dictionaries.tsuList.includes(preChar) && preChar == input) {
    setArray("hiraTsu", "kataTsu"); //Set the array to tsu

    if (inputData.arrayName == "kataTsu") input = input.toUpperCase(); //set the character after the tsu to the appropriate typing.

    printCharacter(input, 1, true); //print the character
  } //Check the previous character behind the input
  else if (dictionaries.specialDictionary[preChar] !== undefined && preChar != "l") {
      switch (preChar) {
        //These c, f, and j are special characters, so they need to be handled uniquely. 
        case "c":
          {
            //If the next input after the c is h, go onto the next step. if not, reset.
            input == "h" ? inputData.state = 3 : resetState(1, input);
            break;
          }

        case "f":
          {
            //Check if the input is u
            uCheck(input, 2);
            break;
          }

        case "j":
          {
            //Checks if the input is i, then go and check if the input is a y-vowel
            iCheck(input, 2);
            break;
          }

        case "w":
          {
            if (input == "a" || input == "o") //If the user typed a y-character vowel, check to see which vowel
              {
                var num;
                input == "a" ? num = 0 : num = 1;
                printCharacter(setCharacter(num), 1);
              } else //The user entered no valid inputs; return to the first case.
              {
                resetState(1, input);
              }

            break;
          }

        case "y":
          {
            //Check if the input is a y-vowel
            yCheck(input, 1);
            break;
          }

        case "_":
          {
            if (dictionaries.vowelDictionary[input] !== undefined) //If the user tpyed a vowel, check to see which vowel
              {
                inputData.arrayName = "kataVowels";
                printCharacter(setCharacter(dictionaries.vowelDictionary[input]), 1);
              } else //The user entered no valid inputs; return to the first case.
              {
                resetState(1, input);
              }

            break;
          }
      }
    } else if (dictionaries.vowelDictionary[input] !== undefined) //If the user typed a vowel, check to see which vowel
      {
        printCharacter(setCharacter(dictionaries.vowelDictionary[input]), 1);
      } else if (lastChar('s') || lastChar('t') || input == "y") {
      inputData.state = 3;
    } else {
      resetState(1, input); //Reset the state
    }
}; //Handles third case inputs (IE, If the input will be 3 characters long).
//Mainly handles y-character checks
//Parameters: user keystroke input


var thirdCase = function thirdCase(input) {
  var preChar = inputData.message.substring(inputData.pos - 3, inputData.pos - 1).toLowerCase(); //Gets the last 2 letters inputted

  if (preChar == 'sh' || preChar == "ch") //Used for the character 'shi' or 'chi'. If last two inputs were 'sh' or 'ch'...
    {
      iCheck(input, 2);
    } else if (preChar == 'ts') //Used for character 'tsu'.  If last two inputs were 'ts'
    {
      uCheck(input, 2);
    } else {
    yCheck(input, 2);
  }
}; //Final case; handles only for 'shy_' and 'chy_'. (IE, the input length is 4)
//Parameters: user keystroke input


var fourthCase = function fourthCase(input) {
  yCheck(input, 2);
}; //Used to 'print' characters to the textfield
//Parameter: japanese character, the next state num, position buffer (adds to the current textfield position)


var printCharacter = function printCharacter(_char2, posBuffer) {
  var tsuCheck = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
  var val = inputData.message; //Reads in textfield value

  if (inputData.pos == val.length) //If we are at the end of the text field...
    {
      var stringField = val.substring(0, val.length - inputData.state); //Cut off the last few character inputs

      !tsuCheck ? stringField += _char2 : stringField += alphabet["tsu"][inputData.arrayName] + _char2; //Set the current string to the new character

      inputData.message = stringField; //set the textfield value to the new string

      inputData.textBoxReference.value = inputData.message;
    } else //We are not at the end of the text field
    {
      var stringStart = val.substring(0, inputData.pos - inputData.state); //Get the string prior to the current text field position

      var _stringField = val.substring(inputData.pos - inputData.state, inputData.pos); //Get the current string at the current text field position


      var stringEnd = val.substring(inputData.pos, val.length); //Get the string after the current text field position

      if (!tsuCheck) //If the character inputted was not a tsu...
        {
          _stringField = _char2; //just set the stringField to the character being typed
        } else {
        _stringField = alphabet["tsu"][inputData.arrayName] + _char2; //Set the current string to a tsu character

        posBuffer += 1;
      }

      inputData.message = stringStart + _stringField + stringEnd; //Set the textfield to the combination of the strings

      inputData.textBoxReference.value = inputData.message;
      var tmp = inputData.state; //temp variable for state; state gets modified in the next call
      //Sets the new position to be right after where the new character was added

      inputData.textBoxReference.setSelectionRange(inputData.pos - tmp + posBuffer, inputData.pos - tmp + posBuffer);
    }
}; //Function used for reverting back to the first case or the second case/
//Parameters: next-state number, user keystroke input


var resetState = function resetState(num, input) {
  var preChar = inputData.message.charAt(inputData.pos - 2).toLowerCase(); //Gets the character right before the current position

  if (alphabet[preChar] !== undefined) {
    inputData.characterArray = preChar;
  } else if (dictionaries.vowelDictionary[input] !== undefined) {
    inputData.characterArray = "vowels";
  }

  inputData.state = num; //sets the next case state.

  if (inputData.state == 1) //If first, go directly to the first case.
    {
      firstCase(input);
    } else //If second...
    {
      secondCase(input); //go to second case.
    }
}; //Used for checking the last characters inputted.
//returns true or false.
//Parameters: Last user keystroke input


var lastChar = function lastChar(_char3) {
  //Reads in value up to last input and lowercases both the value and the character inputted
  var val = inputData.message.substring(0, inputData.pos - 1).toLowerCase();
  _char3 = _char3.toLowerCase(); //Character is the last character inputted

  if (val.charAt(val.length - 1) == _char3) // if the last character of the value string is the same as the last character inputted...
    {
      return true; //return true
    }

  return false; //if not, return false.
}; //Checks if the new array should be in hiragana or katakana


var setArray = function setArray(hiraArray, kataArray) {
  inputData.arrayName == "hiraVowels" ? inputData.arrayName = hiraArray : inputData.arrayName = kataArray;
}; //Sets the new character to be printed


var setCharacter = function setCharacter(charNum) {
  return alphabet[inputData.characterArray][inputData.arrayName][charNum];
}; //Checks if the character inputted was a 'u'


var uCheck = function uCheck(input, stateIndex) {
  if (input == "u") {
    printCharacter(setCharacter(2), 1);
  } else //The user entered no valid inputs; return to the first case.
    {
      resetState(stateIndex, input);
    }
}; //Checks to see if the character inputted is a valid y-vowel


var yCheck = function yCheck(input, stateIndex) {
  if (dictionaries.yDictionary[input] !== undefined) {
    setArray("hiraYs", "kataYs");
    printCharacter(setCharacter(dictionaries.yDictionary[input]), stateIndex);
  } else if (input == "y" && inputData.state <= 3) {
    inputData.state++;
  } else {
    resetState(stateIndex, input);
  }
}; //Checks to see if the character inputted was 'i'. If not, go onto seeing if it was a y-vowel


var iCheck = function iCheck(input, stateIndex) {
  if (input == "i") {
    printCharacter(setCharacter(1), 1);
  } else {
    yCheck(input, stateIndex);
  }
};

var setTextJSON = function setTextJSON(jsonDictionary) {
  alphabet = jsonDictionary.text;
  dictionaries = jsonDictionary.dictionaries;
};
"use strict";

var dates;
var numerics;
var today;
var output = document.querySelector("#translationOutput");

var setNumberJSON = function setNumberJSON(jsonDictionary) {
  //Read in the JSON file data
  dates = jsonDictionary.dates;
  numerics = jsonDictionary.numerics; //Get today's current date

  today = new Date();
};

var getDate = function getDate(e) {
  //Keep the page from updating
  e.preventDefault(); //new JSON object

  var date = {}; //Read in the search

  var search = document.querySelector("#dateInput").value; //Parse it's data

  var info = search.split("-"); //Get each individual date from the search

  var d = info[2] - 1;
  var m = info[1] - 1;
  var y = info[0] - 0; //Find what day the date is using a new date

  var w = new Date(search).getDay(); // Get the days, week, and month translations

  var day = dates.days[d];
  var weekday = dates.weekdays[w];
  var month = dates.months[m]; // Return the JSON block

  date.date = "".concat(m + 1, "/").concat(d + 1, "/").concat(y);
  date.kanji = "".concat(month.kanji + day.kanji, " (").concat(weekday.kanji, ")");
  date.reading = "".concat(month.reading, " ").concat(day.reading, " (").concat(weekday.reading, ")");
  date.english = "".concat(month.english, " ").concat(day.english, " (").concat(weekday.english, ")");
  date.translation = "".concat(month.month, " ").concat(day.date, " (").concat(weekday.day, ")"); //return date;

  sendAjax('GET', '/getToken', null, function (result) {
    ReactDOM.render( /*#__PURE__*/React.createElement(DateOutput, {
      date: date,
      csrf: result.csrfToken
    }), output);
  });
}; // Used for translating numbers from english to japanese


var getNumber = function getNumber(e) {
  e.preventDefault();
  var input = document.querySelector("#numberInput").value; // Create the json object

  var data = {}; // Create a counter

  var counter = {
    counter: 0
  }; // Check if the input's actually valid or not

  if (Number.isNaN(input)) {
    // Letters were entered
    console.log("AAAA");
    return false;
  } // translate the string back into a number, and get it's length


  var numString = input.toString();
  var length = numString.length;
  data.number = input; // Create the JSON variables

  data.kanji = '';
  data.reading = '';
  data.english = ''; // Loop through the number

  for (var i = length; i >= 1; i--) {
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
    } // increment the counter


    counter.counter++;
  }

  console.log(data);
  sendAjax('GET', '/getToken', null, function (result) {
    ReactDOM.render( /*#__PURE__*/React.createElement(NumberOutput, {
      number: data,
      csrf: result.csrfToken
    }), output);
  });
}; // Search the numeric array and retrieve the kanji based off the number


var appendNumbers = function appendNumbers(num, array, response, isPower) {
  // Parse the number and get it's json array relation
  var searchNum = Number.parseInt(num, 10);
  var number = array[searchNum]; // Check If the current power is a single-character kanji,
  // and the number entered is either 1 or 0, we skip it.

  if (isPower && searchNum === 1 || isPower && searchNum === 0) {
    response.english += ' ';
  } else {
    // The numbers valid, so append it's values to the JSON object
    response.kanji = number.kanji + response.kanji;
    response.reading = "".concat(number.reading, " ").concat(response.reading);
    response.english = "".concat(number.english, " ").concat(response.english);
  }
}; //const getTime = (e) =>
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
