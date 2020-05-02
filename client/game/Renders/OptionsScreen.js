//Builds the title screen html
const OptionsScreen = () =>
{
    return(
        <div id = "gameOptions">
            <div className = "menuContainer">
                    <div className = "menuBox">
                        <div className = "menuTitle">
                            <hr/>
                                <h1 id = "sceneTitle">Game Settings</h1>
                            <hr/>
                        </div>

                    <div id = "optionsContainer">
                            <div className= "optionBox">
                                    <p className = "optionText">Customize your game's difficulty!</p>
                                </div>
        
                                <div className= "optionBox">
                                    <p className = "optionTitle">Mandatory:</p>
                                    <p className = "optionText">(These are set automatically if you don't pick any of them!)</p>
                                </div>
        
                                <div className = "widget">  
                                    <div className= "optionBox">
                                        <p className= "optionText">Which alphabet would you like?</p>
                                            <select id = "Alphabet">
                                                <option value="hiragana">Hiragana</option>
                                                <option value="katakana">Katakana</option>
                                                <option value="both">Both</option>
                                            </select>
                                    </div>

                                    <div className= "optionBox">
                                        <p className= "optionText">How many misses are you allowed?</p>
                                            <select id = "missLimit">
                                                <option value="1">1</option>
                                                <option value="3">3</option>
                                                <option value="5">5</option>
                                            </select>
                                    </div>
                                    
                                    <div className= "optionBox">
                                        <p className= "optionText">How much time do you want to type?</p>
                                            <select id = "timeLimit">
                                                <option value="10">10 Seconds</option>
                                                <option value="15">15 Seconds</option>
                                                <option value="20">20 Seconds</option>
                                                <option value="30">30 Seconds</option>
                                                <option value="60">1 Minute</option>
                                            </select>
                                    </div>
                                </div>

                                <div className= "optionBox">
                                        <div className= "optionDescription">
                                                <p className = "optionTitle">Optional:</p>
                                                <p className = "optionText">These allow you to customize what kinds of words you'll be typing!</p>
                                                <p className = "optionText">(You can choose any amount! Feel free to mix and match them!)</p>
                                        </div>
                                    </div>

                                <div className = "widget">  

        
                                <div className= "optionBox">
                                        <div className= "optionDescription">
                                                <p className= "optionText">What difficulty of words would you like?</p>
                
                                                <div className = "hButtons">
                                                        <span className = "hButtonSpacing"><button type="button" onClick={e => setActive(e)} id="easyButton" value = "easy" className = "easy">• Easy! •</button></span>
                                                        <span className = "hButtonSpacing"><button type="button" onClick={e => setActive(e)} id="medButton" value = "medium" className = "medium">• Medium!! •</button></span>
                                                        <span className = "hButtonSpacing"><button type="button" onClick={e => setActive(e)} id="hardButton" value = "hard" className = "hard">• Hard!!! •</button></span>
                                                    </div>
                                        </div>
                                    </div>


                                    <div className= "optionBox">
                                            <div className= "optionDescription">
                                                    <p className= "optionText">What type of words would you like to see?</p>
                                                    <select id = "wordCategory">
                                                        <option value="any">Any</option>
                                                        <option value="verb">Verbs</option>
                                                        <option value="noun">Nouns</option>
                                                        <option value="adjective">Adjectives</option>
                                                        <option value="expression">Expressions</option>
                                                        <option value="location">Locations</option>
                                                        <option value="direction">Directions</option>
                                                        <option value="food">Food</option>
                                                        <option value="object">Objects</option>
                                                        <option value="time">Time</option>
                                                        <option value="people">People</option>
                                                        <option value="general">General</option>
                                                    </select>
                                            </div>
                                        </div>
                                        

                                        <div className= "optionBox">
                                                <div className= "optionDescription">
                                                        <p className= "optionText">Would you like to quiz yourself using Genki book chapters?</p>
                                                            <select id = "chapters">
                                                                <option value="any">Any</option>
                                                                <option value="chap1">Chapter 1</option>
                                                                <option value="chap2">Chapter 2</option>
                                                                <option value="chap3">Chapter 3</option>
                                                                <option value="chap4">Chapter 4</option>
                                                                <option value="chap5">Chapter 5</option>
                                                            </select>
                                                    </div>
                                            </div>    
                                    </div>
            
                                <div className = "widget">
                                    <div className = "hButtons">
                                        <span className = "hButtonSpacing"><button type="button" onClick={e => setWindow(e)} value = "instructions" className = "Instructions">• Instructions •</button></span>
                                        <span className = "hButtonSpacing"><button type="button" onClick={e => setWindow(e)} value = "play" className = "Play">• Play Game •</button></span>
                                    </div>
                                </div>
                            </div>
                    </div>
            </div>
    </div>
    );
};