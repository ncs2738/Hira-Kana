//Builds the title screen html
const TitleScreen = () =>
{
    return(
        <div id = "titleScreen">
            <div className = "menuContainer">
                    <div className = "menuBox">
                        <div className = "menuTitle">
                            <hr/>
                                <h1 className = "sceneTitle">Hira- Kana</h1>
                            <hr/>
                        </div>
    
                        <div className = "widget">
                            <div className = "vButtons">
                                <span className = "vButtonSpacing"><button type="button" onClick={e => setWindow(e)} value = "play" className = "Play">• Play Game •</button></span>
                                <span className = "vButtonSpacing"><button type="button" onClick={e => setWindow(e)} value = "instructions" className = "Instructions">• Instructions •</button></span>
                                <span className = "vButtonSpacing"><button type="button" onClick={e => setWindow(e)} value = "options" className = "Options">• Game Options •</button></span>
                            </div>
                        </div>

                        <div id = "highScoreDiv"></div>
                    </div>
            </div>
        </div>
        );
};