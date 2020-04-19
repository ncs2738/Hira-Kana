"use strict";

var handleDomo = function handleDomo(e) {
  //Keep the page from refreshing
  e.preventDefault(); //Hide our domo-friend

  $("#domoMessage").animate({
    width: 'hide'
  }, 350); //Check if the user entered anything

  if ($("#domoName").val() == '' || $("#domoAge").val() == '' || $("#domoClass").val() == '' || $("#domoLevel").val() == '') {
    handleError("All fields are required bro.");
    return false;
  } //Send the AJAX call with the domo-forms form's data


  sendAjax('POST', $("#domoForm").attr("action"), $("#domoForm").serialize(), function () {
    loadDomosFromServer();
  });
  return false;
};

var deleteMe = function deleteMe(id) {
  //Generate a new token
  sendAjax('GET', '/getToken', null, function (result) {
    //Create a object with the domo's ID and the new token
    var domoID = {
      id: id,
      _csrf: result.csrfToken
    }; //Send the AJAX call to the /delete page with the domo's data

    sendAjax('POST', "/delete", domoID, function () {
      //Refresh the page after the event
      loadDomosFromServer();
    });
  });
}; //HTML setup for the Domo-form


var DomoForm = function DomoForm(props) {
  return (/*#__PURE__*/React.createElement("form", {
      id: "domoForm",
      name: "domoForm",
      onSubmit: handleDomo,
      action: "/maker",
      method: "POST",
      className: "domoForm"
    }, /*#__PURE__*/React.createElement("label", {
      htmlFor: "name"
    }, "Name: "), /*#__PURE__*/React.createElement("input", {
      id: "domoName",
      type: "text",
      name: "name",
      placeholder: "Domo Name"
    }), /*#__PURE__*/React.createElement("label", {
      htmlFor: "age"
    }, "Age: "), /*#__PURE__*/React.createElement("input", {
      id: "domoAge",
      type: "text",
      name: "age",
      placeholder: "Domo Age"
    }), /*#__PURE__*/React.createElement("label", {
      htmlFor: "class"
    }, "Class: "), /*#__PURE__*/React.createElement("input", {
      id: "domoClass",
      type: "text",
      name: "class",
      placeholder: "Domo Class"
    }), /*#__PURE__*/React.createElement("label", {
      htmlFor: "level"
    }, "Level: "), /*#__PURE__*/React.createElement("input", {
      id: "domoLevel",
      type: "text",
      name: "level",
      placeholder: "Domo Level"
    }), /*#__PURE__*/React.createElement("input", {
      type: "hidden",
      name: "_csrf",
      value: props.csrf
    }), /*#__PURE__*/React.createElement("input", {
      className: "makeDomoSubmit",
      type: "submit",
      value: "Make Domo"
    }))
  );
}; //Load in the domo data


var DomoList = function DomoList(props) {
  //If there's no domos
  if (props.domos.length === 0) {
    //Return a empty list
    return (/*#__PURE__*/React.createElement("div", {
        className: "domoList"
      }, /*#__PURE__*/React.createElement("h3", {
        className: "emptyDomo"
      }, "No Domos yet!"))
    );
  } //There are domos, so make a map of them


  var domoNodes = props.domos.map(function (domo) {
    //Return a new table entry for each domo
    return (/*#__PURE__*/React.createElement("div", {
        key: domo._id,
        className: "domo"
      }, /*#__PURE__*/React.createElement("img", {
        src: "/assets/img/domoface.jpeg",
        alt: "domo face",
        className: "domoFace"
      }), /*#__PURE__*/React.createElement("h3", {
        className: "domoName"
      }, "Name: ", domo.name), /*#__PURE__*/React.createElement("h3", {
        className: "domoAge"
      }, "Age: ", domo.age), /*#__PURE__*/React.createElement("h3", {
        className: "domoClass"
      }, "Class: ", domo["class"]), /*#__PURE__*/React.createElement("h3", {
        className: "domoLevel"
      }, "Level: ", domo.level), /*#__PURE__*/React.createElement("button", {
        onClick: function onClick(e) {
          return deleteMe(domo._id);
        }
      }, "Delete Domo"))
    );
  }); //Return the domo list

  return (/*#__PURE__*/React.createElement("div", {
      className: "domoList"
    }, domoNodes)
  );
}; //Refresh the page and show all the domo data


var loadDomosFromServer = function loadDomosFromServer() {
  sendAjax('GET', '/getDomos', null, function (data) {
    ReactDOM.render( /*#__PURE__*/React.createElement(DomoList, {
      domos: data.domos
    }), document.querySelector("#domos"));
  });
}; //Setup the page by rendering the form and list


var setup = function setup(csrf) {
  ReactDOM.render( /*#__PURE__*/React.createElement(DomoForm, {
    csrf: csrf
  }), document.querySelector("#makeDomo"));
  ReactDOM.render( /*#__PURE__*/React.createElement(DomoList, {
    domos: []
  }), document.querySelector("#domos")); //Load the data into the list

  loadDomosFromServer();
}; //Get a new CSRF token


var getToken = function getToken() {
  sendAjax('GET', '/getToken', null, function (result) {
    setup(result.csrfToken);
  });
}; //Load the page and set off the chain of events


$(document).ready(function () {
  getToken();
});
"use strict";

var currentWindow = "text";
var textbox;
var removedElem;
var updating = false;

var handleTextTranslation = function handleTextTranslation(e) {
  //Keep the page from refreshing
  e.preventDefault(); //Check if the user entered anything

  if (textbox.value.trim() == "") {
    console.log("Please enter in text to be translated."); //handleError("All fields are required bro.");

    return false;
  } //If we're not updating a prior entry...


  if (!updating) {
    //Send the AJAX call with the translation forms form's data
    sendAjax('POST', $("#translationForm").attr("action"), $("#translationForm").serialize(), function () {
      resetStates();
      loadTranslationsFromServer();
    });
  } //we are updating another translation
  else {
      //Send the AJAX call with the translation forms form's data
      sendAjax('POST', "/updateTranslation", $("#translationForm").serialize(), function () {
        //We finished updating, so reset the states
        resetStates(); //Load the translations from the server

        loadTranslationsFromServer(); //Refresh the form

        sendAjax('GET', '/getToken', null, function (result) {
          createWindow(result.csrfToken);
        });
      });
    }

  return false;
}; //Handler for the date


var handleDate = function handleDate(e) {
  //Keep the page from refreshing
  e.preventDefault(); //Send the AJAX call with the date form's data
  //Right now it's empty, so we send null.

  sendAjax('GET', $("#dateForm").attr("action"), null, function () {
    loadDateFromServer();
  });
  return false;
}; //Function to delete a previously saved translation
//I plan on writing this to be reusable all throught my translator


var deleteMe = function deleteMe(id) {
  //Generate a new token
  sendAjax('GET', '/getToken', null, function (result) {
    //Create a object with the specific translation's ID and the new token
    var translationID = {
      id: id,
      _csrf: result.csrfToken
    }; //Send the AJAX call to the /delete page with the translation's data

    sendAjax('POST', "/deleteTranslation", translationID, function () {
      //Refresh the page after the event
      loadTranslationsFromServer(); //if we were updating, reset the updating state values.

      stopUpdating(resetStates.csrfToken);
    });
  });
}; //Function to revert from the updating state back to the plain state.


var resetStates = function resetStates() {
  //Clear the textbox
  textbox.value = ""; //Clear the stored value we were updating

  removedElem = ""; //Reset the updating state

  updating = false;
}; //Function used for getting specifically what value we clicked on to update


var loadData = function loadData(translation, list, id) {
  //Set the updating state to true
  updating = true; //Trim the stored text value

  textbox.value = translation.trim(); //Variable used to get the next variable we are going to update
  //This is necessary if we are swapping through the stored values

  var newElem; //Loop through our list

  for (var i = list.length - 1; i >= 0; i--) {
    //search for the matching id
    if (list[i]._id === id) {
      //Get the new value
      newElem = list.splice(i, 1); //Add the old element back to the list

      if (removedElem) list.splice(i, 0, removedElem[0]); //Set the new value to our removed value

      removedElem = newElem; //Exit the loop

      break;
    }
  } //Refresh the page's form + list


  sendAjax('GET', '/getToken', null, function (result) {
    createWindow(result.csrfToken, list);
  });
}; //The user clicked the "stop updating" button after selecting a value to update


var stopUpdating = function stopUpdating(token) {
  //Reset the state
  resetStates(); //Reload the window

  createWindow(token);
}; //HTML setup for the Text Translation form


var TranslationForm = function TranslationForm(props) {
  //if we're not updating...
  if (!updating) {
    //Load the standard submit formn
    return (/*#__PURE__*/React.createElement("form", {
        id: "translationForm",
        name: "translationForm",
        onSubmit: handleTextTranslation,
        action: "/translations",
        method: "POST",
        className: "translationForm"
      }, /*#__PURE__*/React.createElement("label", {
        htmlFor: "name"
      }, "Name: "), /*#__PURE__*/React.createElement("textarea", {
        id: "translationText",
        type: "text",
        name: "translation",
        placeholder: "Translation",
        rows: "1",
        cols: "50",
        onInput: inputHandler
      }), /*#__PURE__*/React.createElement("input", {
        type: "hidden",
        name: "_csrf",
        value: props.csrf
      }), /*#__PURE__*/React.createElement("input", {
        className: "textTranslationSubmit",
        type: "submit",
        value: "Save Translation"
      }))
    );
  } //We're updating
  else {
      //Load the updating form
      return (/*#__PURE__*/React.createElement("form", {
          id: "translationForm",
          name: "translationForm",
          onSubmit: handleTextTranslation,
          action: "/translations",
          method: "POST",
          className: "translationForm"
        }, /*#__PURE__*/React.createElement("label", {
          htmlFor: "name"
        }, "Name: "), /*#__PURE__*/React.createElement("textarea", {
          id: "translationText",
          type: "text",
          name: "translation",
          placeholder: "Translation",
          rows: "1",
          cols: "50",
          onInput: inputHandler
        }), /*#__PURE__*/React.createElement("input", {
          type: "hidden",
          name: "id",
          value: removedElem[0]._id
        }), /*#__PURE__*/React.createElement("input", {
          type: "hidden",
          name: "_csrf",
          value: props.csrf
        }), /*#__PURE__*/React.createElement("button", {
          onClick: function onClick(e) {
            return stopUpdating(props.csrf);
          }
        }, "Stop Updating"), /*#__PURE__*/React.createElement("input", {
          className: "textTranslationSubmit",
          type: "submit",
          value: "Update"
        }))
      );
    }
}; //HTML setup for the Date Translation form
//This is not finished; will be updated


var DateForm = function DateForm(props) {
  return (/*#__PURE__*/React.createElement("form", {
      id: "dateForm",
      name: "dateForm",
      onSubmit: handleDate,
      action: "/getDate",
      method: "GET",
      className: "dateForm"
    }, /*#__PURE__*/React.createElement("input", {
      type: "hidden",
      name: "_csrf",
      value: props.csrf
    }), /*#__PURE__*/React.createElement("input", {
      className: "dateSubmit",
      type: "submit",
      value: "Get Date"
    }))
  );
}; //Load in the previously saved translations


var TranslationList = function TranslationList(props) {
  //If there are no previously saved translations
  if (props.translations.length === 0) {
    //Return a empty list
    return (/*#__PURE__*/React.createElement("div", {
        className: "translationList"
      }, /*#__PURE__*/React.createElement("h3", {
        className: "emptyTranslationList"
      }, "There are no saved translations!"))
    );
  } //There are saved translations, so make a map of them


  var translationNodes = props.translations.map(function (translations) {
    //Return a new table entry for each saved translation
    return (/*#__PURE__*/React.createElement("div", {
        key: translations._id,
        className: "translation"
      }, /*#__PURE__*/React.createElement("h3", {
        className: "translationText"
      }, translations.translation), /*#__PURE__*/React.createElement("button", {
        onClick: function onClick(e) {
          return deleteMe(translations._id);
        }
      }, "Remove"), /*#__PURE__*/React.createElement("button", {
        onClick: function onClick(e) {
          return loadData(translations.translation, props.translations, translations._id);
        }
      }, "Update"))
    );
  }); //Return the translations list

  return (/*#__PURE__*/React.createElement("div", {
      className: "translationList"
    }, translationNodes)
  );
}; //Load in the date


var DateList = function DateList(props) {
  //The user hasn't searched for the date
  if (props.date.length === 0) {
    //Return a empty list
    return (/*#__PURE__*/React.createElement("div", {
        className: "translationList"
      }, /*#__PURE__*/React.createElement("h3", {
        className: "emptyTranslationList"
      }, "Get the date please"))
    );
  } //For future reference

  /*
  //There are saved translations, so make a map of them
  const dateNodes = props.date.map(function(date)
  {
      //Return a new table entry for each saved translation
      return (
          <div key={translations._id} className="todaysDate">
              <h3 className="dateText">{date.date}</h3>
              <h3 className="kanjiText">{date.kanji}</h3>
              <h3 className="readingText">{date.reading}</h3>
              <h3 className="englishText">{date.english}</h3>
              <h3 className="translationText">{date.translation}</h3>
          </div>
      );
  });
  */
  //Return the date


  return (/*#__PURE__*/React.createElement("div", {
      className: "dateList"
    }, /*#__PURE__*/React.createElement("div", {
      key: translations._id,
      className: "todaysDate"
    }, /*#__PURE__*/React.createElement("h3", {
      className: "dateText"
    }, props.date.date), /*#__PURE__*/React.createElement("h3", {
      className: "kanjiText"
    }, props.date.kanji), /*#__PURE__*/React.createElement("h3", {
      className: "readingText"
    }, props.date.reading), /*#__PURE__*/React.createElement("h3", {
      className: "englishText"
    }, props.date.english), /*#__PURE__*/React.createElement("h3", {
      className: "translationText"
    }, props.date.translation)))
  );
}; //Setup the page by rendering the form and list


var setup = function setup(csrf) {
  document.querySelector("#dateButton").addEventListener("click", function (e) {
    setListener(e, csrf, "date");
  });
  document.querySelector("#timeButton").addEventListener("click", function (e) {
    setListener(e, csrf, "text");
  });
  document.querySelector("#numberButton").addEventListener("click", function (e) {
    setListener(e, csrf, "text");
  });
  document.querySelector("#textButton").addEventListener("click", function (e) {
    setListener(e, csrf, "text");
  });
  createWindow(csrf);
}; //Used for adding the event listeners to the buttons
//Takes in the event, the crsf token, and what window it needs to update to


function setListener(e, csrf, curWindow) {
  e.preventDefault();
  resetStates();
  currentWindow = curWindow;
  createWindow(csrf);
  return false;
} //Render the windows


var createWindow = function createWindow(csrf) {
  var updateList = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];
  //Get the content we will be updating
  var form = document.querySelector("#newTranslation");
  var data = document.querySelector("#translations"); //Search for which window we're currently on
  //Then display the appropriate info

  switch (currentWindow) {
    case "text":
      {
        ReactDOM.render( /*#__PURE__*/React.createElement(TranslationForm, {
          csrf: csrf
        }), form);
        ReactDOM.render( /*#__PURE__*/React.createElement(TranslationList, {
          translations: updateList
        }), data); //Set the textbox to the translation box

        textbox = document.querySelector("#translationText"); //if we're not updating...

        if (!updating) {
          //Load the data into the list
          loadTranslationsFromServer();
        }

        break;
      }

    case "date":
      {
        ReactDOM.render( /*#__PURE__*/React.createElement(DateForm, {
          csrf: csrf
        }), form);
        ReactDOM.render( /*#__PURE__*/React.createElement(DateList, {
          date: []
        }), data);
        break;
      } //Default to the text box

      defaut: {
        ReactDOM.render( /*#__PURE__*/React.createElement(TranslationForm, {
          csrf: csrf
        }), form);
        ReactDOM.render( /*#__PURE__*/React.createElement(TranslationList, {
          translations: updateList
        }), data); //Set the textbox to the translation box

        textbox = document.querySelector("#translationText"); //if we're not updating...

        if (!updating) {
          //Load the data into the list
          loadTranslationsFromServer();
        }

        break;
      }

  }
}; //Refresh the page and show all the translations


var loadTranslationsFromServer = function loadTranslationsFromServer() {
  sendAjax('GET', '/getTranslations', null, function (data) {
    ReactDOM.render( /*#__PURE__*/React.createElement(TranslationList, {
      translations: data.translations
    }), document.querySelector("#translations"));
  });
}; //Refresh the page and load in the date


var loadDateFromServer = function loadDateFromServer() {
  sendAjax('GET', '/getDate', null, function (data) {
    ReactDOM.render( /*#__PURE__*/React.createElement(DateList, {
      date: data.date
    }), document.querySelector("#translations"));
  });
}; //Get a new CSRF token


var getToken = function getToken() {
  sendAjax('GET', '/getToken', null, function (result) {
    setup(result.csrfToken);
  });
}; //Load the page and set off the chain of events


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
