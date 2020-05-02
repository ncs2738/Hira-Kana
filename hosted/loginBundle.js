"use strict";

var currentWindow = "welcome"; //Render the windows

var createWindow = function createWindow(csrf) {
  switch (currentWindow) {
    case "login":
      {
        ReactDOM.render( /*#__PURE__*/React.createElement(LoginWindow, {
          csrf: csrf
        }), document.querySelector("#content"));
        break;
      }

    case "signup":
      {
        ReactDOM.render( /*#__PURE__*/React.createElement(SignupWindow, {
          csrf: csrf
        }), document.querySelector("#content"));
        break;
      }

    case "welcome":
      {
        ReactDOM.render(
        /*#__PURE__*/
        //<WelcomeWindow csrf={csrf} />,
        React.createElement(WelcomeWindow, null), document.querySelector("#content"));
        break;
      }

      defaut: {
        ReactDOM.render(
        /*#__PURE__*/
        //<WelcomeWindow csrf={csrf} />,
        React.createElement(WelcomeWindow, null), document.querySelector("#content"));
        break;
      }

  } //if there are any errors, clear them


  clearError();
}; //Used for loading the page


var setup = function setup(csrf) {
  //Add events to the buttons
  document.querySelector("#loginButton").addEventListener("click", function (e) {
    setListener(e, csrf, "login");
  });
  document.querySelector("#signUpButton").addEventListener("click", function (e) {
    setListener(e, csrf, "signup");
  });
  document.querySelector("#welcomeButton").addEventListener("click", function (e) {
    setListener(e, csrf, "welcome");
  }); //Set the default screen
  //Currently, it is the welcome screen

  createWindow(csrf);
};

function setListener(e, csrf, curWindow) {
  e.preventDefault();
  currentWindow = curWindow;
  createWindow(csrf);
  return false;
} //Used for generating new CRSF tokens;
//Always called whenever we make a data-call


var getToken = function getToken() {
  sendAjax('GET', '/getToken', null, function (result) {
    setup(result.csrfToken);
  });
}; //When the page loads, get our first token, 
//and set off the chain of events


$(document).ready(function () {
  getToken();
});
"use strict";

//Handle our login event
var handleAccount = function handleAccount(e) {
  //Keep the page from refreshing after sending the form
  e.preventDefault();
  fieldCheck();
}; //Check our input fields


var fieldCheck = function fieldCheck() {
  //Check if the username and password have been entered
  if ($("#user").val() == '' || $("#pass").val() == '') {
    handleError("All fields are required.");
    return false;
  } //If we're on the signup page...


  if (currentWindow === "signup") {
    //Check if the fields are empty
    if ($("#pass2").val() == '') {
      handleError("All fields are required.");
      return false;
    } //Check if the passwords are equivalent


    if ($("#pass").val() !== $("#pass2").val()) {
      handleError("Your passwords don't match.");
      return false;
    }
  } //get the name of the form being submitted


  var curForm = "#" + currentWindow + "Form"; //Send the AJAX call with the login form's data

  sendAjax('POST', $(curForm).attr("action"), $(curForm).serialize(), redirect);
  return false;
};
"use strict";

//HTML setup for the Login-form
var LoginWindow = function LoginWindow(props) {
  return (/*#__PURE__*/React.createElement("form", {
      id: "loginForm",
      name: "loginForm",
      onSubmit: handleAccount,
      action: "/login",
      method: "POST",
      className: "mainForm"
    }, /*#__PURE__*/React.createElement("label", {
      htmlFor: "username"
    }, "Username:"), /*#__PURE__*/React.createElement("input", {
      id: "user",
      type: "text",
      name: "username",
      placeholder: "username"
    }), /*#__PURE__*/React.createElement("label", {
      htmlFor: "pass"
    }, "Password:"), /*#__PURE__*/React.createElement("input", {
      id: "pass",
      type: "password",
      name: "pass",
      placeholder: "password"
    }), /*#__PURE__*/React.createElement("input", {
      type: "hidden",
      name: "_csrf",
      value: props.csrf
    }), /*#__PURE__*/React.createElement("input", {
      className: "formSubmit",
      type: "submit",
      value: "Sign in"
    }))
  );
}; //HTML setup for the sign-up form


var SignupWindow = function SignupWindow(props) {
  return (/*#__PURE__*/React.createElement("form", {
      id: "signupForm",
      name: "signupForm",
      onSubmit: handleAccount,
      action: "/signup",
      method: "POST",
      className: "mainForm"
    }, /*#__PURE__*/React.createElement("label", {
      htmlFor: "username"
    }, "Username:"), /*#__PURE__*/React.createElement("input", {
      id: "user",
      type: "text",
      name: "username",
      placeholder: "username"
    }), /*#__PURE__*/React.createElement("label", {
      htmlFor: "pass"
    }, "Password:"), /*#__PURE__*/React.createElement("input", {
      id: "pass",
      type: "password",
      name: "pass",
      placeholder: "password"
    }), /*#__PURE__*/React.createElement("label", {
      htmlFor: "pass2"
    }, "Password:"), /*#__PURE__*/React.createElement("input", {
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
      value: "Sign Up"
    }))
  );
}; //HTML setup for the weclome page


var WelcomeWindow = function WelcomeWindow(props) {
  return (/*#__PURE__*/React.createElement("div", {
      className: "textDisplay"
    }, /*#__PURE__*/React.createElement("h1", null, "\u3053\u3093\u306B\u3061\u306F!"), /*#__PURE__*/React.createElement("br", null), /*#__PURE__*/React.createElement("h1", null, "Welcome to Hira-Kana!"), /*#__PURE__*/React.createElement("p", null, "Hira-Kana is a premium-service web-application to help with learing Japanese!"), /*#__PURE__*/React.createElement("p", null, "The site offers multiple translators for specific needs, as well as a typing game!"), /*#__PURE__*/React.createElement("br", null), /*#__PURE__*/React.createElement("br", null), /*#__PURE__*/React.createElement("p", null, "Please sign up and log in to your account to continue onto the site!"))
  );
};
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
