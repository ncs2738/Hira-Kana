//Builds the game screen html
const GameScreen = () =>
{
    return(
        <div id = "game">
            <div id = "gameContainer">
                    <div className = "gameBox">
                        <div className = "container">
                            <div className = "widget">
                                    <div id = "wordContainer">
                                            <div id = "words">
                                                <h1 id = "word"></h1>
                                                <h2 id = "meaning"></h2>
                                                <h4 id = "clickText">(Click For T.T.S)</h4>
                                            </div>
                                    </div>
                            </div>
                        </div>
                
                        <div id = "timerBox">
                        </div>
                
                        <div className = "widget">
                            <div id = "textBox">
                                <input type="text" id ="textField" onInput={e=> handleInput(e)} autofocus maxlength="15"></input>
                            </div>
                        </div>
                    
                        <div id = "pointBox">
                            <div>
                                <h3 className = "wrong">Wrong</h3>
                                <h3 id = "wrongAnswers">#</h3>
                            </div>
                    

                            <div>
                                <h3 id = "pointsText">Points</h3>
                                <h3 id = "gamePoints">#</h3>
                            </div>

                            <div>
                                <h3 id = "right">Right</h3>
                                <h3 id = "rightAnswers">#</h3>
                            </div>
                        </div>
                    
                        <div id="gridContainer">
                            <div id = "grid"></div>
                        </div>
                    </div>
            </div>
        </div>
    );
};

function handleInput(e)
{
    inputHandler(e);
    answerCompare();
}