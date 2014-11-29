/*
	Firebase/User account Status - 
	Date: 2014-11-26

	isCloudConnected - isCloudConnected()
	isLoggedIn - isLoggedIn()
	getLoggedInStatus - getLoggedInStatus()
	readData -
	writeData - 

*/
var gMybaseRef      = new Firebase('https://user-login.firebaseio.com/');
var gFirebaseRef    = new Firebase('https://user-login.firebaseio.com/users');
// Below is our reference for our (single, logged-in) user on a mobile device or similiar.
var gUserDataRef    = null;
var gUserData       = {};
var gCloudConnected = undefined;
var gLoggedIn       = undefined;


//
// http://stackoverflow.com/questions/11351689/detect-if-firebase-connection-is-lost-regained
// NOTE: must wait until connection is made; sometimes upto a 3 seconds.
var isCloudConnected = function () {
	var connectedRef = gMybaseRef.child(".info/connected");
	connectedRef.on("value", function(snap) {
		if (snap.val() === true) {
			gCloudConnected = true;
			console.log("isCloudConnected");
		} else {
			gCloudConnected = false;
			console.log("NOT CloudConnected");
		}
	});
}

//
// https://www.firebase.com/docs/web/guide/user-auth.html#section-monitoring-authentication
// This call is asynchronous.
var isLoggedIn = function () {
	gMybaseRef.onAuth(function(authData) {
		if (authData) {
			// user authenticated with Firebase
			gUserDataRef = gFirebaseRef.child(authData.uid);
			gLoggedIn    = true;
			console.log("isLoggedIn as ID: '" + authData.uid + "', Provider: " + authData.provider);
		} else {
			gLoggedIn    = false;
			console.log("user logged out.")
		}
	});
}

//
//
// This call is synchronous.
var getLoggedInStatus = function () {
	var authData = gMybaseRef.getAuth();
	if (authData) {
		// user authenticated, specific to Firebase
		//console.log("auth: " + JSON.stringify(authData));
		// http://stackoverflow.com/questions/14963776/get-users-by-name-property-using-firebase
		// early mistake was:
		// gUserDataRef = gFirebaseRef + '/' + authData.uid;
		//
		//	NOTE: THIS IS NOT CLEAR ENOUGH. 
		//	Mainly, Firebase offers user authentication, but only dances around this answer.
		//
		gUserDataRef = gFirebaseRef.child(authData.uid);
		gLoggedIn    = true;
		//console.log("gUserDataRef:" + gUserDataRef);
		//console.log("authData", JSON.stringify(authData));
		console.log("iam:", whoami());
	} else {
		gLoggedIn    = false;
		// user is logged out
		console.log("user logged out.")
	}
	return gLoggedIn;
}

//
//	Read Data
//
var readData = function (dataRef, callback, err) {

	if (dataRef) {
		dataRef.once('value', function(datasnapshot) {
			var val = datasnapshot.hasChildren();
			if (val) {
				if ( typeof callback === 'function' ) {
					console.log("readData callback()");
					callback(datasnapshot.val());
				}
				console.log("readData has children/data." + JSON.stringify(datasnapshot.val()));
			} else {
				console.log("readData found no Data.");
			}
		});
	} else {
		console.log("readData has no reference.");
	}
}
//
//	Write some actual data
//
var writeData = function (dataRef, data, callback, err) {

	if (dataRef) {
		dataRef.set(data, function(e) {
			if (e) {
				console.log("error writeData:" + e.code);
			} else {
				console.log("data write succeed");
			}
		});
	} else {
		console.log("writeData has no reference.");
	}
}
