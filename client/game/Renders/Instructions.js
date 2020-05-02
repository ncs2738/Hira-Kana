//Builds the instruction screen html
const InstructionsScreen = () =>
{
    return(
        <div id = "instructions">
            <div className = "menuContainer">
                    <div className = "menuBox">
                        <div className = "menuTitle">
                            <hr/>
                                <h1 className = "sceneTitle">Instructions</h1>
                            <hr/>
                        </div>

                        <div id = "instructionBox">
                                <p>Type out the word displayed on screen into the text box!</p>
                                <p>Type in lowercase for hiragana characters, and in uppercasse for katakana characters.</p>                  
                                <p>Type in '-' for dashes, '.' for small tsu, and '_' for small katakana vowels.</p>
                                <p>Click on the word displayed to play a text to speech recording of it!</p>
                                <p>Valid keystroke inputs: <br/>
                                    a, e, i, o, u, k, s, t, n, h, <br/>
                                    m, y, r, w, g, z, d, b, p, '.', <br/>
                                    '_', '-', and v (for katakana only)
                                </p>
                        </div>

                        <div className = "widget">
                            <div className = "hButtons">
                                <span className = "hButtonSpacing"><button type="button" onClick={e => setWindow(e)} value = "options" className = "Options">• Game Options •</button></span>
                                <span className = "hButtonSpacing"><button type="button" onClick={e => setWindow(e)} value = "play" className = "Play">• Play Game •</button></span>
                            </div>
                        </div>
                    </div>
            </div>
        </div>
    );
};