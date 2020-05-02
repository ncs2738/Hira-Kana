"use strict";

//Handler for saving text
var handleTextTranslation = function handleTextTranslation(e) {
  //Keep the page from refreshing
  e.preventDefault(); //Check if the user entered anything

  if (textbox.value.trim() == "") {
    handleError("Please enter in text to be translated.");
    return false;
  } //save the translation


  saveTranslation("#translationForm");
};

var handleDate = function handleDate(e) {
  //Keep the page from refreshing
  e.preventDefault(); //save the translation

  saveTranslation("#dateForm");
};

var handleNumber = function handleNumber(e) {
  //Keep the page from refreshing
  e.preventDefault(); //If there was no number entered...

  if ($("#number").val() == "") {
    handleError("Please enter in a number to be translated.");
    return false;
  } //save the translation


  saveTranslation("#numberForm");
};

var saveTranslation = function saveTranslation(form) {
  //If we're not updating a prior entry...
  if (!updating) {
    //Send the AJAX call with the translation forms form's data
    sendAjax('POST', $(form).attr("action"), $(form).serialize(), function () {
      resetStates();
      loadFromServer();
    });
  } //we are updating another translation
  else {
      //Send the AJAX call with the translation forms form's data
      sendAjax('POST', "/update" + currentWindow, $(form).serialize(), function () {
        //We finished updating, so reset the states
        resetStates(); //Load the translations from the server

        loadFromServer();
      });
    } //Refresh the form


  sendAjax('GET', '/getToken', null, function (result) {
    createWindow(result.csrfToken);
  });
  return false;
}; //Function to delete a previously saved translation
//I plan on writing this to be reusable all throught my translator


var deleteTranslation = function deleteTranslation(id) {
  //Generate a new token
  sendAjax('GET', '/getToken', null, function (result) {
    //Create a object with the specific translation's ID and the new token
    var translationID = {
      id: id,
      _csrf: result.csrfToken
    }; //Send the AJAX call to the /delete page with the translation's data

    sendAjax('POST', "/delete" + currentWindow, translationID, function () {
      //Refresh the page after the event
      loadFromServer(); //if we were updating, reset the updating state values.

      stopUpdating(resetStates.csrfToken);
    });
  });
}; //Function used for getting specifically what value we clicked on to update


var updateTranslation = function updateTranslation(translation, list, id) {
  //Set the updating state to true
  updating = true; //Variable used to get the next variable we are going to update
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
  } //Update the forms


  if (translation) {
    //Trim the stored text value
    textbox.value = translation.trim();
  } //Refresh the page's form + list


  sendAjax('GET', '/getToken', null, function (result) {
    createWindow(result.csrfToken, list, removedElem[0]);
  });
}; //The user clicked the "stop updating" button after selecting a value to update


var stopUpdating = function stopUpdating(token) {
  //Reset the state
  resetStates(); //Reload the window

  createWindow(token);
}; //Function to revert from the updating state back to the plain state.


var resetStates = function resetStates() {
  //Clear the textbox
  textbox.value = ""; //Clear the stored value we were updating

  removedElem = ""; //Reset the updating state

  updating = false;
};
"use strict";

//HTML setup for the Date Translation form
//Used for the original date
var DateForm = function DateForm(props) {
  //Return the date
  //If we're not updating, show this render
  if (!updating) {
    return (/*#__PURE__*/React.createElement("form", {
        id: "dateSearch",
        name: "dateSearch",
        onSubmit: getDate,
        className: "dateSearch"
      }, /*#__PURE__*/React.createElement("label", {
        "for": "date"
      }, "Search a date to translate"), /*#__PURE__*/React.createElement("input", {
        type: "date",
        id: "dateInput",
        className: "dataInput",
        name: "date"
      }), /*#__PURE__*/React.createElement("input", {
        className: "dateSubmit",
        type: "submit",
        value: "Translate Date"
      }))
    );
  } //We are updating, so show this one
  else {
      return (/*#__PURE__*/React.createElement("form", {
          id: "dateSearch",
          name: "dateSearch",
          onSubmit: getDate,
          className: "dateSearch"
        }, /*#__PURE__*/React.createElement("label", {
          "for": "date"
        }, "Re-search a date to update"), /*#__PURE__*/React.createElement("input", {
          type: "date",
          id: "dateInput",
          className: "dataInput",
          name: "date"
        }), /*#__PURE__*/React.createElement("input", {
          className: "dateSubmit",
          type: "submit",
          value: "Translate New Date"
        }))
      );
    }
}; //Load in the date


var DateOutput = function DateOutput(props) {
  //The user hasn't searched for the date
  if (props.date.length === 0) {
    //Return a empty list
    return (/*#__PURE__*/React.createElement("h3", {
        className: "searchOutput"
      })
    );
  } //Return the date


  if (!updating) {
    return (/*#__PURE__*/React.createElement("div", {
        className: "dateOutput"
      }, /*#__PURE__*/React.createElement("div", {
        className: "searchedDate"
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
      }, props.date.translation)), /*#__PURE__*/React.createElement("form", {
        id: "dateForm",
        name: "dateForm",
        onSubmit: handleDate,
        action: "/dates",
        method: "POST",
        className: "dateForm"
      }, /*#__PURE__*/React.createElement("input", {
        type: "hidden",
        name: "date",
        value: props.date.date
      }), /*#__PURE__*/React.createElement("input", {
        type: "hidden",
        name: "kanji",
        value: props.date.kanji
      }), /*#__PURE__*/React.createElement("input", {
        type: "hidden",
        name: "reading",
        value: props.date.reading
      }), /*#__PURE__*/React.createElement("input", {
        type: "hidden",
        name: "english",
        value: props.date.english
      }), /*#__PURE__*/React.createElement("input", {
        type: "hidden",
        name: "translation",
        value: props.date.translation
      }), /*#__PURE__*/React.createElement("input", {
        type: "hidden",
        name: "_csrf",
        value: props.csrf
      }), /*#__PURE__*/React.createElement("input", {
        className: "dateSubmit",
        type: "submit",
        value: "Save Date"
      })))
    );
  } else {
    return (/*#__PURE__*/React.createElement("div", {
        className: "dateOutput"
      }, /*#__PURE__*/React.createElement("div", {
        className: "searchedDate"
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
      }, props.date.translation)), /*#__PURE__*/React.createElement("form", {
        id: "dateForm",
        name: "dateForm",
        onSubmit: handleDate,
        action: "/dates",
        method: "POST",
        className: "dateForm"
      }, /*#__PURE__*/React.createElement("input", {
        type: "hidden",
        name: "date",
        value: props.date.date
      }), /*#__PURE__*/React.createElement("input", {
        type: "hidden",
        name: "kanji",
        value: props.date.kanji
      }), /*#__PURE__*/React.createElement("input", {
        type: "hidden",
        name: "reading",
        value: props.date.reading
      }), /*#__PURE__*/React.createElement("input", {
        type: "hidden",
        name: "english",
        value: props.date.english
      }), /*#__PURE__*/React.createElement("input", {
        type: "hidden",
        name: "translation",
        value: props.date.translation
      }), /*#__PURE__*/React.createElement("input", {
        type: "hidden",
        name: "id",
        value: removedElem[0]._id
      }), /*#__PURE__*/React.createElement("input", {
        type: "hidden",
        name: "_csrf",
        value: props.csrf
      }), /*#__PURE__*/React.createElement("input", {
        className: "dateSubmit",
        type: "submit",
        value: "Update"
      }), /*#__PURE__*/React.createElement("button", {
        type: "button",
        onClick: function onClick(e) {
          return stopUpdating(props.csrf);
        }
      }, "Cancel")))
    );
  }
}; //Load in the date


var DateList = function DateList(props) {
  //If there are no previously saved translations
  if (props.dates.length === 0) {
    //Return a empty list
    return (/*#__PURE__*/React.createElement("div", {
        className: "dateList"
      }, /*#__PURE__*/React.createElement("h3", {
        className: "emptyList"
      }, "There are no saved dates!"))
    );
  } //There are saved translations, so make a map of them


  var dateNodes = props.dates.map(function (dates) {
    //Return a new table entry for each saved translation
    return (/*#__PURE__*/React.createElement("div", {
        key: dates._id,
        className: "savedTranslation"
      }, /*#__PURE__*/React.createElement("h4", {
        className: "translationDate"
      }, dates.date), /*#__PURE__*/React.createElement("h4", {
        className: "translationKanji"
      }, dates.kanji), /*#__PURE__*/React.createElement("h4", {
        className: "translationReading"
      }, dates.reading), /*#__PURE__*/React.createElement("h4", {
        className: "translationEnglish"
      }, dates.english), /*#__PURE__*/React.createElement("h4", {
        className: "translationText"
      }, dates.translation), /*#__PURE__*/React.createElement("button", {
        onClick: function onClick(e) {
          return updateTranslation(false, props.dates, dates._id);
        }
      }, "Update"), /*#__PURE__*/React.createElement("button", {
        onClick: function onClick(e) {
          return deleteTranslation(dates._id);
        }
      }, "Delete"))
    );
  }); //Return the translations list

  return (/*#__PURE__*/React.createElement("div", {
      className: "dateList"
    }, dateNodes)
  );
};
"use strict";

//HTML setup for the Number Translation form
var NumberForm = function NumberForm(props) {
  //If we're not updating, show this render
  if (!updating) {
    return (/*#__PURE__*/React.createElement("form", {
        id: "numberSearch",
        name: "numberSearch",
        onSubmit: getNumber,
        className: "numberSearch"
      }, /*#__PURE__*/React.createElement("label", {
        "for": "number"
      }, "Enter a number to translate"), /*#__PURE__*/React.createElement("input", {
        type: "text",
        id: "numberInput",
        className: "dataInput",
        maxlength: "5"
      }), /*#__PURE__*/React.createElement("input", {
        className: "numberSubmit",
        type: "submit",
        value: "Translate Number"
      }))
    );
  } //We are updating, so show this one
  else {
      return (/*#__PURE__*/React.createElement("form", {
          id: "numberSearch",
          name: "numberSearch",
          onSubmit: getNumber,
          className: "numberSearch"
        }, /*#__PURE__*/React.createElement("label", {
          "for": "number"
        }, "Re-search a number to update"), /*#__PURE__*/React.createElement("input", {
          type: "text",
          id: "numberInput",
          className: "dataInput",
          maxlength: "5"
        }), /*#__PURE__*/React.createElement("input", {
          className: "numberSubmit",
          type: "submit",
          value: "Translate New Number"
        }))
      );
    }
}; //Load in the number


var NumberOutput = function NumberOutput(props) {
  //The user hasn't searched for a number yet
  if (props.number.length === 0) {
    //Return a empty list
    return (/*#__PURE__*/React.createElement("h3", {
        className: "searchOutput"
      })
    );
  } //Return the number


  if (!updating) {
    return (/*#__PURE__*/React.createElement("div", {
        className: "translations"
      }, /*#__PURE__*/React.createElement("div", {
        className: "translation"
      }, /*#__PURE__*/React.createElement("h3", {
        className: "numberSearched"
      }, props.number.number), /*#__PURE__*/React.createElement("h3", {
        className: "numberKanji"
      }, props.number.kanji), /*#__PURE__*/React.createElement("h3", {
        className: "numberText"
      }, props.number.reading), /*#__PURE__*/React.createElement("h3", {
        className: "englishText"
      }, props.number.english)), /*#__PURE__*/React.createElement("form", {
        id: "numberForm",
        name: "numberForm",
        onSubmit: handleNumber,
        action: "/number",
        method: "POST",
        className: "numberForm"
      }, /*#__PURE__*/React.createElement("input", {
        type: "hidden",
        name: "number",
        value: props.number.number
      }), /*#__PURE__*/React.createElement("input", {
        type: "hidden",
        name: "kanji",
        value: props.number.kanji
      }), /*#__PURE__*/React.createElement("input", {
        type: "hidden",
        name: "reading",
        value: props.number.reading
      }), /*#__PURE__*/React.createElement("input", {
        type: "hidden",
        name: "english",
        value: props.number.english
      }), /*#__PURE__*/React.createElement("input", {
        type: "hidden",
        name: "_csrf",
        value: props.csrf
      }), /*#__PURE__*/React.createElement("input", {
        className: "numberSubmit",
        type: "submit",
        value: "Save Number"
      })))
    );
  } else {
    return (/*#__PURE__*/React.createElement("div", {
        className: "translations"
      }, /*#__PURE__*/React.createElement("div", {
        className: "translation"
      }, /*#__PURE__*/React.createElement("h3", {
        className: "numberSearched"
      }, props.number.number), /*#__PURE__*/React.createElement("h3", {
        className: "numberKanji"
      }, props.number.kanji), /*#__PURE__*/React.createElement("h3", {
        className: "numberText"
      }, props.number.reading), /*#__PURE__*/React.createElement("h3", {
        className: "englishText"
      }, props.number.english)), /*#__PURE__*/React.createElement("form", {
        id: "numberForm",
        name: "numberForm",
        onSubmit: handleNumber,
        action: "/number",
        method: "POST",
        className: "numberForm"
      }, /*#__PURE__*/React.createElement("input", {
        type: "hidden",
        name: "number",
        value: props.number.number
      }), /*#__PURE__*/React.createElement("input", {
        type: "hidden",
        name: "kanji",
        value: props.number.kanji
      }), /*#__PURE__*/React.createElement("input", {
        type: "hidden",
        name: "reading",
        value: props.number.reading
      }), /*#__PURE__*/React.createElement("input", {
        type: "hidden",
        name: "english",
        value: props.number.english
      }), /*#__PURE__*/React.createElement("input", {
        type: "hidden",
        name: "id",
        value: removedElem[0]._id
      }), /*#__PURE__*/React.createElement("input", {
        type: "hidden",
        name: "_csrf",
        value: props.csrf
      }), /*#__PURE__*/React.createElement("input", {
        className: "numberSubmit",
        type: "submit",
        value: "Update"
      }), /*#__PURE__*/React.createElement("button", {
        type: "button",
        onClick: function onClick(e) {
          return stopUpdating(props.csrf);
        }
      }, "Cancel")))
    );
  }
}; //Load in the date


var NumberList = function NumberList(props) {
  //If there are no previously saved translations
  if (props.numbers.length === 0) {
    //Return a empty list
    return (/*#__PURE__*/React.createElement("div", {
        className: "numberList"
      }, /*#__PURE__*/React.createElement("h3", {
        className: "emptyList"
      }, "There are no saved numbers!"))
    );
  } //There are saved translations, so make a map of them


  var numberNodes = props.numbers.map(function (numbers) {
    //Return a new table entry for each saved translation
    return (/*#__PURE__*/React.createElement("div", {
        key: numbers._id,
        className: "savedTranslation"
      }, /*#__PURE__*/React.createElement("h4", {
        className: "numberSearched"
      }, numbers.number), /*#__PURE__*/React.createElement("h4", {
        className: "numberKanji"
      }, numbers.kanji), /*#__PURE__*/React.createElement("h4", {
        className: "numberText"
      }, numbers.reading), /*#__PURE__*/React.createElement("h4", {
        className: "englishText"
      }, numbers.english), /*#__PURE__*/React.createElement("button", {
        onClick: function onClick(e) {
          return updateTranslation(false, props.numbers, numbers._id);
        }
      }, "Update"), /*#__PURE__*/React.createElement("button", {
        onClick: function onClick(e) {
          return deleteTranslation(numbers._id);
        }
      }, "Delete"))
    );
  }); //Return the translations list

  return (/*#__PURE__*/React.createElement("div", {
      className: "numberList"
    }, numberNodes)
  );
};
"use strict";

//HTML setup for the Text Translation form
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
      }, "Enter your message to translate "), /*#__PURE__*/React.createElement("textarea", {
        id: "translationText",
        type: "text",
        name: "translation",
        rows: "5",
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
        }, "Update your saved translation"), /*#__PURE__*/React.createElement("textarea", {
          id: "translationText",
          type: "text",
          name: "translation",
          placeholder: "Translation",
          rows: "5",
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
        }), /*#__PURE__*/React.createElement("input", {
          className: "textTranslationSubmit",
          type: "submit",
          value: "Update"
        }), /*#__PURE__*/React.createElement("button", {
          type: "button",
          onClick: function onClick(e) {
            return stopUpdating(props.csrf);
          }
        }, "Cancel"))
      );
    }
}; //Load in the previously saved translations


var TranslationList = function TranslationList(props) {
  //If there are no previously saved translations
  if (props.translations.length === 0) {
    //Return a empty list
    return (/*#__PURE__*/React.createElement("div", {
        className: "translationList"
      }, /*#__PURE__*/React.createElement("h3", {
        className: "emptyList"
      }, "There are no saved translations!"))
    );
  } //There are saved translations, so make a map of them


  var translationNodes = props.translations.map(function (translations) {
    //Return a new table entry for each saved translation
    return (/*#__PURE__*/React.createElement("div", {
        key: translations._id,
        className: "savedTranslation"
      }, /*#__PURE__*/React.createElement("h3", {
        className: "translationText"
      }, translations.translation), /*#__PURE__*/React.createElement("button", {
        onClick: function onClick(e) {
          return updateTranslation(translations.translation, props.translations, translations._id);
        }
      }, "Update"), /*#__PURE__*/React.createElement("button", {
        onClick: function onClick(e) {
          return deleteTranslation(translations._id);
        }
      }, "Delete"))
    );
  }); //Return the translations list

  return (/*#__PURE__*/React.createElement("div", {
      className: "translationList"
    }, translationNodes)
  );
};
"use strict";

var currentWindow = "Text";
var textbox;
var removedElem;
var updating = false; //Get the content we will be updating

var input = document.querySelector("#translationInput");
var output = document.querySelector("#translationOutput");
var savedData = document.querySelector("#savedTranslations"); //Setup the page by rendering the form and list

var setup = function setup(csrf) {
  document.querySelector("#dateButton").addEventListener("click", function (e) {
    setListener(e, csrf, "Date");
  });
  document.querySelector("#numberButton").addEventListener("click", function (e) {
    setListener(e, csrf, "Number");
  });
  document.querySelector("#textButton").addEventListener("click", function (e) {
    setListener(e, csrf, "Text");
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
  var updateOutput = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : [];

  //Search for which window we're currently on
  //Then display the appropriate info
  switch (currentWindow) {
    case "Text":
      {
        input.innerHTML = "";
        ReactDOM.render( /*#__PURE__*/React.createElement(TranslationForm, {
          csrf: csrf
        }), output);
        ReactDOM.render( /*#__PURE__*/React.createElement(TranslationList, {
          translations: updateList
        }), savedData); //Set the textbox to the translation box

        textbox = document.querySelector("#translationText");
        break;
      }

    case "Date":
      {
        ReactDOM.render( /*#__PURE__*/React.createElement(DateForm, null), input);
        ReactDOM.render( /*#__PURE__*/React.createElement(DateOutput, {
          date: updateOutput,
          csrf: csrf
        }), output);
        ReactDOM.render( /*#__PURE__*/React.createElement(DateList, {
          dates: updateList
        }), savedData);
        document.querySelector("#dateInput").value = today.toJSON().slice(0, 10);
        break;
      }

    case "Number":
      {
        ReactDOM.render( /*#__PURE__*/React.createElement(NumberForm, {
          csrf: csrf
        }), input);
        ReactDOM.render( /*#__PURE__*/React.createElement(NumberOutput, {
          number: updateOutput,
          csrf: csrf
        }), output);
        ReactDOM.render( /*#__PURE__*/React.createElement(NumberList, {
          numbers: updateList
        }), savedData); //Set the textbox to the number box

        textbox = document.querySelector("#numberInput");
        break;
      } //Default to the text box

      defaut: {
        ReactDOM.render( /*#__PURE__*/React.createElement(TranslationForm, {
          csrf: csrf
        }), output);
        ReactDOM.render( /*#__PURE__*/React.createElement(TranslationList, {
          translations: updateList
        }), savedData); //Set the textbox to the translation box

        textbox = document.querySelector("#translationText"); //if we're not updating...

        if (!updating) {
          //Load the data into the list
          loadFromServer();
        }

        break;
      }

  } //if we're not updating...


  if (!updating) {
    //Load the data into the list
    loadFromServer();
  }

  clearError();
}; //Refresh the page and show all the translations


var loadFromServer = function loadFromServer() {
  var direct = "/get" + currentWindow;
  sendAjax('GET', direct, null, function (data) {
    switch (direct) {
      case '/getText':
        {
          ReactDOM.render( /*#__PURE__*/React.createElement(TranslationList, {
            translations: data.translations
          }), savedData);
          break;
        }

      case '/getDate':
        {
          ReactDOM.render( /*#__PURE__*/React.createElement(DateList, {
            dates: data.dates
          }), savedData);
          break;
        }

      case '/getNumber':
        {
          ReactDOM.render( /*#__PURE__*/React.createElement(NumberList, {
            numbers: data.numbers
          }), savedData);
          break;
        }
    }
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

//Update the error message in the DOM
var handleError = function handleError(message) {
  $("#errorMessage").text(message);
}; //Clear the error message in the DOM


var clearError = function clearError() {
  $("#errorMessage").text("");
}; //Redirect us to a new page


var redirect = function redirect(response) {
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

  today = new Date(); //Get the time-zone offset

  var offset = today.getTimezoneOffset() / 60; //Set the offset

  today.setHours(today.getHours() + offset);
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
  e.preventDefault(); //get the number value

  var input = document.querySelector("#numberInput").value; //Check if there's no input

  if (input == "") {
    //There was, so return false
    handleError("Please enter in a number to be translated."); //Send the nothing to be displayed

    loadNumber([]);
    return false;
  } //Check if a letter was entered
  else if (isNaN(input)) {
      // Letters were entered
      handleError("No text is allowed."); //Send the nothing to be displayed

      loadNumber([]);
      return false;
    } else {
      //A valid number was entered
      clearError();
    } // Create the json object


  var data = {}; // Create a counter

  var counter = {
    counter: 0
  }; // Check if the input's actually valid or not
  // translate the string back into a number, and get it's length

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
  } //Send the number to be displayed


  loadNumber(data);
};

var loadNumber = function loadNumber(data) {
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
};
