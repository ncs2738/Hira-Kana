    //Creates audio variables to be played if the user enters the answer correctly or incorrectly
    let wrongSound = new Audio();
    wrongSound.src = "assets/audio/wrong.mp3";
    wrongSound.volume = .25;

    let rightSound = new Audio();
    rightSound.src = "assets/audio/right.mp3";
    rightSound.volume = .25;

    let time;
    let timerSource;
    let result;
    let timer;

    //Funciton to create a count-down timer to be displayed on screen
    //Parameters: Time limit (This is chosen by the user)
    function setTimer(timeAmount)
    {
        time = timeAmount; //sets the time to the time limit chosen by user 
        timerSource = document.querySelector("#timerBox"); //Gets the timer element
        ReactDOM.render( <TimerDisplay time={time} />, timerSource ); //Render the timer
        result = false; //Resets true/false value to see if the user answered correctly or not
        timer = setInterval(() =>  //Sets new interval timer
        { countDown(); }, 1000);
    }

    // Updates the timer count down every second
    function countDown()
    {
        time -= 1; //Deducts from the time amount
        ReactDOM.render( <TimerDisplay time={time} />, timerSource ); //Render the timer
    
        if (time < 0) //If the countdown finishes, this means the user failed to answer correctly
        {
        ReactDOM.render( <ShowImage image={"wrong"} />, timerSource );  //Display a red-x where the timer was
        wrongSound.play(); //Play wrong answer sound
        result = false; //Set the result to false; the user answered wrong
        stopTimer(); //Stop the timer
        endCheck(); //Check to see if it's game overr
        }
    }

    //Called by game-manager. Called when the user answers correctly
    function rightAnswer() 
    {
        ReactDOM.render( <ShowImage image={"right"} />, timerSource ); //Show a green circle where the timer was
        rightSound.play(); //Play a right asnwer sound
        result = true; //Set the result to true; the user answered right
        stopTimer(); //Stop the timer
    }

    //Stops the timer. The timer only stops when the user answers right / fails to answer
    function stopTimer()
    {
        clearInterval(timer); //Clears the timer interval
        addPoints(); //Adds or deducts points
    }

    //Calculates how many points the user earned by their difficulties and how fast they typed
    //Parameters: total miss limit, total time limit
    function getPoints(misses, totalTime)
    {
        let timeBonus = 60/( (totalTime + 1) - time); //Gets a time bonus calculated from the remaining time and the total time limit chosen. A lower the limit means more points.
        let pointValue = Math.ceil(5 / misses) * (timeBonus/totalTime) * (10 * misses); //Gets a overall point value from the time bonus and the total miss limit chosen. 
        pointValue = Math.ceil(pointValue); //Gets a flat value for the points
        return pointValue;
    }