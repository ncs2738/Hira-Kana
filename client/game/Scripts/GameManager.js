//Gets values for points and answers
let word;
let rightCount;
let wrongCount;
let pointCount;

//values used for tallying
let right = 0;
let wrong = 0;
let points = 0;

//string used for holding word to be typed
let answer = "";
//array used for displaying new word to be typed and it's meaning
let newWords = [];


function getQueries()
{
    word = document.querySelector("#wordContainer"); 
    rightCount = document.querySelector("#rightAnswers");
    wrongCount = document.querySelector("#wrongAnswers");
    pointCount = document.querySelector("#gamePoints");
}

//Funciton used when beginning a new game
function startGame()
{
    getQueries();
    setParameters(optionArray); //Searches for user's searched parameters. If there are no results, goes to BadSearch screen.

    //Resets all values
    wrongArray = [];  //array used for collecting wrong answers. Declared in FileReader
    right = 0;
    wrong = 0;
    points = 0

    ReactDOM.render(<TallyCounter tally={right} />, rightCount);
    ReactDOM.render(<TallyCounter wrong={wrong} miss={missLimit}/>, wrongCount);
    ReactDOM.render(<TallyCounter tally={points} />, pointCount);
}


//Checks to see if the user typed the word correctly; Calls after every input
function answerCompare()
{
    if(textField.value == answer) //If the user did correctly type the word
    {
        rightAnswer(); //Add points
        //clearGrid(); //Clear the grid
        endCheck(); //Check to see if the game has ended. Game ends when there are no more words in the array to be typed.
    }
}

//Adds points and wrong/right tally
function addPoints()
{
    if(result) //If they did correctly type...
    {
        textField.disabled = true; //Disables textfield input
        points += getPoints(missLimit, timeLimit); //Add to the point value
        right++; //Adds a tally to the right counter 
        ReactDOM.render(<TallyCounter tally={right} />, rightCount);//Displays tallies on screen
        ReactDOM.render(<TallyCounter tally={points} />, pointCount);
    }
    else //User failed to type the word correctly
    {
        textField.disabled = true; //Disables textfield input
        wrong++; //Adds to the wrong tally
        ReactDOM.render(<TallyCounter wrong={wrong} miss={missLimit}/>, wrongCount); //Displays tally on screen
        wrongArray.push(newWords); //Adds incorrectly typed word to wrong array; to be displayed at the end of the game
    }
}

//Goes onto next level
function nextLevel()
{
    textField.disabled = false; //Renables textfield inputs
    textField.value = ""; //Clears textfield by making it a blank string
    setTimer(timeLimit); //Resets timer
    newWords = getNewWord(); //Set the new word to bew shown
    ReactDOM.render(<RenderText text={newWords} />, word); //Gets a new word to be displayed
    //Set the answer equivelent to the word on screen
    //This looks real gross; I've gotta go 2 layers down to get the word from the div
    answer = word.firstChild.firstChild.innerHTML; 
    textField.focus(); //Focuses onto the textbox
}

//Checks to see if the user has reached the end of the game
function endCheck()
{
    setTimeout(function() //Waits 2 seconds to go onto next screen / show new word
    {
        if(gameWords.length == 0 || wrong == missLimit) //If there are no more words to display / the user has messed up too many times
        {
            currentWindow = "gameOver";
            createWindow();
        }
        else
        {
            nextLevel(); //Show the next word
        }
    }, 2000);
}