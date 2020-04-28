//HTML setup for the Text Translation form
const TranslationForm = (props) =>
{
    //if we're not updating...
    if(!updating)
    {
        //Load the standard submit formn
        return(
            <form id="translationForm" 
            name="translationForm"
            onSubmit={handleTextTranslation}
            action = "/translations"
            method="POST"
            className="translationForm"
            >
                <label htmlFor="name">Name: </label>
                <textarea id="translationText" type="text" name="translation" placeholder="Translation" rows="1" cols="50" onInput={inputHandler}></textarea>
                <input type="hidden" name="_csrf" value={props.csrf}/>
                <input className="textTranslationSubmit" type="submit" value="Save Translation"/>
            </form>
        );
    }
    //We're updating
    else
    {
        //Load the updating form
        return(
            <form id="translationForm" 
            name="translationForm"
            onSubmit={handleTextTranslation}
            action = "/translations"
            method="POST"
            className="translationForm"
            >
                <label htmlFor="name">Name: </label>
                <textarea id="translationText" type="text" name="translation" placeholder="Translation" rows="1" cols="50" onInput={inputHandler}></textarea>
                <input type="hidden" name="id" value={removedElem[0]._id}/>
                <input type="hidden" name="_csrf" value={props.csrf}/>
                <button type="button" onClick={e => stopUpdating(props.csrf)}>Cancel</button>
                <input className="textTranslationSubmit" type="submit" value="Update"/>
            </form>
        );
    }
};


//Load in the previously saved translations
const TranslationList = function(props) 
{
    //If there are no previously saved translations
    if(props.translations.length === 0)
    {
        //Return a empty list
        return (
            <div className="translationList">
                <h3 className="emptyTranslationList">There are no saved translations!</h3>
            </div>
        );
    }

    //There are saved translations, so make a map of them
    const translationNodes = props.translations.map(function(translations)
    {
        //Return a new table entry for each saved translation
        return (
            <div key={translations._id} className="translation">
                <h3 className="translationText">{translations.translation}</h3>
                <button onClick={e => deleteMe(translations._id)}>Remove</button>
                <button onClick={e => loadData(translations.translation, props.translations, translations._id)}>Update</button>
            </div>
        );
    });


    //Return the translations list
    return (
        <div className="translationList">
            {translationNodes}
        </div>
    );
};
