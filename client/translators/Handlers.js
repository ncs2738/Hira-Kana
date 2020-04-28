//Handler for saving text
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

    saveTranslation("#translationForm");
};

const handleDate = (e) =>
{
        //Keep the page from refreshing
        e.preventDefault();

        saveTranslation("#dateForm");
}


const handleNumber = (e) =>
{
        //Keep the page from refreshing
        e.preventDefault();

        saveTranslation("#numberForm");
}

const saveTranslation = (form) =>
{
    //If we're not updating a prior entry...
    if(!updating)
    {
        //Send the AJAX call with the translation forms form's data
        sendAjax('POST', $(form).attr("action"), $(form).serialize(), function()
        {
            resetStates();
            loadFromServer();
        });
    }
    //we are updating another translation
    else
    {
        //Send the AJAX call with the translation forms form's data
        sendAjax('POST', "/update" + currentWindow, $(form).serialize(), function()
        {
            //We finished updating, so reset the states
            resetStates();
            //Load the translations from the server
            loadFromServer();
        });
    }
    
    //Refresh the form
    sendAjax('GET', '/getToken', null, (result) =>
    {
        createWindow(result.csrfToken)
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
        sendAjax('POST', "/delete" + currentWindow, translationID, function()
        {
            //Refresh the page after the event
            loadFromServer();
            //if we were updating, reset the updating state values.
            stopUpdating(resetStates.csrfToken);
        });
    });    
}

//Function used for getting specifically what value we clicked on to update
const loadData = (translation, list, id) =>
{
    //Set the updating state to true
    updating = true;    

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
    //Update the forms
    if(translation)
    {
        //Trim the stored text value
        textbox.value = translation.trim();
    }

    //Refresh the page's form + list
    sendAjax('GET', '/getToken', null, (result) =>
    {
        createWindow(result.csrfToken, list, removedElem[0])
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
