let currentWindow = "text";
let textbox;
let removedElem;
let updating = false;

const handleTextTranslation = (e) =>
{
    //Keep the page from refreshing
    e.preventDefault();

    //Check if the user entered anything
    if(textbox.value.trim() == "")
    {
        console.log("Please enter in text to be translated.");
        //handleError("All fields are required bro.");
        return false;
    }

    //If we're not updating a prior entry...
    if(!updating)
    {
        //Send the AJAX call with the translation forms form's data
        sendAjax('POST', $("#translationForm").attr("action"), $("#translationForm").serialize(), function()
        {
            resetStates();
            loadTranslationsFromServer();
        });
    }
    //we are updating another translation
    else
    {
        //Send the AJAX call with the translation forms form's data
        sendAjax('POST', "/updateTranslation", $("#translationForm").serialize(), function()
        {
            //We finished updating, so reset the states
            resetStates();
            //Load the translations from the server
            loadTranslationsFromServer();

            //Refresh the form
            sendAjax('GET', '/getToken', null, (result) =>
            {
                createWindow(result.csrfToken)
            });
        });
    }

    return false;
};

//Handler for the date
const handleDate = (e) =>
{
    //Keep the page from refreshing
    e.preventDefault();

     //Send the AJAX call with the date form's data
     //Right now it's empty, so we send null.
     sendAjax('GET', $("#dateForm").attr("action"), null, function()
     {
        loadDateFromServer();
     });
 
     return false;
}

//Function to delete a previously saved translation
//I plan on writing this to be reusable all throught my translator
const deleteMe = (id) =>
{
    //Generate a new token
    sendAjax('GET', '/getToken', null, (result) =>
    {
        //Create a object with the specific translation's ID and the new token
        const translationID = 
        {
            id: id,
            _csrf: result.csrfToken
        }

        //Send the AJAX call to the /delete page with the translation's data
        sendAjax('POST', "/deleteTranslation", translationID, function()
        {
            //Refresh the page after the event
            loadTranslationsFromServer();
            //if we were updating, reset the updating state values.
            stopUpdating(resetStates.csrfToken);
        });
    });    
}

//Function to revert from the updating state back to the plain state.
const resetStates = () =>
{
    //Clear the textbox
    textbox.value = "";
    //Clear the stored value we were updating
    removedElem = "";
    //Reset the updating state
    updating = false;
}

//Function used for getting specifically what value we clicked on to update
const loadData = (translation, list, id) =>
{
    //Set the updating state to true
    updating = true;
    //Trim the stored text value
    textbox.value = translation.trim();

    //Variable used to get the next variable we are going to update
    //This is necessary if we are swapping through the stored values
    let newElem;

    //Loop through our list
    for(let i = list.length - 1; i >= 0; i--) 
    {
        //search for the matching id
        if(list[i]._id === id) 
        {
            //Get the new value
           newElem = list.splice(i, 1);
           //Add the old element back to the list
           if(removedElem)list.splice(i, 0, removedElem[0]);
           //Set the new value to our removed value
           removedElem = newElem;
           //Exit the loop
           break;
        }
    }

    //Refresh the page's form + list
    sendAjax('GET', '/getToken', null, (result) =>
    {
        createWindow(result.csrfToken, list)
    });    
}
  
//The user clicked the "stop updating" button after selecting a value to update
const stopUpdating = (token) =>
{
    //Reset the state
    resetStates();
    //Reload the window
    createWindow(token);
}

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
                <button onClick={e => stopUpdating(props.csrf)}>Stop Updating</button>
                <input className="textTranslationSubmit" type="submit" value="Update"/>
            </form>
        );
    }
};

//HTML setup for the Date Translation form
//This is not finished; will be updated
const DateForm = (props) =>
{
    return(
        <form id="dateForm" 
        name="dateForm"
        onSubmit={handleDate}
        action = "/getDate"
        method="GET"
        className="dateForm"
        >
            <input type="hidden" name="_csrf" value={props.csrf}/>
            <input className="dateSubmit" type="submit" value="Get Date"/>
        </form>
    );
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

//Load in the date
const DateList = function(props) 
{
    //The user hasn't searched for the date
    if(props.date.length === 0)
    {
        //Return a empty list
        return (
            <div className="translationList">
                <h3 className="emptyTranslationList">Get the date please</h3>
            </div>
        );
    }

    //For future reference
    /*
    //There are saved translations, so make a map of them
    const dateNodes = props.date.map(function(date)
    {
        //Return a new table entry for each saved translation
        return (
            <div key={translations._id} className="todaysDate">
                <h3 className="dateText">{date.date}</h3>
                <h3 className="kanjiText">{date.kanji}</h3>
                <h3 className="readingText">{date.reading}</h3>
                <h3 className="englishText">{date.english}</h3>
                <h3 className="translationText">{date.translation}</h3>
            </div>
        );
    });
    */

    //Return the date
    return (
        <div className="dateList">
             <div key={translations._id} className="todaysDate">
                <h3 className="dateText">{props.date.date}</h3>
                <h3 className="kanjiText">{props.date.kanji}</h3>
                <h3 className="readingText">{props.date.reading}</h3>
                <h3 className="englishText">{props.date.english}</h3>
                <h3 className="translationText">{props.date.translation}</h3>
            </div>
        </div>
    );
};

//Setup the page by rendering the form and list
const setup = (csrf) =>
{
    document.querySelector("#dateButton").addEventListener("click", (e) => {setListener(e, csrf, "date");});
    document.querySelector("#timeButton").addEventListener("click", (e) => {setListener(e, csrf, "text");});
    document.querySelector("#numberButton").addEventListener("click", (e) => {setListener(e, csrf, "text");});
    document.querySelector("#textButton").addEventListener("click", (e) => {setListener(e, csrf, "text");});

    createWindow(csrf);
};

//Used for adding the event listeners to the buttons
//Takes in the event, the crsf token, and what window it needs to update to
function setListener(e, csrf, curWindow)
{
    e.preventDefault();
    resetStates();
    currentWindow = curWindow;
    createWindow(csrf); 
    return false;
}


//Render the windows
const createWindow = (csrf, updateList = []) =>
{
    //Get the content we will be updating
    let form = document.querySelector("#newTranslation");
    let data = document.querySelector("#translations");

    //Search for which window we're currently on
    //Then display the appropriate info
    switch(currentWindow)
    {
        case "text":
        {
            ReactDOM.render(
                <TranslationForm csrf={csrf} />, form
            );
        
            ReactDOM.render(
                <TranslationList translations={updateList} />, data
            );

            //Set the textbox to the translation box
            textbox  = document.querySelector("#translationText");
        
            //if we're not updating...
            if(!updating)
            {
            //Load the data into the list
            loadTranslationsFromServer();
            }

            break;
        }

        case "date":
        {
            ReactDOM.render(
                <DateForm csrf={csrf} />, form
            );

            ReactDOM.render(
                <DateList date={[]} />, data
            );

            break;
        }

        //Default to the text box
        defaut:
        {
            ReactDOM.render(
                <TranslationForm csrf={csrf} />, form
            );
        
            ReactDOM.render(
                <TranslationList translations={updateList} />, data
            );

            //Set the textbox to the translation box
            textbox  = document.querySelector("#translationText");
        
            //if we're not updating...
            if(!updating)
            {
            //Load the data into the list
            loadTranslationsFromServer();
            }

            break;
        }
    }
};

//Refresh the page and show all the translations
const loadTranslationsFromServer = () =>
{
    sendAjax('GET', '/getTranslations', null, (data) =>
    {
        ReactDOM.render(
            <TranslationList translations = {data.translations} />, document.querySelector("#translations")
        );
    });
};

//Refresh the page and load in the date
const loadDateFromServer = () =>
{
    sendAjax('GET', '/getDate', null, (data) =>
    {
        ReactDOM.render(
            <DateList date = {data.date} />, document.querySelector("#translations")
        );
    });
};

//Get a new CSRF token
const getToken = () =>
{
    sendAjax('GET', '/getToken', null, (result) =>
    {
        setup(result.csrfToken);
    });
};

//Load the page and set off the chain of events
$(document).ready(function()
{
    getToken();
});