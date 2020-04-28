"use strict";

var currentWindow = "welcome"; //Handle our login event

var handleAccount = function handleAccount(e) {
  //Keep the page from refreshing after sending the form
  e.preventDefault();
  fieldCheck();
};

var fieldCheck = function fieldCheck() {
  if ($("#user").val() == '' || $("#pass").val() == '') {
    //handleError("Your username or password's empty bro.");
    var errorMessage = currentWindow === "login" ? "Your username or password's empty bro." : "All fields are required dude.";
    console.log(errorMessage);
    return false;
  }

  if (currentWindow === "signup") {
    //Check if the fields are empty
    if ($("#pass2").val() == '') {
      //handleError("All fields are required dude.");
      return false;
    } //Check if the passwords are equivalent


    if ($("#pass").val() !== $("#pass2").val()) {
      handleError("The passwords don't match bro.");
      return false;
    }
  }

  var curForm = "#" + currentWindow + "Form";
  console.log(curForm); //Send the AJAX call with the login form's data

  sendAjax('POST', $(curForm).attr("action"), $(curForm).serialize(), redirect);
  return false;
}; //HTML setup for the Login-form


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
      className: "welcome"
    }, /*#__PURE__*/React.createElement("h1", null, "Hello there!"), /*#__PURE__*/React.createElement("h1", null, "This is my project 2 milestone 1"), /*#__PURE__*/React.createElement("p", null, "I focused primarily getting all ready n' set up; I really focused on getting my update and delete functions going"), /*#__PURE__*/React.createElement("p", null, "I had the update calls working on the domo maker, but translating it onto this project took me hours, which is why I've sadly not much to show for this one."), /*#__PURE__*/React.createElement("p", null, "I've really only have my text translator set up, and you can get the current date. I plan on adding more to the date search later."), /*#__PURE__*/React.createElement("p", null, "My the functionality for my text translator is practically finished, and should be working without any issues."), /*#__PURE__*/React.createElement("p", null, "If I have any errors on the app, they'll be in the console. Sorry about that."), /*#__PURE__*/React.createElement("p", null, "Although I sadly don't have too much to show for this one, all of my setup's essentially done"), /*#__PURE__*/React.createElement("p", null, "Alot of this was me just learning how to set everything up + experimenting with React and figuring things out"), /*#__PURE__*/React.createElement("p", null, "My code's kinda messy but it's not the world's end, and I've got a long way to go with this."), /*#__PURE__*/React.createElement("p", null, "I hope this is enough for the milestone!"))
  );
}; //Render the windows


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

  }
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
