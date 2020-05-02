//############## USED BY THE GAME MANAGER ############## 
//Shows the current tallies
const TallyCounter = function(props)
{
    if(!props.miss)
    {
        return (<p>{props.tally}</p> );
    }
    else
    {
    return (<p>{props.wrong} / {props.miss}</p> );
    }
};

const RenderText = function(props)
{
    return (
        <div id = "words">
           <h1 id = "word">{props.text[0].trim().toString()}</h1> 
            <h2 id = "meaning">{props.text[1].trim()}</h2>
            <h4 id = "clickText">(Click For T.T.S)</h4>
        </div>
        );
}

//############## USED BY THE POINT MANAGER ############## 
//Used for updating the timer
const TimerDisplay = function(props)
{
    return (<p id ="timer">{props.time}s</p> );
};

//used for displaying a image when a right or wrong answer is entered
const ShowImage = function(props)
{
    if(props.image === "right")
    {
        return (<img id ="timer" src="assets/img/right.png"/>);
    }
    else
    {
        return (<img id ="timer" src="assets/img/wrong.png"/>);
    }
}


//############## USED BY THE GAME OVER SCREEN ############## 
//Load in the search result counts
const WordList = function(props) 
{
    const wordNodes = props.words.map(function(words, i)
    {
        return (
            <div key={i}>
                <div className = "wordMeaning">
                    {words[1]}
                </div>

                <div className = "resultsChar">
                    {words[0]}
                </div>
            </div>
            
        );
    });
   
    //Return the translations list
    return (
        <div>
            {wordNodes}
        </div>
    );
};

//Show the points and its message
const PointDisplay = function(props)
{
    return (
        <div>  
            <p className = "dialogueText">{props.message}</p>
            <p className = "totalPoints">{props.points}</p> 
        </div>
        
    );
};

//Show the results of the game
const GameResultDisplay = function(props)
{
    return (
        <div>  
            <p id = "gameResults">{props.message1}</p>
            <p id = "wrongResults">{props.message2}</p> 
        </div>
        
    );
};



//############## USED BY THE BAD SEARCH SCREEN ############## 
//Load in the search result counts
const ResultList = function(props) 
{
    const resultNodes = props.options.map(function(options, i)
    {
        //Return a new table entry for each saved translation
        return (
            <div key={i}>
                <div className = "wordMeaning">
                    {options}
                </div>

                <div className = "resultsChar">
                    {props.counts[i]}
                </div>
            </div>
            
        );
    });
   
    //Return the translations list
    return (
        <div>
            {resultNodes}
        </div>
    );
};
