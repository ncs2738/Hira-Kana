
let currentWindow = "welcome";

//Handle our login event
const handleAccount = (e) =>
{
    //Keep the page from refreshing after sending the form
    e.preventDefault();
    fieldCheck();
}

const fieldCheck = () =>
{
    if($("#user").val() == '' || $("#pass").val() == '')
    {
        //handleError("Your username or password's empty bro.");
        let errorMessage = (currentWindow === "login" 
        ? "Your username or password's empty bro." : 
        "All fields are required dude.");
        console.log(errorMessage);
        return false;
    }

    if(currentWindow === "signup")
    {
        //Check if the fields are empty
        if($("#pass2").val() == '')
        {
            //handleError("All fields are required dude.");
            return false;
        }

        //Check if the passwords are equivalent
        if($("#pass").val() !== $("#pass2").val())
        {
            handleError("The passwords don't match bro.");
            return false;
        }
    }

    let curForm = "#" + currentWindow + "Form";
    console.log(curForm);

    //Send the AJAX call with the login form's data
    sendAjax('POST', $(curForm).attr("action"), $(curForm).serialize(), redirect);

    return false;
}

//HTML setup for the Login-form
const LoginWindow = (props) =>
{
    return(
        <form id="loginForm" 
        name="loginForm"
        onSubmit={handleAccount}
        action = "/login"
        method="POST"
        className="mainForm"
        >
            <label htmlFor="username">Username:</label>
            <input id="user" type="text" name="username" placeholder="username"/>
            <label htmlFor="pass">Password:</label>
            <input id="pass" type="password" name="pass" placeholder="password"/>
            <input type="hidden" name="_csrf" value={props.csrf}/>
            <input className="formSubmit" type="submit" value="Sign in"/>
        </form>
    );
};

//HTML setup for the sign-up form
const SignupWindow = (props) =>
{
    return(
        <form id="signupForm" 
        name="signupForm"
        onSubmit={handleAccount}
        action = "/signup"
        method="POST"
        className="mainForm"
        >
            <label htmlFor="username">Username:</label>
            <input id="user" type="text" name="username" placeholder="username"/>
            <label htmlFor="pass">Password:</label>
            <input id="pass" type="password" name="pass" placeholder="password"/>
            <label htmlFor="pass2">Password:</label>
            <input id="pass2" type="password" name="pass2" placeholder="retype password"/>
            <input type="hidden" name="_csrf" value={props.csrf}/>
            <input className="formSubmit" type="submit" value="Sign Up"/>
        </form>
    );
};

//HTML setup for the weclome page
const WelcomeWindow = (props) =>
{
    return(
        <div className = "welcome">
            <h1>Hello there again!</h1>
            <h1>This is my project 2 milestone 2</h1>
            <p>I sadly got sick alot of days this week and had a ton of other classes to deal with</p>
            <p>So once again there's not much to show for this one, and it's kind of rather disheartening</p>
            <p>I have 3/4 of my translators' functionality completely done and I've got my password update going too.</p>
            <p>I have essentially no CSS at all though to my site yet, so it's still looking rather rough.</p>
            <p>I'm gonna pretty up this page alot, and get somewhere to show my actual errors for the final submission</p>
            <p>And I'm going to try to get my game added to the site too</p>
            <p>I don't think I'll have the time nor energy to get the kanji search added though.</p>
            <p>It's uh... got external API calls and I don't think I'll have enough time nor energy to handle that</p>
        </div>
    );
};

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
