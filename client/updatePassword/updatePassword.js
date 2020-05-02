//Handle our login event
const handleAccount = (e) =>
{
    //Keep the page from refreshing after sending the form
    e.preventDefault();

    //Check if all fields have been entered
    if($("#curPass").val() == '' || $("#pass").val() == '' || $("#pass2").val() == '')
    {
        handleError("All fields are required.");
        return false;
    } 

    //Check if the passwords are equivalent
    if($("#pass").val() !== $("#pass2").val())
    {
        handleError("Your new passwords don't match.");
        return false;
    }

    //Check if the old and new password match
    if($("#curpass").val() === $("#pass").val())
    {
        handleError("Your old password and new passwords match. Please enter a new password.");
        return false;
    }
    
    //Send the AJAX call with the login form's data
    sendAjax('POST', $("#passwordForm").attr("action"), $("#passwordForm").serialize(), (res) =>
    {
        //get rid of any errors
        clearError();

        //Update the Dom showing that their password has updated
        ReactDOM.render(
            <UpdateWindow />,
            document.querySelector("#content")
        );
    });

    return false;
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
