//Handle our login event
const handleAccount = (e) =>
{
    //Keep the page from refreshing after sending the form
    e.preventDefault();
    fieldCheck();
}

//Check our input fields
const fieldCheck = () =>
{
    //Check if the username and password have been entered
    if($("#user").val() == '' || $("#pass").val() == '')
    {
        handleError("All fields are required.");
        return false;
    }

    //If we're on the signup page...
    if(currentWindow === "signup")
    {
        //Check if the fields are empty
        if($("#pass2").val() == '')
        {
            handleError("All fields are required.");
            return false;
        }

        //Check if the passwords are equivalent
        if($("#pass").val() !== $("#pass2").val())
        {
            handleError("Your passwords don't match.");
            return false;
        }
    }

    //get the name of the form being submitted
    const curForm = "#" + currentWindow + "Form";

    //Send the AJAX call with the login form's data
    sendAjax('POST', $(curForm).attr("action"), $(curForm).serialize(), redirect);

    return false;
}