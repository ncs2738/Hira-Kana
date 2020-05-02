"use strict";

//HTML setup for the sign-up form
var PasswordWindow = function PasswordWindow(props) {
  return (/*#__PURE__*/React.createElement("form", {
      id: "passwordForm",
      name: "passwordForm",
      onSubmit: handleAccount,
      action: "/updatePassword",
      method: "POST",
      className: "mainForm"
    }, /*#__PURE__*/React.createElement("label", {
      htmlFor: "curPass"
    }, "Current Password:"), /*#__PURE__*/React.createElement("input", {
      id: "curPass",
      type: "password",
      name: "curPassword",
      placeholder: "current password"
    }), /*#__PURE__*/React.createElement("label", {
      htmlFor: "pass"
    }, "New Password:"), /*#__PURE__*/React.createElement("input", {
      id: "pass",
      type: "password",
      name: "pass",
      placeholder: "new password"
    }), /*#__PURE__*/React.createElement("label", {
      htmlFor: "pass2"
    }, "Re-enter Password:"), /*#__PURE__*/React.createElement("input", {
      id: "pass2",
      type: "password",
      name: "pass2",
      placeholder: "retype password"
    }), /*#__PURE__*/React.createElement("input", {
      type: "hidden",
      name: "_csrf",
      value: props.csrf
    }), /*#__PURE__*/React.createElement("input", {
      className: "formSubmit",
      type: "submit",
      value: "Update Password"
    }))
  );
}; //Shows that we updated our password


var UpdateWindow = function UpdateWindow() {
  return (/*#__PURE__*/React.createElement("div", {
      className: "updateDisplay"
    }, /*#__PURE__*/React.createElement("h1", null, "Your password has been updated!"))
  );
};
"use strict";

//Handle our login event
var handleAccount = function handleAccount(e) {
  //Keep the page from refreshing after sending the form
  e.preventDefault(); //Check if all fields have been entered

  if ($("#curPass").val() == '' || $("#pass").val() == '' || $("#pass2").val() == '') {
    handleError("All fields are required.");
    return false;
  } //Check if the passwords are equivalent


  if ($("#pass").val() !== $("#pass2").val()) {
    handleError("Your new passwords don't match.");
    return false;
  } //Check if the old and new password match


  if ($("#curpass").val() === $("#pass").val()) {
    handleError("Your old password and new passwords match. Please enter a new password.");
    return false;
  } //Send the AJAX call with the login form's data


  sendAjax('POST', $("#passwordForm").attr("action"), $("#passwordForm").serialize(), function (res) {
    //get rid of any errors
    clearError(); //Update the Dom showing that their password has updated

    ReactDOM.render( /*#__PURE__*/React.createElement(UpdateWindow, null), document.querySelector("#content"));
  });
  return false;
}; //Used for generating new CRSF tokens;
//Always called whenever we make a data-call


var getToken = function getToken() {
  sendAjax('GET', '/getToken', null, function (result) {
    ReactDOM.render( /*#__PURE__*/React.createElement(PasswordWindow, {
      csrf: result.csrfToken
    }), document.querySelector("#content"));
  });
}; //When the page loads, get our first token, 
//and set off the chain of events


$(document).ready(function () {
  getToken();
});
"use strict";

//Update the error message in the DOM
var handleError = function handleError(message) {
  $("#errorMessage").text(message);
}; //Clear the error message in the DOM


var clearError = function clearError() {
  $("#errorMessage").text("");
}; //Redirect us to a new page


var redirect = function redirect(response) {
  window.location = response.redirect;
}; //Send AJAX info between our scripts


var sendAjax = function sendAjax(type, action, data, success) {
  $.ajax({
    cache: false,
    type: type,
    url: action,
    data: data,
    dataType: "json",
    success: success,
    error: function error(xhr, status, _error) {
      var messageObj = JSON.parse(xhr.responseText);
      handleError(messageObj.error);
    }
  });
};
