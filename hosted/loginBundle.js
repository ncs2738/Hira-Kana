"use strict";

var currentWindow = "welcome"; //Handle our login event

var handleAccount = function handleAccount(e) {
  //Keep the page from refreshing after sending the form
  e.preventDefault();
  fieldCheck();
};

var fieldCheck = function fieldCheck() {
  if ($("#user").val() == '' || $("#pass").val() == '') {
    //handleError("Your username or password's empty bro.");
    var errorMessage = currentWindow === "login" ? "Your username or password's empty bro." : "All fields are required dude.";
    console.log(errorMessage);
    return false;
  }

  if (currentWindow === "signUp") {
    //Check if the fields are empty
    if ($("#pass2").val() == '') {
      //handleError("All fields are required dude.");
      return false;
    } //Check if the passwords are equivalent


    if ($("#pass").val() !== $("#pass2").val()) {
      handleError("The passwords don't match bro.");
      return false;
    }
  }

  var curForm = "#" + currentWindow + "Form"; //Send the AJAX call with the login form's data

  sendAjax('POST', $(curForm).attr("action"), $(curForm).serialize(), redirect);
  return false;
}; //HTML setup for the Login-form


var LoginWindow = function LoginWindow(props) {
  return (/*#__PURE__*/React.createElement("form", {
      id: "loginForm",
      name: "loginForm",
      onSubmit: handleAccount,
      action: "/login",
      method: "POST",
      className: "mainForm"
    }, /*#__PURE__*/React.createElement("label", {
      htmlFor: "username"
    }, "Username:"), /*#__PURE__*/React.createElement("input", {
      id: "user",
      type: "text",
      name: "username",
      placeholder: "username"
    }), /*#__PURE__*/React.createElement("label", {
      htmlFor: "pass"
    }, "Password:"), /*#__PURE__*/React.createElement("input", {
      id: "pass",
      type: "password",
      name: "pass",
      placeholder: "password"
    }), /*#__PURE__*/React.createElement("input", {
      type: "hidden",
      name: "_csrf",
      value: props.csrf
    }), /*#__PURE__*/React.createElement("input", {
      className: "formSubmit",
      type: "submit",
      value: "Sign in"
    }))
  );
}; //HTML setup for the sign-up form


var SignupWindow = function SignupWindow(props) {
  return (/*#__PURE__*/React.createElement("form", {
      id: "signupForm",
      name: "signupForm",
      onSubmit: handleAccount,
      action: "/signup",
      method: "POST",
      className: "mainForm"
    }, /*#__PURE__*/React.createElement("label", {
      htmlFor: "username"
    }, "Username:"), /*#__PURE__*/React.createElement("input", {
      id: "user",
      type: "text",
      name: "username",
      placeholder: "username"
    }), /*#__PURE__*/React.createElement("label", {
      htmlFor: "pass"
    }, "Password:"), /*#__PURE__*/React.createElement("input", {
      id: "pass",
      type: "password",
      name: "pass",
      placeholder: "password"
    }), /*#__PURE__*/React.createElement("label", {
      htmlFor: "pass2"
    }, "Password:"), /*#__PURE__*/React.createElement("input", {
      id: "pass2",
      type: "password",
      name: "pass2",
      placeholder: "retype password"
    }), /*#__PURE__*/React.createElement("input", {
      type: "hidden",
      name: "_csrf",
      value: props.csrf
    }), /*#__PURE__*/React.createElement("input", {
      className: "formSubmit",
      type: "submit",
      value: "Sign Up"
    }))
  );
}; //HTML setup for the weclome page


var WelcomeWindow = function WelcomeWindow(props) {
  return (/*#__PURE__*/React.createElement("div", {
      className: "welcome"
    }, /*#__PURE__*/React.createElement("h1", null, "Hello there!"), /*#__PURE__*/React.createElement("h1", null, "This is my project 2 milestone 1"), /*#__PURE__*/React.createElement("p", null, "I focused primarily getting all ready n' set up; I focused on getting my update and delete functions going"), /*#__PURE__*/React.createElement("p", null, "I had the update calls working on the domo maker, but translating it onto this project took me hours, which is why I've sadly not much to show for this one."), /*#__PURE__*/React.createElement("p", null, "I've really only have my text translator set up, and you can get the current date. I plan adding adding more to the date search later."), /*#__PURE__*/React.createElement("p", null, "My text translator is almost completely finished, and should be working without any issues."), /*#__PURE__*/React.createElement("p", null, "If I have any errors on the app, they'll be in the console. Sorry about that."), /*#__PURE__*/React.createElement("p", null, "Although I sadly don't have too much to show for this one, but all of my setup's essentially done"), /*#__PURE__*/React.createElement("p", null, "Alot of this was me just learning how to set up + experimenting with React and figuring things out"), /*#__PURE__*/React.createElement("p", null, "My code's kinda messy but not the world's end, and I've got a long way to go with this, but I hope this is enough for the milestone!"))
  );
}; //Render the windows


var createWindow = function createWindow(csrf) {
  switch (currentWindow) {
    case "login":
      {
        ReactDOM.render( /*#__PURE__*/React.createElement(LoginWindow, {
          csrf: csrf
        }), document.querySelector("#content"));
        break;
      }

    case "signUp":
      {
        ReactDOM.render( /*#__PURE__*/React.createElement(SignupWindow, {
          csrf: csrf
        }), document.querySelector("#content"));
        break;
      }

    case "welcome":
      {
        ReactDOM.render(
        /*#__PURE__*/
        //<WelcomeWindow csrf={csrf} />,
        React.createElement(WelcomeWindow, null), document.querySelector("#content"));
        break;
      }

      defaut: {
        ReactDOM.render(
        /*#__PURE__*/
        //<WelcomeWindow csrf={csrf} />,
        React.createElement(WelcomeWindow, null), document.querySelector("#content"));
        break;
      }

  }
}; //Used for loading the page


var setup = function setup(csrf) {
  //Add events to the buttons
  document.querySelector("#loginButton").addEventListener("click", function (e) {
    setListener(e, csrf, "login");
  });
  document.querySelector("#signUpButton").addEventListener("click", function (e) {
    setListener(e, csrf, "signUp");
  });
  document.querySelector("#welcomeButton").addEventListener("click", function (e) {
    setListener(e, csrf, "welcome");
  }); //Set the default screen
  //Currently, it is the welcome screen

  createWindow(csrf);
};

function setListener(e, csrf, curWindow) {
  e.preventDefault();
  currentWindow = curWindow;
  createWindow(csrf);
  return false;
} //Used for generating new CRSF tokens;
//Always called whenever we make a data-call


var getToken = function getToken() {
  sendAjax('GET', '/getToken', null, function (result) {
    setup(result.csrfToken);
  });
}; //When the page loads, get our first token, 
//and set off the chain of events


$(document).ready(function () {
  getToken();
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

//Huge JSON object containing all of the Japanese Hirgana and Katakana
var jsonAlphabet = '{"vowels":{"vChars":["a:","i:","u:","e:","o:"],"hiraVowels":["あ","い","う","え","お"],"kataVowels":["ア","イ","ウ","エ","オ"]},"k":{"vChars":["ka:","ki:","ku:","ke:","ko:"],"yChars":["kya:","kyu:","kyo:"],"hiraVowels":["か","き","く","け","こ"],"hiraYs":["きゃ","きゅ","きょ"],"kataVowels":["カ","キ","ク","ケ","コ"],"kataYs":["キャ","キュ","キョ"]},"g":{"vChars":["ga:","gi:","gu:","ge:","go:"],"yChars":["gya:","gyu:","gyo:"],"hiraVowels":["が","ぎ","ぐ","げ","ご"],"hiraYs":["ぎゃ","ぎゅ","ぎょ"],"kataVowels":["ガ","ギ","グ","ゲ","ゴ"],"kataYs":["ギャ","ギュ","ギョ"]},"s":{"vChars":["sa:","si, shi:","su:","se:","so:"],"yChars":["sya, sha, shya:","syu, shu, shyu:","syo, sho, shyo:"],"hiraVowels":["さ","し","す","せ","そ"],"hiraYs":["しゃ","しゅ","しょ"],"kataVowels":["サ","シ","ス","セ","ソ"],"kataYs":["シャ","シュ","ショ"]},"z":{"vChars":["za:","zi, ji:","zu:","ze:","zo:"],"yChars":["zya, ja, jya:","zyu, ju, jyu:","zyo, jo, jyo:"],"hiraVowels":["ざ","じ","ず","ぜ","ぞ"],"hiraYs":["じゃ","じゅ","じょ"],"kataVowels":["ザ","ジ","ズ","ゼ","ゾ"],"kataYs":["ジャ","ジュ","ジョ"]},"t":{"vChars":["ta:","ti, chi:","tu, tsu:","te:","to:"],"yChars":["tya, cha, chya:","tyu, chu, chyu:","tyo, cho, chyo:"],"hiraVowels":["た","ち","つ","て","と"],"hiraYs":["ちゃ","ちゅ","ちょ"],"kataVowels":["タ","チ","ツ","テ","ト"],"kataYs":["チャ","チュ","チョ"]},"d":{"vChars":["da:","di:","du:","de:","do:"],"yChars":["dya, dza, ja, jya:","dyu, dzu, ju, jyu:","dyo, dzo, jo, jyo:"],"hiraVowels":["だ","ぢ","づ","で","ど"],"hiraYs":["ぢゃ","ぢゅ","ぢょ"],"kataVowels":["ダ","ヂ","ヅ","デ","ド"],"kataYs":["ヂャ","ヂュ","ヂョ"]},"n":{"vChars":["na:","ni:","nu:","ne:","no:"],"yChars":["nya:","nyu:","nyo:"],"nChar":"n:","hiraVowels":["な","に","ぬ","ね","の"],"hiraYs":["にゃ","にゅ","にょ"],"hiraN":"ん","kataVowels":["ナ","ニ","ヌ","ネ","ノ"],"kataYs":["ニャ","ニュ","ニョ"],"kataN":"ン"},"h":{"vChars":["ha:","hi:","hu, fu:","he:","ho:"],"yChars":["hya:","hyu:","hyo:"],"hiraVowels":["は","ひ","ふ","へ","ほ"],"hiraYs":["ひゃ","ひゅ","ひょ"],"kataVowels":["ハ","ヒ","フ","ヘ","ホ"],"kataYs":["ヒャ","ヒュ","ヒョ"]},"b":{"vChars":["ba:","bi:","bu:","be:","bo:"],"yChars":["bya:","byu:","byo:"],"hiraVowels":["ば","び","ぶ","べ","ぼ"],"hiraYs":["びゃ","びゅ","びょ"],"kataVowels":["バ","ビ","ブ","ベ","ボ"],"kataYs":["ビャ","ビュ","ビョ"]},"p":{"vChars":["pa:","pi:","pu:","pe:","po:"],"yChars":["pya:","pyu:","pyo:"],"hiraVowels":["ぱ","ぴ","ぷ","ぺ","ぽ"],"hiraYs":["ぴゃ","ぴゅ","ぴょ"],"kataVowels":["パ","ピ","プ","ペ","ポ"],"kataYs":["ピャ","ピュ","ピョ"]},"m":{"vChars":["ma:","mi:","mu:","me:","mo:"],"yChars":["mya:","myu:","myo:"],"hiraVowels":["ま","み","む","め","も"],"hiraYs":["みゃ","みゅ","みょ"],"kataVowels":["マ","ミ","ム","メ","モ"],"kataYs":["ミャ","ミュ","ミョ"]},"y":{"vChars":["ya:","yu:","yo:"],"hiraYs":["や","ゆ","よ"],"kataYs":["ヤ","ユ","ヨ"]},"r":{"vChars":["ra:","ri:","ru:","re:","ro:"],"yChars":["rya:","ryu:","ryo:"],"hiraVowels":["ら","り","る","れ","ろ"],"hiraYs":["りゃ","りゅ","りょ"],"kataVowels":["ラ","リ","ル","レ","ロ"],"kataYs":["リャ","リュ","リョ"]},"w":{"vChars":["wa:","wo:"],"hiraVowels":["わ","を"],"kataVowels":["ワ","ヲ"]},"special":{"vChars":["a, A:","i, I:","u, U:","e, E:","o, O:"],"kataVowels":["ァ","ィ","ゥ","ェ","ォ"],"kataV":"ヴ","vChar":"V:"},"tsu":{"hiraTsu":"っ","kataTsu":"ッ"},"punctuation":["。","、","ー","「","」","ゝ","ゞ","ヽ","ヾ","々","〜"]}';
var alphabet = JSON.parse(jsonAlphabet); //Dictionary used for printing vowel characters

var vowelDictionary = {
  "a": 0,
  "i": 1,
  "u": 2,
  "e": 3,
  "o": 4
}; //Dictionary used for printing y characters

var yDictionary = {
  "a": 0,
  "u": 1,
  "o": 2
}; //Dictionary used directing the special characters to the desired alphabet

var specialDictionary = {
  "j": "z",
  "c": "t",
  "f": "h",
  "w": "w",
  "y": "y",
  "l": "r",
  "_": "special"
}; //Dictionary used for printing punctuation characters

var punctuationDictionary = {
  ".": 0,
  ",": 1,
  "-": 2,
  "<": 3,
  "[": 3,
  "{": 3,
  ">": 4,
  "]": 4,
  "}": 4,
  "'": 5,
  '"': 6,
  ";": 7,
  ":": 8,
  "`": 9,
  "~": 10
}; //Array used for checking if a character should be made into a tsu
//For example, the word kka would be 'small-tsu' 'ka'

var tsuList = ["k", "s", "t", "p"];
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

        if (alphabet[tmp] !== undefined || specialDictionary[tmp] !== undefined) //Checks to see if the character exists in either dictionary
          {
            //It does, so check which dictionary it's in
            alphabet[tmp] !== undefined ? inputData.characterArray = tmp : inputData.characterArray = specialDictionary[tmp]; //Set the state to the current loop's number. The state-check will handle the rest now.

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
  if (vowelDictionary[input] !== undefined) //If the user tpyed a vowel, check to see which vowel
    {
      inputData.characterArray = "vowels";
      printCharacter(setCharacter(vowelDictionary[input]), 1);
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
    } else if (specialDictionary[input] !== undefined) {
    inputData.characterArray = specialDictionary[input]; //Set the array's pointer to be to the input just entered

    inputData.state = 2;
  } else if (punctuationDictionary[input] !== undefined) {
    printCharacter(alphabet["punctuation"][punctuationDictionary[input]], inputData.state);
  } else {
    inputData.state = 1;
  }
}; //Handles second case inputs (IE, If the input will be 2 characters long).
//Parameters: user keystroke input


var secondCase = function secondCase(input) {
  var preChar = inputData.message.charAt(inputData.pos - 2).toLowerCase(); //Gets the character right before the current position
  //If the character is a tsu, (so for example, kk was entered)...

  if (tsuList.includes(preChar) && preChar == input) {
    setArray("hiraTsu", "kataTsu"); //Set the array to tsu

    if (inputData.arrayName == "kataTsu") input = input.toUpperCase(); //set the character after the tsu to the appropriate typing.

    printCharacter(input, 1, true); //print the character
  } //Check the previous character behind the input
  else if (specialDictionary[preChar] !== undefined && preChar != "l") {
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
            if (vowelDictionary[input] !== undefined) //If the user tpyed a vowel, check to see which vowel
              {
                inputData.arrayName = "kataVowels";
                printCharacter(setCharacter(vowelDictionary[input]), 1);
              } else //The user entered no valid inputs; return to the first case.
              {
                resetState(1, input);
              }

            break;
          }
      }
    } else if (vowelDictionary[input] !== undefined) //If the user typed a vowel, check to see which vowel
      {
        printCharacter(setCharacter(vowelDictionary[input]), 1);
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
  } else if (vowelDictionary[input] !== undefined) {
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
  if (yDictionary[input] !== undefined) {
    setArray("hiraYs", "kataYs");
    printCharacter(setCharacter(yDictionary[input]), stateIndex);
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
