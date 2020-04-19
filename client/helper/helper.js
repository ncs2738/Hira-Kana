//Show our domo friend if there's an error
const handleError = (message) =>
{
    $("#errorMessage").text(message);
    $("#domoMessage").animate({width:'toggle'},350);
};

//Hide the domo-friend when they're not needed
const redirect = (response) =>
{
    $("#domoMessage").animate({width:'hide'}, 350);
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
