/*
    Firebase/User account Status - 
    Date: 2014-11-26

    isCloudConnected - isCloudConnected()
    isLoggedIn - isLoggedIn()
    getLoggedInStatus - getLoggedInStatus()
    writeData - 

*/
/* Parse has no notion of JSON object relationships. These pointer won't be needed. */
var gMybaseRef   = undefined;
var gFirebaseRef = undefined;
// This reference is for our (single, logged-in) user on a mobile device or similiar.
var gUserDataRef = null;
var gUserData    = {};
var gLoggedIn    = undefined;

//
// 
// NOTE: Parse has no notion of being connected. We must check the connection status through phonegap or similar.
var isCloudConnected = function () {
}

//
// 
// This call is synchronous.
var isLoggedIn = function () {
    if (getLoggedInStatus()) {
        // user authenticated with Parse
        getUserReference(
            function(user) { 
                gUserDataRef = user[0]; 
                console.log("isLoggedIn as ID: '" + JSON.stringify(gUserDataRef)); 
            },
            function(strg) { console.log(strg); 
            }
        );
        gLoggedIn    = true;
        
    } else {
        gLoggedIn    = false;
        console.log("user logged out.")
    }

    return gLoggedIn;
}

//
//
// This call is synchronous.
var getLoggedInStatus = function () {
    var iAm = whoami();
    if (iAm === null) {
        iAm = "Not logged in.";    
        gLoggedIn = false;
    } else {
        gLoggedIn = true;
    }
    return gLoggedIn;
}

//
//    Write some actual data
//
var writeData = function (ref, data, callback, err) {
    //user = new Parse.User();
    ref.set('phone', data.phone);
    ref.save(null, {
        success : function (data) {console.log("writeData success:" + JSON.stringify(data));},
        error : function (data,err) {console.log("writeData error:" + JSON.stringify(err));}
    });

}

var readData = function (ref, callback, err) {

}

