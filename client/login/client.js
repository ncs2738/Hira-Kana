
let currentWindow = "welcome";

//Render the windows
const createWindow = (csrf) =>
{
    switch(currentWindow)
    {
        case "login":
        {
            ReactDOM.render(
                <LoginWindow csrf={csrf} />,
                document.querySelector("#content")
            );

            break;
        }

        case "signup":
        {
            ReactDOM.render(
                <SignupWindow csrf={csrf} />,
                document.querySelector("#content")
            );

            break;
        }

        case "welcome":
        {
            ReactDOM.render(
                //<WelcomeWindow csrf={csrf} />,
                <WelcomeWindow />,
                document.querySelector("#content")
            );

            break;
        }

        defaut:
        {
            ReactDOM.render(
                //<WelcomeWindow csrf={csrf} />,
                <WelcomeWindow />,
                document.querySelector("#content")
            );    

            break;
        }
    }

    //if there are any errors, clear them
    clearError();
};

//Used for loading the page
const setup = (csrf) =>
{
    //Add events to the buttons
    document.querySelector("#loginButton").addEventListener("click", (e) => {setListener(e, csrf, "login");});
    document.querySelector("#signUpButton").addEventListener("click", (e) => {setListener(e, csrf, "signup");});
    document.querySelector("#welcomeButton").addEventListener("click", (e) => {setListener(e, csrf, "welcome");});

    //Set the default screen
    //Currently, it is the welcome screen
    createWindow(csrf); 
};

function setListener(e, csrf, curWindow)
{
    e.preventDefault();
    currentWindow = curWindow;
    createWindow(csrf); 
    return false;
}

//Used for generating new CRSF tokens;
//Always called whenever we make a data-call
const getToken = () =>
{
    sendAjax('GET', '/getToken', null, (result) =>
    {
        setup(result.csrfToken);
    });
};

//When the page loads, get our first token, 
//and set off the chain of events
$(document).ready(function()
{
    getToken();
});
