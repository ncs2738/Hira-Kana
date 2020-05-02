//Grab the handlebar for the game screen
const gameScreen = document.querySelector("#gameScreen");

//value used for holding the current screen value; defaults to the title screen
let currentWindow = "title"; 

//variable used for holding the selected difficutly button; defaults to the easy button for easy mode
let tempButton;

//A variable used for grabbing the text field for the typing game
let textField;

//Variable to hold the score's data
let score = [];

//Render the windows
const createWindow = () =>
{
    //Search for which window we're currently on
    //Then display the appropriate info
    switch(currentWindow)
    {
        case "title":
        {
            ReactDOM.render(
                <TitleScreen />, gameScreen
            );

            break;
        }

        case "play":
        {
            ReactDOM.render(
                <GameScreen />, gameScreen
            );

            textField = document.querySelector("#textField"); //Gets textbox value
            textField.onpaste = function() {return false;}; //Disables pasting into the textbox; NO CHEATING!

            startGame(); //starts the game

            break;
        }

        case "instructions":
        {
            ReactDOM.render(
                <InstructionsScreen />, gameScreen
            );

            break;
        }

        case "options":
        {
            ReactDOM.render(
                <OptionsScreen />, gameScreen
            );

            //Selects the easy option for the game mode
            tempButton = document.querySelector(".easy");
            tempButton.className += "Active";

            
            optionArray = []; //Clears the search array
            //Add the handlers to the options menu
            setOptionHandlers();
            //Set their default values
            setDefaultOptions();

            break;
        }

        case "gameOver":
        {
            ReactDOM.render(
                <GameOverScreen />, gameScreen
            );

            showEndResults(); //Displays the message that the end-screen should have; changes based off of players' performance

            break;
        }


        case "badSearch":
            {
                ReactDOM.render(
                    <BadSearchScreen />, gameScreen
                );

                break;
            }

        //Default to the title screen
        defaut:
        {        
            ReactDOM.render(
                <TitleScreen />, gameScreen
            );

            break;
        }
    }
};


//Get / set the user's score on load
const loadScore = () =>
{
    //First get the users score
    sendAjax('GET', "/getScore", null, (data) =>
    {
        //If they don't have a score, make one for them
        if(data.Scores == "")
        {
            //Create a new blank score of 0.
            //This will recall the load-score function once the score is made
            newScore();  
        }
        else
        {
            score = data.Scores[0]; //store the score into a variable
            score.score -= 0; //Lazily cast the score value to a number

            //Display the highscore
            ReactDOM.render(<PointDisplay message={'Your Highscore:'} points={score.score}/>, 
            document.querySelector("#highScoreDiv"));
        }
    });
};

//Load the page and set off the chain of events
$(document).ready(function()
{
    //Read in the local text file containing the vocabulary
    readFile();
    //Load in the users score
    loadScore();
    //Load the window
    createWindow();
});