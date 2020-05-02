//Update the error message in the DOM
const handleError = (message) =>
{
    $("#errorMessage").text(message);
};

//Clear the error message in the DOM
const clearError = () =>
{
    $("#errorMessage").text("");
}

//Redirect us to a new page
const redirect = (response) =>
{
    window.location = response.redirect;
};

//Send AJAX info between our scripts
const sendAjax = (type, action, data, success) =>
{
    $.ajax({
        cache: false,
        type: type,
        url: action,
        data: data,
        dataType: "json",
        success: success,
        error: function(xhr, status, error)
        {
            var messageObj = JSON.parse(xhr.responseText);
            handleError(messageObj.error);
        }
    });
};
