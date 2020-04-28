//Handle our login event
const handleAccount = (e) =>
{
    //Keep the page from refreshing after sending the form
    e.preventDefault();
    fieldCheck();
}

const fieldCheck = () =>
{
    if($("#curPass").val() == '' || $("#pass").val() == '' || $("#pass2").val() == '')
    {
        //handleError("Your username or password's empty bro.");
        let errorMessage = "All fields are required dude.";
        console.log(errorMessage);
        return false;
    } 

    //Check if the passwords are equivalent
    if($("#pass").val() !== $("#pass2").val())
    {
        handleError("The passwords don't match bro.");
        return false;
    }

    //Check if the old and new password match
    if($("#curpass").val() === $("#pass").val())
    {
        handleError("Please enter a actually new password.");
        return false;
    }
    
    //Send the AJAX call with the login form's data
    sendAjax('POST', $("#passwordForm").attr("action"), $("#passwordForm").serialize(), (result) =>
    {
        ReactDOM.render(
            <UpdateWindow />,
            document.querySelector("#content")
        );
    });

    return false;
};

//HTML setup for the sign-up form
const PasswordWindow = (props) =>
{
    return(
        <form id="passwordForm" 
        name="passwordForm"
        onSubmit={handleAccount}
        action = "/updatePassword"
        method="POST"
        className="mainForm"
        >
            <label htmlFor="curPass">Current Password:</label>
            <input id="curPass" type="password" name="curPassword" placeholder="current password"/>
            <label htmlFor="pass">New Password:</label>
            <input id="pass" type="password" name="pass" placeholder="new password"/>
            <label htmlFor="pass2">Re-enter Password:</label>
            <input id="pass2" type="password" name="pass2" placeholder="retype password"/>
            <input type="hidden" name="_csrf" value={props.csrf}/>
            <input className="formSubmit" type="submit" value="Update Password"/>
        </form>
    );
};


//Shows that we updated our password
const UpdateWindow = () =>
{
    console.log("I AM CALLED!");

    return(
        <div className = "welcome">
            <h1>Your password has been updated!</h1>
        </div>
    );
};

//Used for generating new CRSF tokens;
//Always called whenever we make a data-call
const getToken = () =>
{
    sendAjax('GET', '/getToken', null, (result) =>
    {
        ReactDOM.render(
            <PasswordWindow csrf={result.csrfToken} />,
            document.querySelector("#content")
        );
    });
};

//When the page loads, get our first token, 
//and set off the chain of events
$(document).ready(function()
{
    getToken();
});
