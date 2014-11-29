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
	// not DONE below here //
	settingsUserGet(settings, callback, err)
	settingsUserUpdate(settings, callback, err)
	changeUserPassword({loginName, loginPassword, newPassword}, callback, err)

    -------------------------------
	mycall - service Calls Required
    -------------------------------
	loginUser - authWithPassword()
	forgotUserPassword - resetPassword()
	registerUserNew - detectCollision() && createUser() && authWithPassword() && settingsUserUpdate()
	settingsUserGet() - whatsmyid()
	settingsUserUpdate() - whatsmyid()
	changeUserPassword() -  whatsmyid(), changePassword()

*/
var gCredentials      = {"email": undefined, "password": undefined};
var sErrorMsgCreate   = {'EMAIL_TAKEN': "That email is in use on this system.", 'INVALID_EMAIL': "You gave me an invalid email addres."};
var sErrorMsgLogin    = {'LOGIN_FAILED': "Your login did not work. Your email or password was wrong. I don't know which is wrong."};
var sErrorMsgLostPass = {'INVALID_USER':'The specified user account does not exist.'};

// THIS IS DECLARED in the previous js file (gpsNotepad-firebase.js)
// var gFirebaseRef = new Firebase('https://gps-notepad.firebaseio.com/users');

//
function login(callback) {
	gCredentials.email    = $('#loginUsername').val();
	gCredentials.password = $('#loginPassword').val();
	if ((gCredentials.email) && (gCredentials.password)) {
		loginUser(gCredentials, callback);
	}
}

//
function logout() {
	gFirebaseRef.unauth();
}

//
function whoami() {
	iAm = "";
	authData = gMybaseRef.getAuth();
	if (authData) {
		iAm = JSON.stringify(authData.password.email);
	}
	return iAm;
}

//
function whatsmyid() {
	myId = '';
	authData = gMybaseRef.getAuth();
	if (! authData) {
		myId = JSON.stringify(authData.uid);
	}
	return iAm;
}

//
//
//
function loginUser(obj, success, error) {

	credentials = {"email": obj.email, "password": obj.password};

	// Log me in
	gFirebaseRef.authWithPassword(credentials, function(err, authData) {
		if (! err) {
			if ( typeof success === 'function' ) {
				success(authData);
			}
			console.log('Authenticated successfully with payload:', JSON.stringify(authData));
		} else {
			if ( typeof error === 'function' ) {
				//error(err);
			}
			console.log('Login Failed: ' + "err.code", JSON.stringify(err.code));
			console.log(sErrorMsgLogin[err.code]);
		}
	});
}

//
function forgotUserPassword(obj, success, error) {
	var creds = {'email':obj.email}
	gMybaseRef.resetPassword(creds, function(err) {
		if (! err){
			if ( typeof success === 'function' ) {
				//success(authData);
			}
			console.log("email away.");
		} else {
			if ( typeof error === 'function' ) {
				//error(err);
			}
			console.log("err.code", JSON.stringify(err.code));
			console.log(sErrorMsgLostPass[err.code]);
		}		
	});
}

//
function registerUserNew(obj, success, error) {

	credentials = {"email": obj.email, "password": obj.password};
	console.log("credentials", credentials);

	// detectCollision()
	// Firebase: Detecting if data exists. This snippet detects if a user ID is already taken
	// https://gist.github.com/anantn/4323949

	// Firebase.createUser() 
	// https://www.firebase.com/docs/web/api/firebase/createuser.html
	gFirebaseRef.createUser(credentials, function(err) {
		if (! err) {
			console.log('createUser() succeeded.');
			loginUser(credentials, function(payload) {
				// payload.uid payload.provider payload.auth payload.expires
				console.log('Create account and Login successfully with payload:', payload);
				writeData(gUserDataRef, {'email': obj.email, 'phone': obj.phone});
				//settingsUserUpdate()
			}, function(err) {
				console.log("Error with authWithPassword, which should not happen.");
			});
		} else {
			console.log('createUser() Failed!', err);
			if ('function' === typeof error) {
				error(err.code);
			}
		}
	});
}

//
function settingsUserGet(obj, success, error) {
/*
	some_function(parms, function(err) {
		if (! err){
			if ( typeof success === 'function' ) {
				success();
			}
			console("settingsUserGet() success");
		} else {
			if ( typeof error === 'function' ) {
				//error(err);
			}
			console("error settingsUserGet()");
			error(err.code);
		}
	});
*/
}

//
function settingsUserUpdate(obj, success, error) {
/*
	some_function(parms, function(err) {
		if (! err){
			if ( typeof success === 'function' ) {
				success();
			}
			console("settingsUserUpdate() success");
		} else {
			if ( typeof error === 'function' ) {
				//error(err);
			}
			console("error settingsUserUpdate()");
			error(err.code);
		}
	});
*/
}

//
function changeUserPassword(obj, success, error) {
/*
	some_function(parms, function(err) {
		if (! err){
			if ( typeof success === 'function' ) {
				success();
			}
			console("changeUserPassword() success");
		} else {
			if ( typeof error === 'function' ) {
				//error(err);
			}
			console("error changeUserPassword()");
			error(err.code);
		}
	});
*/
}


