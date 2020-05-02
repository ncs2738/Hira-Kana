"use strict";

//Grab the handlebar for the game screen
var gameScreen = document.querySelector("#gameScreen"); //value used for holding the current screen value; defaults to the title screen

var currentWindow = "title"; //variable used for holding the selected difficutly button; defaults to the easy button for easy mode

var tempButton; //A variable used for grabbing the text field for the typing game

var textField; //Variable to hold the score's data

var score = []; //Render the windows

var createWindow = function createWindow() {
  //Search for which window we're currently on
  //Then display the appropriate info
  switch (currentWindow) {
    case "title":
      {
        ReactDOM.render( /*#__PURE__*/React.createElement(TitleScreen, null), gameScreen);
        break;
      }

    case "play":
      {
        ReactDOM.render( /*#__PURE__*/React.createElement(GameScreen, null), gameScreen);
        textField = document.querySelector("#textField"); //Gets textbox value

        textField.onpaste = function () {
          return false;
        }; //Disables pasting into the textbox; NO CHEATING!


        startGame(); //starts the game

        break;
      }

    case "instructions":
      {
        ReactDOM.render( /*#__PURE__*/React.createElement(InstructionsScreen, null), gameScreen);
        break;
      }

    case "options":
      {
        ReactDOM.render( /*#__PURE__*/React.createElement(OptionsScreen, null), gameScreen); //Selects the easy option for the game mode

        tempButton = document.querySelector(".easy");
        tempButton.className += "Active";
        optionArray = []; //Clears the search array
        //Add the handlers to the options menu

        setOptionHandlers(); //Set their default values

        setDefaultOptions();
        break;
      }

    case "gameOver":
      {
        ReactDOM.render( /*#__PURE__*/React.createElement(GameOverScreen, null), gameScreen);
        showEndResults(); //Displays the message that the end-screen should have; changes based off of players' performance

        break;
      }

    case "badSearch":
      {
        ReactDOM.render( /*#__PURE__*/React.createElement(BadSearchScreen, null), gameScreen);
        break;
      } //Default to the title screen

      defaut: {
        ReactDOM.render( /*#__PURE__*/React.createElement(TitleScreen, null), gameScreen);
        break;
      }

  }
}; //Get / set the user's score on load


var loadScore = function loadScore() {
  //First get the users score
  sendAjax('GET', "/getScore", null, function (data) {
    //If they don't have a score, make one for them
    if (data.Scores == "") {
      //Create a new blank score of 0.
      //This will recall the load-score function once the score is made
      newScore();
    } else {
      score = data.Scores[0]; //store the score into a variable

      score.score -= 0; //Lazily cast the score value to a number
      //Display the highscore

      ReactDOM.render( /*#__PURE__*/React.createElement(PointDisplay, {
        message: 'Your Highscore:',
        points: score.score
      }), document.querySelector("#highScoreDiv"));
    }
  });
}; //Load the page and set off the chain of events


$(document).ready(function () {
  //Read in the local text file containing the vocabulary
  readFile(); //Load in the users score

  loadScore(); //Load the window

  createWindow();
});
"use strict";

//Builds the bad search screen html
//This calls when there are no results for the user's word category search
var BadSearchScreen = function BadSearchScreen() {
  return (/*#__PURE__*/React.createElement("div", {
      id: "badSearch"
    }, /*#__PURE__*/React.createElement("div", {
      className: "menuContainer"
    }, /*#__PURE__*/React.createElement("div", {
      className: "menuBox"
    }, /*#__PURE__*/React.createElement("div", {
      className: "menuTitle"
    }, /*#__PURE__*/React.createElement("hr", null), /*#__PURE__*/React.createElement("h1", {
      className: "sceneTitle"
    }, "Uh Oh!"), /*#__PURE__*/React.createElement("hr", null)), /*#__PURE__*/React.createElement("p", {
      className: "dialogueText"
    }, "We're sorry, but there seems to be no words fitting all of your search fields!"), /*#__PURE__*/React.createElement("p", {
      className: "dialogueText"
    }, "Please search again!"), /*#__PURE__*/React.createElement("p", {
      className: "dialogueText"
    }, "Tag Counts:"), /*#__PURE__*/React.createElement("div", {
      className: "dialogueBox"
    }, /*#__PURE__*/React.createElement("div", {
      id: "errorMessageBox"
    })), /*#__PURE__*/React.createElement("div", {
      className: "widget"
    }, /*#__PURE__*/React.createElement("div", {
      className: "hButtons"
    }, /*#__PURE__*/React.createElement("span", {
      className: "hButtonSpacing"
    }, /*#__PURE__*/React.createElement("button", {
      type: "button",
      onClick: function onClick(e) {
        return setWindow(e);
      },
      value: "instructions",
      className: "Instructions"
    }, "\u2022 Instructions \u2022")), /*#__PURE__*/React.createElement("span", {
      className: "hButtonSpacing"
    }, /*#__PURE__*/React.createElement("button", {
      type: "button",
      onClick: function onClick(e) {
        return setWindow(e);
      },
      value: "options",
      className: "Options"
    }, "\u2022 Game Options \u2022")))))))
  );
};
"use strict";

//Builds the File Error screen html
var FileErrorScreen = function FileErrorScreen() {
  return (/*#__PURE__*/React.createElement("div", {
      id: "fileError"
    }, /*#__PURE__*/React.createElement("div", {
      className: "menuContainer"
    }, /*#__PURE__*/React.createElement("div", {
      className: "menuBox"
    }, /*#__PURE__*/React.createElement("div", {
      className: "menuTitle"
    }, /*#__PURE__*/React.createElement("hr", null), /*#__PURE__*/React.createElement("h1", {
      className: "sceneTitle"
    }, "No Text File Found!"), /*#__PURE__*/React.createElement("hr", null)), /*#__PURE__*/React.createElement("div", {
      id: "filErrorMessageBox"
    }, /*#__PURE__*/React.createElement("p", {
      className: "dialogueText"
    }, "We're sorry, but we cannot read our text files!"), /*#__PURE__*/React.createElement("p", {
      className: "dialogueText"
    }, "Please be patient while we fix this!"), /*#__PURE__*/React.createElement("p", {
      className: "dialogueText"
    }, "Contact ncs2378@rit.edu to fix this!")))))
  );
};
"use strict";

//Builds the game over screen html
var GameOverScreen = function GameOverScreen() {
  return (/*#__PURE__*/React.createElement("div", {
      id: "gameOver"
    }, /*#__PURE__*/React.createElement("div", {
      className: "menuContainer"
    }, /*#__PURE__*/React.createElement("div", {
      className: "menuBox"
    }, /*#__PURE__*/React.createElement("div", {
      className: "menuTitle"
    }, /*#__PURE__*/React.createElement("hr", null), /*#__PURE__*/React.createElement("h1", {
      className: "sceneTitle"
    }, "Game Over"), /*#__PURE__*/React.createElement("hr", null)), /*#__PURE__*/React.createElement("div", {
      id: "resultsDiv"
    }), /*#__PURE__*/React.createElement("div", {
      className: "dialogueBox"
    }, /*#__PURE__*/React.createElement("div", {
      id: "gameOverTextBox"
    })), /*#__PURE__*/React.createElement("div", {
      id: "totalPointsDiv"
    }), /*#__PURE__*/React.createElement("div", {
      id: "highScoreDiv"
    }), /*#__PURE__*/React.createElement("div", {
      className: "widget"
    }, /*#__PURE__*/React.createElement("div", {
      className: "hButtons"
    }, /*#__PURE__*/React.createElement("span", {
      className: "hButtonSpacing"
    }, /*#__PURE__*/React.createElement("button", {
      type: "button",
      onClick: function onClick(e) {
        return setWindow(e);
      },
      value: "instructions",
      className: "Instructions"
    }, "\u2022 Instructions \u2022")), /*#__PURE__*/React.createElement("span", {
      className: "hButtonSpacing"
    }, /*#__PURE__*/React.createElement("button", {
      type: "button",
      onClick: function onClick(e) {
        return setWindow(e);
      },
      value: "options",
      className: "Options"
    }, "\u2022 Game Options \u2022")), /*#__PURE__*/React.createElement("span", {
      className: "hButtonSpacing"
    }, /*#__PURE__*/React.createElement("button", {
      type: "button",
      onClick: function onClick(e) {
        return setWindow(e);
      },
      value: "play",
      className: "Play"
    }, "\u2022 Play Game \u2022")))))))
  );
};
"use strict";

//############## USED BY THE GAME MANAGER ############## 
//Shows the current tallies
var TallyCounter = function TallyCounter(props) {
  if (!props.miss) {
    return (/*#__PURE__*/React.createElement("p", null, props.tally)
    );
  } else {
    return (/*#__PURE__*/React.createElement("p", null, props.wrong, " / ", props.miss)
    );
  }
};

var RenderText = function RenderText(props) {
  return (/*#__PURE__*/React.createElement("div", {
      id: "words"
    }, /*#__PURE__*/React.createElement("h1", {
      id: "word"
    }, props.text[0].trim().toString()), /*#__PURE__*/React.createElement("h2", {
      id: "meaning"
    }, props.text[1].trim()), /*#__PURE__*/React.createElement("h4", {
      id: "clickText"
    }, "(Click For T.T.S)"))
  );
}; //############## USED BY THE POINT MANAGER ############## 
//Used for updating the timer


var TimerDisplay = function TimerDisplay(props) {
  return (/*#__PURE__*/React.createElement("p", {
      id: "timer"
    }, props.time, "s")
  );
}; //used for displaying a image when a right or wrong answer is entered


var ShowImage = function ShowImage(props) {
  if (props.image === "right") {
    return (/*#__PURE__*/React.createElement("img", {
        id: "timer",
        src: "assets/img/right.png"
      })
    );
  } else {
    return (/*#__PURE__*/React.createElement("img", {
        id: "timer",
        src: "assets/img/wrong.png"
      })
    );
  }
}; //############## USED BY THE GAME OVER SCREEN ############## 
//Load in the search result counts


var WordList = function WordList(props) {
  var wordNodes = props.words.map(function (words, i) {
    return (/*#__PURE__*/React.createElement("div", {
        key: i
      }, /*#__PURE__*/React.createElement("div", {
        className: "wordMeaning"
      }, words[1]), /*#__PURE__*/React.createElement("div", {
        className: "resultsChar"
      }, words[0]))
    );
  }); //Return the translations list

  return (/*#__PURE__*/React.createElement("div", null, wordNodes)
  );
}; //Show the points and its message


var PointDisplay = function PointDisplay(props) {
  return (/*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("p", {
      className: "dialogueText"
    }, props.message), /*#__PURE__*/React.createElement("p", {
      className: "totalPoints"
    }, props.points))
  );
}; //Show the results of the game


var GameResultDisplay = function GameResultDisplay(props) {
  return (/*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("p", {
      id: "gameResults"
    }, props.message1), /*#__PURE__*/React.createElement("p", {
      id: "wrongResults"
    }, props.message2))
  );
}; //############## USED BY THE BAD SEARCH SCREEN ############## 
//Load in the search result counts


var ResultList = function ResultList(props) {
  var resultNodes = props.options.map(function (options, i) {
    //Return a new table entry for each saved translation
    return (/*#__PURE__*/React.createElement("div", {
        key: i
      }, /*#__PURE__*/React.createElement("div", {
        className: "wordMeaning"
      }, options), /*#__PURE__*/React.createElement("div", {
        className: "resultsChar"
      }, props.counts[i]))
    );
  }); //Return the translations list

  return (/*#__PURE__*/React.createElement("div", null, resultNodes)
  );
};
"use strict";

//Builds the game screen html
var GameScreen = function GameScreen() {
  return (/*#__PURE__*/React.createElement("div", {
      id: "game"
    }, /*#__PURE__*/React.createElement("div", {
      id: "gameContainer"
    }, /*#__PURE__*/React.createElement("div", {
      className: "gameBox"
    }, /*#__PURE__*/React.createElement("div", {
      className: "container"
    }, /*#__PURE__*/React.createElement("div", {
      className: "widget"
    }, /*#__PURE__*/React.createElement("div", {
      id: "wordContainer"
    }, /*#__PURE__*/React.createElement("div", {
      id: "words"
    }, /*#__PURE__*/React.createElement("h1", {
      id: "word"
    }), /*#__PURE__*/React.createElement("h2", {
      id: "meaning"
    }), /*#__PURE__*/React.createElement("h4", {
      id: "clickText"
    }, "(Click For T.T.S)"))))), /*#__PURE__*/React.createElement("div", {
      id: "timerBox"
    }), /*#__PURE__*/React.createElement("div", {
      className: "widget"
    }, /*#__PURE__*/React.createElement("div", {
      id: "textBox"
    }, /*#__PURE__*/React.createElement("input", {
      type: "text",
      id: "textField",
      onInput: function onInput(e) {
        return handleInput(e);
      },
      autofocus: true,
      maxlength: "15"
    }))), /*#__PURE__*/React.createElement("div", {
      id: "pointBox"
    }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h3", {
      className: "wrong"
    }, "Wrong"), /*#__PURE__*/React.createElement("h3", {
      id: "wrongAnswers"
    }, "#")), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h3", {
      id: "pointsText"
    }, "Points"), /*#__PURE__*/React.createElement("h3", {
      id: "gamePoints"
    }, "#")), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h3", {
      id: "right"
    }, "Right"), /*#__PURE__*/React.createElement("h3", {
      id: "rightAnswers"
    }, "#"))), /*#__PURE__*/React.createElement("div", {
      id: "gridContainer"
    }, /*#__PURE__*/React.createElement("div", {
      id: "grid"
    })))))
  );
};

function handleInput(e) {
  inputHandler(e);
  answerCompare();
}
"use strict";

//Builds the instruction screen html
var InstructionsScreen = function InstructionsScreen() {
  return (/*#__PURE__*/React.createElement("div", {
      id: "instructions"
    }, /*#__PURE__*/React.createElement("div", {
      className: "menuContainer"
    }, /*#__PURE__*/React.createElement("div", {
      className: "menuBox"
    }, /*#__PURE__*/React.createElement("div", {
      className: "menuTitle"
    }, /*#__PURE__*/React.createElement("hr", null), /*#__PURE__*/React.createElement("h1", {
      className: "sceneTitle"
    }, "Instructions"), /*#__PURE__*/React.createElement("hr", null)), /*#__PURE__*/React.createElement("div", {
      id: "instructionBox"
    }, /*#__PURE__*/React.createElement("p", null, "Type out the word displayed on screen into the text box!"), /*#__PURE__*/React.createElement("p", null, "Type in lowercase for hiragana characters, and in uppercasse for katakana characters."), /*#__PURE__*/React.createElement("p", null, "Type in '-' for dashes, '.' for small tsu, and '_' for small katakana vowels."), /*#__PURE__*/React.createElement("p", null, "Click on the word displayed to play a text to speech recording of it!"), /*#__PURE__*/React.createElement("p", null, "Valid keystroke inputs: ", /*#__PURE__*/React.createElement("br", null), "a, e, i, o, u, k, s, t, n, h, ", /*#__PURE__*/React.createElement("br", null), "m, y, r, w, g, z, d, b, p, '.', ", /*#__PURE__*/React.createElement("br", null), "'_', '-', and v (for katakana only)")), /*#__PURE__*/React.createElement("div", {
      className: "widget"
    }, /*#__PURE__*/React.createElement("div", {
      className: "hButtons"
    }, /*#__PURE__*/React.createElement("span", {
      className: "hButtonSpacing"
    }, /*#__PURE__*/React.createElement("button", {
      type: "button",
      onClick: function onClick(e) {
        return setWindow(e);
      },
      value: "options",
      className: "Options"
    }, "\u2022 Game Options \u2022")), /*#__PURE__*/React.createElement("span", {
      className: "hButtonSpacing"
    }, /*#__PURE__*/React.createElement("button", {
      type: "button",
      onClick: function onClick(e) {
        return setWindow(e);
      },
      value: "play",
      className: "Play"
    }, "\u2022 Play Game \u2022")))))))
  );
};
"use strict";

//Builds the title screen html
var OptionsScreen = function OptionsScreen() {
  return (/*#__PURE__*/React.createElement("div", {
      id: "gameOptions"
    }, /*#__PURE__*/React.createElement("div", {
      className: "menuContainer"
    }, /*#__PURE__*/React.createElement("div", {
      className: "menuBox"
    }, /*#__PURE__*/React.createElement("div", {
      className: "menuTitle"
    }, /*#__PURE__*/React.createElement("hr", null), /*#__PURE__*/React.createElement("h1", {
      id: "sceneTitle"
    }, "Game Settings"), /*#__PURE__*/React.createElement("hr", null)), /*#__PURE__*/React.createElement("div", {
      id: "optionsContainer"
    }, /*#__PURE__*/React.createElement("div", {
      className: "optionBox"
    }, /*#__PURE__*/React.createElement("p", {
      className: "optionText"
    }, "Customize your game's difficulty!")), /*#__PURE__*/React.createElement("div", {
      className: "optionBox"
    }, /*#__PURE__*/React.createElement("p", {
      className: "optionTitle"
    }, "Mandatory:"), /*#__PURE__*/React.createElement("p", {
      className: "optionText"
    }, "(These are set automatically if you don't pick any of them!)")), /*#__PURE__*/React.createElement("div", {
      className: "widget"
    }, /*#__PURE__*/React.createElement("div", {
      className: "optionBox"
    }, /*#__PURE__*/React.createElement("p", {
      className: "optionText"
    }, "Which alphabet would you like?"), /*#__PURE__*/React.createElement("select", {
      id: "Alphabet"
    }, /*#__PURE__*/React.createElement("option", {
      value: "hiragana"
    }, "Hiragana"), /*#__PURE__*/React.createElement("option", {
      value: "katakana"
    }, "Katakana"), /*#__PURE__*/React.createElement("option", {
      value: "both"
    }, "Both"))), /*#__PURE__*/React.createElement("div", {
      className: "optionBox"
    }, /*#__PURE__*/React.createElement("p", {
      className: "optionText"
    }, "How many misses are you allowed?"), /*#__PURE__*/React.createElement("select", {
      id: "missLimit"
    }, /*#__PURE__*/React.createElement("option", {
      value: "1"
    }, "1"), /*#__PURE__*/React.createElement("option", {
      value: "3"
    }, "3"), /*#__PURE__*/React.createElement("option", {
      value: "5"
    }, "5"))), /*#__PURE__*/React.createElement("div", {
      className: "optionBox"
    }, /*#__PURE__*/React.createElement("p", {
      className: "optionText"
    }, "How much time do you want to type?"), /*#__PURE__*/React.createElement("select", {
      id: "timeLimit"
    }, /*#__PURE__*/React.createElement("option", {
      value: "10"
    }, "10 Seconds"), /*#__PURE__*/React.createElement("option", {
      value: "15"
    }, "15 Seconds"), /*#__PURE__*/React.createElement("option", {
      value: "20"
    }, "20 Seconds"), /*#__PURE__*/React.createElement("option", {
      value: "30"
    }, "30 Seconds"), /*#__PURE__*/React.createElement("option", {
      value: "60"
    }, "1 Minute")))), /*#__PURE__*/React.createElement("div", {
      className: "optionBox"
    }, /*#__PURE__*/React.createElement("div", {
      className: "optionDescription"
    }, /*#__PURE__*/React.createElement("p", {
      className: "optionTitle"
    }, "Optional:"), /*#__PURE__*/React.createElement("p", {
      className: "optionText"
    }, "These allow you to customize what kinds of words you'll be typing!"), /*#__PURE__*/React.createElement("p", {
      className: "optionText"
    }, "(You can choose any amount! Feel free to mix and match them!)"))), /*#__PURE__*/React.createElement("div", {
      className: "widget"
    }, /*#__PURE__*/React.createElement("div", {
      className: "optionBox"
    }, /*#__PURE__*/React.createElement("div", {
      className: "optionDescription"
    }, /*#__PURE__*/React.createElement("p", {
      className: "optionText"
    }, "What difficulty of words would you like?"), /*#__PURE__*/React.createElement("div", {
      className: "hButtons"
    }, /*#__PURE__*/React.createElement("span", {
      className: "hButtonSpacing"
    }, /*#__PURE__*/React.createElement("button", {
      type: "button",
      onClick: function onClick(e) {
        return setActive(e);
      },
      id: "easyButton",
      value: "easy",
      className: "easy"
    }, "\u2022 Easy! \u2022")), /*#__PURE__*/React.createElement("span", {
      className: "hButtonSpacing"
    }, /*#__PURE__*/React.createElement("button", {
      type: "button",
      onClick: function onClick(e) {
        return setActive(e);
      },
      id: "medButton",
      value: "medium",
      className: "medium"
    }, "\u2022 Medium!! \u2022")), /*#__PURE__*/React.createElement("span", {
      className: "hButtonSpacing"
    }, /*#__PURE__*/React.createElement("button", {
      type: "button",
      onClick: function onClick(e) {
        return setActive(e);
      },
      id: "hardButton",
      value: "hard",
      className: "hard"
    }, "\u2022 Hard!!! \u2022"))))), /*#__PURE__*/React.createElement("div", {
      className: "optionBox"
    }, /*#__PURE__*/React.createElement("div", {
      className: "optionDescription"
    }, /*#__PURE__*/React.createElement("p", {
      className: "optionText"
    }, "What type of words would you like to see?"), /*#__PURE__*/React.createElement("select", {
      id: "wordCategory"
    }, /*#__PURE__*/React.createElement("option", {
      value: "any"
    }, "Any"), /*#__PURE__*/React.createElement("option", {
      value: "verb"
    }, "Verbs"), /*#__PURE__*/React.createElement("option", {
      value: "noun"
    }, "Nouns"), /*#__PURE__*/React.createElement("option", {
      value: "adjective"
    }, "Adjectives"), /*#__PURE__*/React.createElement("option", {
      value: "expression"
    }, "Expressions"), /*#__PURE__*/React.createElement("option", {
      value: "location"
    }, "Locations"), /*#__PURE__*/React.createElement("option", {
      value: "direction"
    }, "Directions"), /*#__PURE__*/React.createElement("option", {
      value: "food"
    }, "Food"), /*#__PURE__*/React.createElement("option", {
      value: "object"
    }, "Objects"), /*#__PURE__*/React.createElement("option", {
      value: "time"
    }, "Time"), /*#__PURE__*/React.createElement("option", {
      value: "people"
    }, "People"), /*#__PURE__*/React.createElement("option", {
      value: "general"
    }, "General")))), /*#__PURE__*/React.createElement("div", {
      className: "optionBox"
    }, /*#__PURE__*/React.createElement("div", {
      className: "optionDescription"
    }, /*#__PURE__*/React.createElement("p", {
      className: "optionText"
    }, "Would you like to quiz yourself using Genki book chapters?"), /*#__PURE__*/React.createElement("select", {
      id: "chapters"
    }, /*#__PURE__*/React.createElement("option", {
      value: "any"
    }, "Any"), /*#__PURE__*/React.createElement("option", {
      value: "chap1"
    }, "Chapter 1"), /*#__PURE__*/React.createElement("option", {
      value: "chap2"
    }, "Chapter 2"), /*#__PURE__*/React.createElement("option", {
      value: "chap3"
    }, "Chapter 3"), /*#__PURE__*/React.createElement("option", {
      value: "chap4"
    }, "Chapter 4"), /*#__PURE__*/React.createElement("option", {
      value: "chap5"
    }, "Chapter 5"))))), /*#__PURE__*/React.createElement("div", {
      className: "widget"
    }, /*#__PURE__*/React.createElement("div", {
      className: "hButtons"
    }, /*#__PURE__*/React.createElement("span", {
      className: "hButtonSpacing"
    }, /*#__PURE__*/React.createElement("button", {
      type: "button",
      onClick: function onClick(e) {
        return setWindow(e);
      },
      value: "instructions",
      className: "Instructions"
    }, "\u2022 Instructions \u2022")), /*#__PURE__*/React.createElement("span", {
      className: "hButtonSpacing"
    }, /*#__PURE__*/React.createElement("button", {
      type: "button",
      onClick: function onClick(e) {
        return setWindow(e);
      },
      value: "play",
      className: "Play"
    }, "\u2022 Play Game \u2022"))))))))
  );
};
"use strict";

//Builds the title screen html
var TitleScreen = function TitleScreen() {
  return (/*#__PURE__*/React.createElement("div", {
      id: "titleScreen"
    }, /*#__PURE__*/React.createElement("div", {
      className: "menuContainer"
    }, /*#__PURE__*/React.createElement("div", {
      className: "menuBox"
    }, /*#__PURE__*/React.createElement("div", {
      className: "menuTitle"
    }, /*#__PURE__*/React.createElement("hr", null), /*#__PURE__*/React.createElement("h1", {
      className: "sceneTitle"
    }, "Hira- Kana"), /*#__PURE__*/React.createElement("hr", null)), /*#__PURE__*/React.createElement("div", {
      className: "widget"
    }, /*#__PURE__*/React.createElement("div", {
      className: "vButtons"
    }, /*#__PURE__*/React.createElement("span", {
      className: "vButtonSpacing"
    }, /*#__PURE__*/React.createElement("button", {
      type: "button",
      onClick: function onClick(e) {
        return setWindow(e);
      },
      value: "play",
      className: "Play"
    }, "\u2022 Play Game \u2022")), /*#__PURE__*/React.createElement("span", {
      className: "vButtonSpacing"
    }, /*#__PURE__*/React.createElement("button", {
      type: "button",
      onClick: function onClick(e) {
        return setWindow(e);
      },
      value: "instructions",
      className: "Instructions"
    }, "\u2022 Instructions \u2022")), /*#__PURE__*/React.createElement("span", {
      className: "vButtonSpacing"
    }, /*#__PURE__*/React.createElement("button", {
      type: "button",
      onClick: function onClick(e) {
        return setWindow(e);
      },
      value: "options",
      className: "Options"
    }, "\u2022 Game Options \u2022")))), /*#__PURE__*/React.createElement("div", {
      id: "highScoreDiv"
    }))))
  );
};
"use strict";
"use strict";

var words = []; //Array used for holding file read-in data

var gameWords = []; //Array used for holding in filtered words

var countArray = []; //Array used for getting count of word tags in the text file

var searchArray = []; //Array used for containing parameters to be searched

var wrongArray = []; //Array used for collecting words the user gets wrong. 

function readFile() //Reads in text file containing words to be typed
{
  var path = 'assets/text/input.txt';
  var xhr = new XMLHttpRequest();

  xhr.onreadystatechange = function () {
    if (xhr.readyState === XMLHttpRequest.DONE) {
      if (xhr.status === 200) //If file read properly
        {
          readData(xhr.responseText); //Read the data
        } else //Display error screen.
        {
          ReactDOM.render( /*#__PURE__*/React.createElement(FileErrorScreen, null), gameScreen);
        }
    }
  };

  xhr.open("GET", path, true);
  xhr.send();
} //Paramter: file data


function readData(data) //Splits text file into array by new lines
{
  words = data.split("\n");
} //Paramter: settings array containing user search fields


function setParameters(paramArray) {
  gameWords = []; //resets gamewords array

  for (var i = 1; i < words.length; i++) // Starts off at one to ignore the text key
  {
    var word = words[i].split('|'); // Splits current line of file into three parts; the japanese word | the english word | search tags

    if (paramArray.length > 0) //If there are terms to search
      {
        paramCheck: for (var j = 0; j < paramArray.length; j++) //Loop through the search term array
        {
          if (word[2].search(paramArray[j]) == -1) //If the word does not contain the search term. word[2] contains all the search tags for the word.
            {
              break paramCheck; //Break the loop
            }

          if (j == paramArray.length - 1) //Succesfully got through loop without breaking;
            {
              gameWords.push([word[0], word[1]]); //This means the word contains all search terms. Add word to gameWords array to be used in game.
            }
        }
      } else //If there are none, just push all the words into the gameWords array
      {
        gameWords.push([word[0], word[1]]);
      }
  }

  if (gameWords.length == 0) //If there were no words meeting all search criteria...
    {
      showSearchNum(paramArray); //Append the tag counts searched to the bad-search screen.
      //Set the next window to the bad search screen

      currentWindow = "badSearch";
      createWindow();
      ReactDOM.render( /*#__PURE__*/React.createElement(ResultList, {
        options: optionArray,
        counts: countArray
      }), document.querySelector("#errorMessageBox"));
    } else //The search criteria was met
    {
      nextLevel(); //Go onto the next level (AKA actually start the game.)

      setTTS(); //Set the TTS button to being active
    }
} //Used at the start of each level; Reads from gameWords.


function getNewWord() {
  var index = Math.floor(Math.random() * gameWords.length); //Gets random index number

  var newWord = gameWords.splice(index, 1)[0]; //Removes the word from the gameWords array

  return newWord; //Returns new word
} //Array used for getting the counts of search criteria tags of the overall words
//Parameters: search term array


function showSearchNum(paramArray) {
  countArray = []; //Resets arrays

  gameWords = [];

  for (var i = 0; i < paramArray.length; i++) //Sets the count array to the length of the search term array
  {
    countArray[i] = 0; //Fills each element with a 0. Will be incrimented to.
  }

  for (var j = 1; j < words.length; j++) // Starts off at one to ignore the text key
  {
    var word = words[j].split('|'); // Splits current line of file into three parts; the japanese word | the english word | search tags

    for (var k = 0; k < paramArray.length; k++) //Loops through search parameter array. 
    {
      if (word[2].search(paramArray[k]) > -1) //word[2] contains all the search tags for the word. Checks to see if the word contains the tags being searched
        {
          countArray[k]++; //if so, add tot he coint.
        }
    }
  }
}
"use strict";

//Gets values for points and answers
var word;
var rightCount;
var wrongCount;
var pointCount; //values used for tallying

var right = 0;
var wrong = 0;
var points = 0; //string used for holding word to be typed

var answer = ""; //array used for displaying new word to be typed and it's meaning

var newWords = [];

function getQueries() {
  word = document.querySelector("#wordContainer");
  rightCount = document.querySelector("#rightAnswers");
  wrongCount = document.querySelector("#wrongAnswers");
  pointCount = document.querySelector("#gamePoints");
} //Funciton used when beginning a new game


function startGame() {
  getQueries();
  setParameters(optionArray); //Searches for user's searched parameters. If there are no results, goes to BadSearch screen.
  //Resets all values

  wrongArray = []; //array used for collecting wrong answers. Declared in FileReader

  right = 0;
  wrong = 0;
  points = 0;
  ReactDOM.render( /*#__PURE__*/React.createElement(TallyCounter, {
    tally: right
  }), rightCount);
  ReactDOM.render( /*#__PURE__*/React.createElement(TallyCounter, {
    wrong: wrong,
    miss: missLimit
  }), wrongCount);
  ReactDOM.render( /*#__PURE__*/React.createElement(TallyCounter, {
    tally: points
  }), pointCount);
} //Checks to see if the user typed the word correctly; Calls after every input


function answerCompare() {
  if (textField.value == answer) //If the user did correctly type the word
    {
      rightAnswer(); //Add points
      //clearGrid(); //Clear the grid

      endCheck(); //Check to see if the game has ended. Game ends when there are no more words in the array to be typed.
    }
} //Adds points and wrong/right tally


function addPoints() {
  if (result) //If they did correctly type...
    {
      textField.disabled = true; //Disables textfield input

      points += getPoints(missLimit, timeLimit); //Add to the point value

      right++; //Adds a tally to the right counter 

      ReactDOM.render( /*#__PURE__*/React.createElement(TallyCounter, {
        tally: right
      }), rightCount); //Displays tallies on screen

      ReactDOM.render( /*#__PURE__*/React.createElement(TallyCounter, {
        tally: points
      }), pointCount);
    } else //User failed to type the word correctly
    {
      textField.disabled = true; //Disables textfield input

      wrong++; //Adds to the wrong tally

      ReactDOM.render( /*#__PURE__*/React.createElement(TallyCounter, {
        wrong: wrong,
        miss: missLimit
      }), wrongCount); //Displays tally on screen

      wrongArray.push(newWords); //Adds incorrectly typed word to wrong array; to be displayed at the end of the game
    }
} //Goes onto next level


function nextLevel() {
  textField.disabled = false; //Renables textfield inputs

  textField.value = ""; //Clears textfield by making it a blank string

  setTimer(timeLimit); //Resets timer

  newWords = getNewWord(); //Set the new word to bew shown

  ReactDOM.render( /*#__PURE__*/React.createElement(RenderText, {
    text: newWords
  }), word); //Gets a new word to be displayed
  //Set the answer equivelent to the word on screen
  //This looks real gross; I've gotta go 2 layers down to get the word from the div

  answer = word.firstChild.firstChild.innerHTML;
  textField.focus(); //Focuses onto the textbox
} //Checks to see if the user has reached the end of the game


function endCheck() {
  setTimeout(function () //Waits 2 seconds to go onto next screen / show new word
  {
    if (gameWords.length == 0 || wrong == missLimit) //If there are no more words to display / the user has messed up too many times
      {
        currentWindow = "gameOver";
        createWindow();
      } else {
      nextLevel(); //Show the next word
    }
  }, 2000);
}
"use strict";

//Gets Option menu selects
var alphabetSelect;
var missSelect;
var timeSelect;
var categorySelect;
var chapterSelect; //Gets option menu difficutly buttons

var easySelect;
var mediumSelect;
var hardSelect; //Variables used for storing option menu values + used for searching the text file

var missLimit = 5;
var timeLimit = 60;
var chosenAlphabet = "hiragana";
var chosenCategory = "any";
var chosenChapter = "any";
var chosenDifficulty = [];
var optionArray = ['easy', 'hiragana']; //Array used for holding search parameter terms. Set by default to easy and hiragana.

function setDefaultOptions() {
  //Set the miss limit
  missSelect.value = 5; //Set the time

  timeSelect.value = 60; //Set the alphabet

  alphabetSelect.value = "hiragana"; //Set the category type

  categorySelect.value = "any"; //Set the chapter number

  chapterSelect.value = "any"; //Resets all the values

  missLimit = 5;
  timeLimit = 60;
  chosenAlphabet = "hiragana";
  chosenCategory = "any";
  chosenChapter = "any";
}

function setOptionHandlers() {
  //Gets Option menu selects
  alphabetSelect = document.querySelector("#Alphabet");
  missSelect = document.querySelector("#missLimit");
  timeSelect = document.querySelector("#timeLimit");
  categorySelect = document.querySelector("#wordCategory");
  chapterSelect = document.querySelector("#chapters"); //Gets option menu difficutly buttons

  easySelect = document.querySelector(".easy");
  mediumSelect = document.querySelector(".medium");
  hardSelect = document.querySelector(".hard"); //Stores values into storage, sets the chosen limit to the stored value.

  missSelect.onchange = function (e) {
    missLimit = parseInt(e.target.value, 10);
  };

  timeSelect.onchange = function (e) {
    timeLimit = parseInt(e.target.value, 10);
  }; //Stores values into storage, sets the chosen value to the stored value.
  //Once the chosen value is set, calls the setOptionArray to set search parameters.


  alphabetSelect.onchange = function (e) {
    chosenAlphabet = alphabetSelect.value;
    setOptionArray();
  };

  categorySelect.onchange = function (e) {
    chosenCategory = categorySelect.value;
    setOptionArray();
  };

  chapterSelect.onchange = function (e) {
    chosenChapter = chapterSelect.value;
    setOptionArray();
  };
} //Checks what option values were selected. These values are used to filter the words shown in game


function setOptionArray() {
  optionArray = []; //Clears the search array

  if (chosenAlphabet && chosenAlphabet != "both") optionArray.push(chosenAlphabet); //If a alphabet was chosen, adds to the array

  if (chosenCategory && chosenCategory != "any") optionArray.push(chosenCategory); //If a category was chosen, adds to the array

  if (chosenChapter && chosenChapter != "any") optionArray.push(chosenChapter); //If a chapter was chosen, adds to the array

  if (chosenDifficulty && chosenDifficulty != "any") optionArray.push(tempButton.value); //If a difficulty was chosen, adds to the array
}
"use strict";

//Two new audio objects to be played when the player wins or loses
var won = new Audio();
won.src = "assets/audio/gameWon.mp3";
won.volume = .1;
var lost = new Audio();
lost.volume = .1;
lost.src = "assets/audio/gameLost.mp3"; //Function called for game buttons to set the direction for the next screen. 
//Parameters: click event

function setWindow(e) {
  //The next window to be loaded will be the button's value
  currentWindow = e.target.value;
  createWindow();
} //Function called to set the difficutly buttons' class to "(buttonName)Active". EX: .easy to .easyActive
//Parameters: click event


function setActive(e) {
  var tmp = tempButton.className.toString(); //Temp variable used for hodling the current active button's name

  tempButton.className = tmp.replace("Active", ""); //Removes the "Active" value from the button

  tempButton = e.target; //Sets tempButton to store the new button clicked

  chosenDifficulty = e.target.className; //Set the difficulty to the target's classname

  tempButton.className += "Active"; //Set the new button to active

  setOptionArray(); //Update the options array
} //Function called when the game has ended


function showEndScreen() {
  currentWindow = "gameOver"; //Changes screen to the bad-search screen

  createWindow();
}

function showEndResults() {
  if (wrongArray.length == 0) //If the player got no words wrong
    {
      won.play(); //Plays audio
      //Display their winning messages

      ReactDOM.render( /*#__PURE__*/React.createElement(GameResultDisplay, {
        message1: "Woah! You're a typing All-Star!",
        message2: "You didn't get a single word wrong! Great Job!"
      }), document.querySelector("#resultsDiv"));
    } else if (wrongArray.length > 0) //If the player did get some words wrong
    {
      if (wrongArray.length == missLimit) //If the player lost
        {
          lost.play(); //Plays audio
          //Display their losing messages

          ReactDOM.render( /*#__PURE__*/React.createElement(GameResultDisplay, {
            message1: "You lose! You got too many words wrong! Better luck next time!",
            message2: "Here are the words you got wrong:"
          }), document.querySelector("#resultsDiv"));
        } else //If the player got words wrong but still won
        {
          won.play(); //Plays audio
          //Display their winning messages

          ReactDOM.render( /*#__PURE__*/React.createElement(GameResultDisplay, {
            message1: "Good job! You got through all the words!",
            message2: "Here are the words you got wrong:"
          }), document.querySelector("#resultsDiv"));
        } //Loop through the words gotten wrong, and append them to the end-screen message box


      ReactDOM.render( /*#__PURE__*/React.createElement(WordList, {
        words: wrongArray
      }), document.querySelector("#gameOverTextBox"));
    } //Update the point value


  ReactDOM.render( /*#__PURE__*/React.createElement(PointDisplay, {
    message: 'Your got:',
    points: points + " points!"
  }), document.querySelector("#totalPointsDiv")); //The user didn't get a new highscore

  if (score.score > points) {
    ReactDOM.render( /*#__PURE__*/React.createElement(PointDisplay, {
      message: 'Your Highscore:',
      points: score.score
    }), document.querySelector("#highScoreDiv"));
  } //The user did!
  else {
      updateScore(points); //update the screen

      ReactDOM.render( /*#__PURE__*/React.createElement(PointDisplay, {
        message: "You got a new highscore:",
        points: points
      }), document.querySelector("#highScoreDiv"));
    }
} //Used when the user does not have a score (Only calls for their first time playing)


var newScore = function newScore() {
  //Get a token
  sendAjax('GET', '/getToken', null, function (result) {
    //And send the request to make a new score
    sendAjax('POST', "/newScore", {
      _csrf: result.csrfToken
    }, function (res) {
      //We created a new score, so load it in!
      loadScore();
    });
  });
}; //Used when the user gets a new highscore


var updateScore = function updateScore(highScore) {
  sendAjax('GET', '/getToken', null, function (result) {
    var newScore = {
      score: highScore,
      id: score._id,
      _csrf: result.csrfToken
    }; //Update the score

    sendAjax('POST', "/highScore", newScore, null);
  });
};
"use strict";

//Creates audio variables to be played if the user enters the answer correctly or incorrectly
var wrongSound = new Audio();
wrongSound.src = "assets/audio/wrong.mp3";
wrongSound.volume = .25;
var rightSound = new Audio();
rightSound.src = "assets/audio/right.mp3";
rightSound.volume = .25;
var time;
var timerSource;
var result;
var timer; //Funciton to create a count-down timer to be displayed on screen
//Parameters: Time limit (This is chosen by the user)

function setTimer(timeAmount) {
  time = timeAmount; //sets the time to the time limit chosen by user 

  timerSource = document.querySelector("#timerBox"); //Gets the timer element

  ReactDOM.render( /*#__PURE__*/React.createElement(TimerDisplay, {
    time: time
  }), timerSource); //Render the timer

  result = false; //Resets true/false value to see if the user answered correctly or not

  timer = setInterval(function () //Sets new interval timer
  {
    countDown();
  }, 1000);
} // Updates the timer count down every second


function countDown() {
  time -= 1; //Deducts from the time amount

  ReactDOM.render( /*#__PURE__*/React.createElement(TimerDisplay, {
    time: time
  }), timerSource); //Render the timer

  if (time < 0) //If the countdown finishes, this means the user failed to answer correctly
    {
      ReactDOM.render( /*#__PURE__*/React.createElement(ShowImage, {
        image: "wrong"
      }), timerSource); //Display a red-x where the timer was

      wrongSound.play(); //Play wrong answer sound

      result = false; //Set the result to false; the user answered wrong

      stopTimer(); //Stop the timer

      endCheck(); //Check to see if it's game overr
    }
} //Called by game-manager. Called when the user answers correctly


function rightAnswer() {
  ReactDOM.render( /*#__PURE__*/React.createElement(ShowImage, {
    image: "right"
  }), timerSource); //Show a green circle where the timer was

  rightSound.play(); //Play a right asnwer sound

  result = true; //Set the result to true; the user answered right

  stopTimer(); //Stop the timer
} //Stops the timer. The timer only stops when the user answers right / fails to answer


function stopTimer() {
  clearInterval(timer); //Clears the timer interval

  addPoints(); //Adds or deducts points
} //Calculates how many points the user earned by their difficulties and how fast they typed
//Parameters: total miss limit, total time limit


function getPoints(misses, totalTime) {
  var timeBonus = 60 / (totalTime + 1 - time); //Gets a time bonus calculated from the remaining time and the total time limit chosen. A lower the limit means more points.

  var pointValue = Math.ceil(5 / misses) * (timeBonus / totalTime) * (10 * misses); //Gets a overall point value from the time bonus and the total miss limit chosen. 

  pointValue = Math.ceil(pointValue); //Gets a flat value for the points

  return pointValue;
}
"use strict";

var apiKey = "f177946bd43944e4b272d7d48e241730"; //API key for voicerrs.

var speechButton;

function setTTS() {
  speechButton = document.querySelector("#wordContainer"); //Reads in word-box to be used as a button

  speechButton.addEventListener("click", textToSpeech); //Plays a TTS recording when the word-box button is clicked
} //Text to speech api call.
//Returns a audio link containing the pronunciation of the word to be typed.


function textToSpeech() {
  clickButton(); //Acts as a button being clicked

  var text = document.querySelector("#word").innerHTML; //Gets the word to be typed

  var url = "https://api.voicerss.org/?key=" + apiKey + "&hl=ja-jp&src=" + text + "&r=MP3&f=48khz_16bit_stereo&c=-10"; //link to API

  var audio = new Audio(); //Creates new audio element of the audio.

  audio.src = url; //Sets the audio source to the api link source.

  audio.volume = 1; //Sets the audio volume to max.

  audio.play(); //Plays the audio;
} //Function to imitate a button being clicked


function clickButton() {
  var tmp = speechButton.id.toString(); //Temp variable used for holding button's name

  speechButton.id += "Active"; //sets speech button to active

  setTimeout(function () {
    speechButton.id = tmp.replace("Active", ""); //Removes the "Active" value from the button
  }, 250);
}
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
