//Builds the File Error screen html
const FileErrorScreen = () =>
{
    return(
        <div id = "fileError">
            <div className = "menuContainer">
                    <div className = "menuBox">
                        <div className = "menuTitle">
                            <hr/>
                                <h1 className = "sceneTitle">No Text File Found!</h1>
                            <hr/>
                        </div>

                        <div id = "filErrorMessageBox">
                            <p className = "dialogueText">We're sorry, but we cannot read our text files!</p>
                            <p className = "dialogueText">Please be patient while we fix this!</p>
                            <p className = "dialogueText">Contact ncs2378@rit.edu to fix this!</p>
                        </div>
                    </div>
            </div>
        </div>
        );
};