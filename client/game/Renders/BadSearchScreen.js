//Builds the bad search screen html
//This calls when there are no results for the user's word category search
const BadSearchScreen = () =>
{
    return(
        <div id = "badSearch">
            <div className = "menuContainer">
                    <div className = "menuBox">
                        <div className = "menuTitle">
                            <hr/>
                                <h1 className = "sceneTitle">Uh Oh!</h1>
                            <hr/>
                        </div>
    
                        <p className = "dialogueText">We're sorry, but there seems to be no words fitting all of your search fields!</p>
                        <p className = "dialogueText">Please search again!</p>
                        <p className = "dialogueText">Tag Counts:</p>
    
                        <div className = "dialogueBox">
                            <div id = "errorMessageBox">
                            </div>
                        </div>
    
                        <div className = "widget">
                            <div className = "hButtons">
                                <span className = "hButtonSpacing"><button type="button" onClick={e => setWindow(e)} value = "instructions" className = "Instructions">• Instructions •</button></span>
                                <span className = "hButtonSpacing"><button type="button" onClick={e => setWindow(e)} value = "options" className = "Options">• Game Options •</button></span>
                            </div>
                        </div>
                    </div>
            </div>
        </div>
        );
};