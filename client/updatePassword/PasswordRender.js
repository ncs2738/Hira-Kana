//HTML setup for the sign-up form
const PasswordWindow = (props) =>
{
    return(
        <form id="passwordForm" 
        name="passwordForm"
        onSubmit={handleAccount}
        action = "/updatePassword"
        method="POST"
        className="mainForm"
        >
            <label htmlFor="curPass">Current Password:</label>
            <input id="curPass" type="password" name="curPassword" placeholder="current password"/>
            <label htmlFor="pass">New Password:</label>
            <input id="pass" type="password" name="pass" placeholder="new password"/>
            <label htmlFor="pass2">Re-enter Password:</label>
            <input id="pass2" type="password" name="pass2" placeholder="retype password"/>
            <input type="hidden" name="_csrf" value={props.csrf}/>
            <input className="formSubmit" type="submit" value="Update Password"/>
        </form>
    );
};

//Shows that we updated our password
const UpdateWindow = () =>
{
    return(
        <div className = "updateDisplay">
            <h1>Your password has been updated!</h1>
        </div>
    );
};