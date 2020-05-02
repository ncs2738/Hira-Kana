//Builds the game over screen html
const GameOverScreen = () =>
{
    return(
        <div id = "gameOver">
            <div className = "menuContainer">
                    <div className = "menuBox">
                        <div className = "menuTitle">
                            <hr/>
                                <h1 className = "sceneTitle">Game Over</h1>
                            <hr/>
                        </div>

                        <div id = "resultsDiv"></div>
                        
                        <div className = "dialogueBox">
                            <div id = "gameOverTextBox">
                            </div>
                        </div>

                        <div id = "totalPointsDiv"></div>
                        <div id = "highScoreDiv"></div>

                        <div className = "widget">
                            <div className = "hButtons">
                                <span className = "hButtonSpacing"><button type="button" onClick={e => setWindow(e)} value = "instructions" className = "Instructions">• Instructions •</button></span>
                                <span className = "hButtonSpacing"><button type="button" onClick={e => setWindow(e)} value = "options" className = "Options">• Game Options •</button></span>
                                <span className = "hButtonSpacing"><button type="button" onClick={e => setWindow(e)} value = "play" className = "Play">• Play Game •</button></span>
                            </div>
                        </div>
                    </div>
            </div>
        </div>
        );
};