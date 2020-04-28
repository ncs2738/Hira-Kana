"use strict";

//Handle our login event
var handleAccount = function handleAccount(e) {
  //Keep the page from refreshing after sending the form
  e.preventDefault();
  fieldCheck();
};

var fieldCheck = function fieldCheck() {
  if ($("#curPass").val() == '' || $("#pass").val() == '' || $("#pass2").val() == '') {
    //handleError("Your username or password's empty bro.");
    var errorMessage = "All fields are required dude.";
    console.log(errorMessage);
    return false;
  } //Check if the passwords are equivalent


  if ($("#pass").val() !== $("#pass2").val()) {
    handleError("The passwords don't match bro.");
    return false;
  } //Check if the old and new password match


  if ($("#curpass").val() === $("#pass").val()) {
    handleError("Please enter a actually new password.");
    return false;
  } //Send the AJAX call with the login form's data


  sendAjax('POST', $("#passwordForm").attr("action"), $("#passwordForm").serialize(), function (result) {
    ReactDOM.render( /*#__PURE__*/React.createElement(UpdateWindow, null), document.querySelector("#content"));
  });
  return false;
}; //HTML setup for the sign-up form


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
  console.log("I AM CALLED!");
  return (/*#__PURE__*/React.createElement("div", {
      className: "welcome"
    }, /*#__PURE__*/React.createElement("h1", null, "Your password has been updated!"))
  );
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

//Show our domo friend if there's an error
var handleError = function handleError(message) {
  $("#errorMessage").text(message);
  $("#domoMessage").animate({
    width: 'toggle'
  }, 350);
}; //Hide the domo-friend when they're not needed


var redirect = function redirect(response) {
  $("#domoMessage").animate({
    width: 'hide'
  }, 350);
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
