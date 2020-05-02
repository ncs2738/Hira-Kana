let currentWindow = "Text";
let textbox;
let removedElem;
let updating = false;

//Get the content we will be updating
let input = document.querySelector("#translationInput");
let output = document.querySelector("#translationOutput");
let savedData = document.querySelector("#savedTranslations");

//Setup the page by rendering the form and list
const setup = (csrf) =>
{
    document.querySelector("#dateButton").addEventListener("click", (e) => {setListener(e, csrf, "Date");});
    document.querySelector("#numberButton").addEventListener("click", (e) => {setListener(e, csrf, "Number");});
    document.querySelector("#textButton").addEventListener("click", (e) => {setListener(e, csrf, "Text");});

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
const createWindow = (csrf, updateList = [], updateOutput = []) =>
{
    //Search for which window we're currently on
    //Then display the appropriate info
    switch(currentWindow)
    {
        case "Text":
        {
            input.innerHTML = "";

            ReactDOM.render(
                <TranslationForm csrf={csrf} />, output
            );
        
            ReactDOM.render(
                <TranslationList translations={updateList} />, savedData
            );

            //Set the textbox to the translation box
            textbox  = document.querySelector("#translationText");

            break;
        }

        case "Date":
        {
            ReactDOM.render(
                <DateForm />, input
            );

            ReactDOM.render(
                <DateOutput date={updateOutput} csrf={csrf} />, output
            );

            ReactDOM.render(
                <DateList dates = {updateList} />, savedData
            );

            document.querySelector("#dateInput").value = today.toJSON().slice(0,10);

            break;
        }

        case "Number":
            {
                ReactDOM.render(
                    <NumberForm csrf={csrf} />, input
                );
    
                ReactDOM.render(
                    <NumberOutput number={updateOutput} csrf={csrf} />, output
                );
    
                ReactDOM.render(
                    <NumberList numbers = {updateList} />, savedData
                );

               //Set the textbox to the number box
                textbox  = document.querySelector("#numberInput");
    
                break;
            }

        //Default to the text box
        defaut:
        {
            ReactDOM.render(
                <TranslationForm csrf={csrf} />, output
            );
        
            ReactDOM.render(
                <TranslationList translations={updateList} />, savedData
            );

            //Set the textbox to the translation box
            textbox  = document.querySelector("#translationText");
        
            //if we're not updating...
            if(!updating)
            {
            //Load the data into the list
            loadFromServer();
            }

            textbox  = document.querySelector("#translationText");

            break;
        }
    }

    //if we're not updating...
    if(!updating)
    {
    //Load the data into the list
    loadFromServer();
    }

    clearError();
};


//Refresh the page and show all the translations
const loadFromServer = () =>
{
    let direct = "/get" + currentWindow;
    sendAjax('GET', direct, null, (data) =>
    {
        switch(direct)
        {
            case '/getText': 
            {
                ReactDOM.render(
                    <TranslationList translations = {data.translations} />, savedData
                );
    
                break;
            }
    
            case '/getDate':
            {
                ReactDOM.render(
                    <DateList dates = {data.dates} />, savedData
                );
                break;
            }

            case '/getNumber':
            {
                ReactDOM.render(
                    <NumberList numbers = {data.numbers} />, savedData
                );
                break;
            }
        } 
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