//HTML setup for the Login-form
const LoginWindow = (props) =>
{
    return(
        <form id="loginForm" 
        name="loginForm"
        onSubmit={handleLogin}
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