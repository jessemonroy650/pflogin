/*
    User account maintainance - 
    Date: 2014-11-26

    login  - loginUser()
    logout - unauth()
    whoami - whoami()
    whatsmyid - whatsmyid()

    // Abstraction layer - Calls to Generic MBaas
    loginUser({loginName, loginPassword}, callback, err)
    forgotUserPassword({email}, callback, err)
    registerUserNew({email, password, firstname, lastname}, callback, err)
    settingsUserGet(settings, callback, err)
    settingsUserUpdate(settings, callback, err)
    changeUserPassword({loginName, loginPassword, newPassword}, callback, err)
    getUserReference({loginName}, callback, err)

    -------------------------------
    mycall - service Calls Required
    -------------------------------
    loginUser - 
    forgotUserPassword - 
    registerUserNew - 
    settingsUserGet() - 
    settingsUserUpdate() - 
    changeUserPassword() - 

*/
var gCredentials      = {"email": undefined, "password": undefined};
var sErrorMsgCreate   = {'EMAIL_TAKEN': "That email is in use on this system.", 'INVALID_EMAIL': "You gave me an invalid email addres."};
var sErrorMsgLogin    = {'LOGIN_FAILED': "Your login did not work. Your email or password was wrong. I don't know which is wrong."};
var sErrorMsgLostPass = {'INVALID_USER':'The specified user account does not exist.'};

// THIS IS DECLARED in the previous js file (gpsNotepad-firebase.js)
// var gFirebaseRef = new Firebase('https://gps-notepad.firebaseio.com/users');

//
function login(successParm) {
    gCredentials.email    = $('#loginUsername').val();
    gCredentials.password = $('#loginPassword').val();
    if ((gCredentials.email) && (gCredentials.password)) {
        loginUser(gCredentials, successParm);
    }
}

//
function logout() {
    Parse.User.logOut();
}

//
function whoami() {
    iAm = "";
    currentUser = Parse.User.current()
    if (currentUser != null) {
        iAm = Parse.User.current().getUsername();
    }
    return iAm;
}

// Parse has no notion of a user ID. 
function whatsmyid() {
    return undefined;
}

//
//
//
function loginUser(obj, successParm, errorParm) {

    console.log("obj" + JSON.stringify(obj));
    console.log(obj.email);
    Parse.User.logIn(obj.email, obj.password, {
        success: function(user) {
            // Do stuff after successful login.
            if ( typeof successParm === 'function' ){
                successParm(user);
            }
            console.log("Success: " + user.getUsername());
        },
        error: function(user, err) {
            if ( typeof errorParm === 'function' ){
                //errorParm(err);
            }
            // The login failed. Check error to see why.
            console.log("login user:" + user.name + "\n" + "Error: " + err.message + "\n" + "code:" + err.code);
        }
    });
}

//
function forgotUserPassword(obj, successParm, errorParm) {
    Parse.User.requestPasswordReset(obj.email, {
        success: function() {
            // Password reset request was sent successfully
            if ( typeof successParm === 'function' ) {
                successParm();
            }
            console.log("Password request sent.");
        },
        error: function(err) {
            // Show the error message somewhere
            if ( typeof errorParm === 'function' ) {
                errorParm(err);
            }
            console.log("Error: " + err.message + "\n\ncode: " + err.code );
        }
    });

}

//
function registerUserNew(obj, successParm, errorParm) {
    var user = new Parse.User();
    /* email doubles as username */
    user.set("username", obj.email);
    user.set("email", obj.email);
    user.set("password", obj.password);
     // other fields can be set just like this with Parse.Object
    /* user.set("xx", xx); */
 
    user.signUp(null, {
        success: function(user) {
            // Hooray! Let them use the app now.
            if ( typeof successParm === 'function' ) {
                successParm(true, user);
            }
            console.log("Success: " + user.getUsername());
        },
        error: function(user, err) {
            // Show the error message somewhere and let the user try again.
            if ( typeof errorParm === 'function' ) {
                errorParm(err);
            }
            console.log("Error: " + err.message + "\n\ncode: " + err.code );
        }
    });
}

//
function settingsUserGet(accountKey, successParm, errorParm) {
    var query = new Parse.Query(Parse.User);
    query.equalTo('email', accountKey);  // 
    query.find({
        success: function(settings) {
            // Do stuff
            if ( typeof successParm === 'function' ) {
                successParm(settings);
            }
            console.log("Success: " + JSON.stringify(settings));
        },
        error: function(err) {
            if ( typeof errorParm === 'function' ) {
                errorParm(err);
            }
            console.log("Error: " + err.message + "\n\ncode: " + err.code );
        }
    });
}

//
function settingsUserUpdate(obj, successParm, errorParm) {
    var query = new Parse.Query(Parse.User);
    query.equalTo('email', accountKey);  // 
    query.find({
        success: function(settings) {
            // Do stuff
            if ( typeof successParm === 'function' ) {
                successParm(settings);
            }
            console.log("Success: " + JSON.stringify(settings));
        },
        error: function(err) {
            if ( typeof errorParm === 'function' ) {
                errorParm(err);
            }
            console.log("Error: " + err.message + "\n\ncode: " + err.code );
        }
    });

}

//
function changeUserPassword(obj, success, error) {
}

//
function getUserReference(callback, errReport) {
    var query = new Parse.Query(Parse.User);
        query.equalTo('email', Parse.User.current().getUsername());  // 
        query.find({
            success: function(settings) {
                // Do stuff
                callback(settings);
            },
            error: function(error) {
                errReport("Error: " + error.code + " " + error.message);
            }
        });
}
