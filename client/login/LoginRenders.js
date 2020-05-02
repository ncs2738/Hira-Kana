
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
        <div className = "textDisplay">
            <h1>こんにちは!</h1>
            <br/>
            <h1>Welcome to Hira-Kana!</h1>
            <p>Hira-Kana is a premium-service web-application to help with learing Japanese!</p>
            <p>The site offers multiple translators for specific needs, as well as a typing game!</p>
            <br/>
            <br/>
            <p>Please sign up and log in to your account to continue onto the site!</p>
        </div>
    );
};