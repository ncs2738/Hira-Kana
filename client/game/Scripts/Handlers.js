//Two new audio objects to be played when the player wins or loses
let won = new Audio();
won.src = "assets/audio/gameWon.mp3";
won.volume = .1;

let lost = new Audio();
lost.volume = .1;
lost.src = "assets/audio/gameLost.mp3";

//Function called for game buttons to set the direction for the next screen. 
//Parameters: click event
function setWindow(e)
{
    //The next window to be loaded will be the button's value
    currentWindow = e.target.value;
    createWindow();
}

//Function called to set the difficutly buttons' class to "(buttonName)Active". EX: .easy to .easyActive
//Parameters: click event
function setActive(e)
{
    const tmp = tempButton.className.toString(); //Temp variable used for hodling the current active button's name
    tempButton.className = tmp.replace("Active", ""); //Removes the "Active" value from the button
    tempButton = e.target; //Sets tempButton to store the new button clicked
    chosenDifficulty = e.target.className; //Set the difficulty to the target's classname
    tempButton.className += "Active"; //Set the new button to active
    setOptionArray(); //Update the options array
}

//Function called when the game has ended
function showEndScreen()
{
    currentWindow = "gameOver"; //Changes screen to the bad-search screen
    createWindow();
}

function showEndResults()
{
    if(wrongArray.length == 0) //If the player got no words wrong
    {
        won.play(); //Plays audio

        //Display their winning messages
        ReactDOM.render( 
        <GameResultDisplay 
        message1={"Woah! You're a typing All-Star!"}  
        message2={"You didn't get a single word wrong! Great Job!"} />, 
        document.querySelector("#resultsDiv")
        );
    }
    else if (wrongArray.length > 0) //If the player did get some words wrong
    {
        if(wrongArray.length == missLimit) //If the player lost
        {
            lost.play(); //Plays audio

            //Display their losing messages
            ReactDOM.render( 
            <GameResultDisplay 
            message1={"You lose! You got too many words wrong! Better luck next time!"}  
            message2={"Here are the words you got wrong:"} />, 
            document.querySelector("#resultsDiv")
            );
        }
        else //If the player got words wrong but still won
        {
            won.play(); //Plays audio

            //Display their winning messages
            ReactDOM.render( 
            <GameResultDisplay 
            message1={"Good job! You got through all the words!"}  
            message2={"Here are the words you got wrong:"} />, 
            document.querySelector("#resultsDiv")
            );
        }

        //Loop through the words gotten wrong, and append them to the end-screen message box
        ReactDOM.render( <WordList words={wrongArray} />, document.querySelector("#gameOverTextBox"));
    }

    //Update the point value
    ReactDOM.render(<PointDisplay message={'Your got:'} points={points + " points!"}/>, 
    document.querySelector("#totalPointsDiv"));

    //The user didn't get a new highscore
    if(score.score > points)
    {
        ReactDOM.render(<PointDisplay message={'Your Highscore:'} points={score.score}/>, 
        document.querySelector("#highScoreDiv"));
    }
    //The user did!
    else
    {
        updateScore(points);

        //update the screen
        ReactDOM.render(<PointDisplay message={"You got a new highscore:"} points={points}/>, 
        document.querySelector("#highScoreDiv"));
    }
}


//Used when the user does not have a score (Only calls for their first time playing)
const newScore = () =>
{
    //Get a token
    sendAjax('GET', '/getToken', null, (result) =>
    {
        //And send the request to make a new score
        sendAjax('POST', "/newScore", {_csrf: result.csrfToken}, (res) =>
        {
            //We created a new score, so load it in!
            loadScore();
        });
    });  
}

//Used when the user gets a new highscore
const updateScore= (highScore) =>
{
    sendAjax('GET', '/getToken', null, (result) =>
    {
        const newScore = 
        {
            score: highScore,
            id: score._id,
            _csrf: result.csrfToken,
        }

        //Update the score
        sendAjax('POST', "/highScore", newScore, null);
    });
};