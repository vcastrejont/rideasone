angular.module('carpoolingVan')

.factory('authFactory', function (firebaseRef, $q, usersService) {
  var isAuthenticated = false,
  session,
  localStorageSession = "firebase:session::blazing-heat-3837";

  return {
    login: function login() {
      var deferred = $q.defer(),
      ref = new Firebase(firebaseRef);

      ref.authWithOAuthPopup("google", function(error, authData) {
        if (error) {
          deferred.reject("Login Failed! " + error);
        } else {
          ref.once("value", function(snapshot) {
            if(!snapshot.child("users/" + authData.uid).exists()) {
              ref.child("users").child(authData.uid).set({
                name: authData.google.displayName,
                image: authData.google.profileImageURL
              });
            }
          });

          useCredentials(authData);
          deferred.resolve(true);
        }
      });
      return deferred.promise;
    },
    logout: function() {
      destroyUserCredentials();
    },
    isAuthenticated: function() {
      return isAuthenticated;
    },
    session: function() {
      return session;
    }
  };

  function loadUserCredentials() {
    var session = window.localStorage.getItem(localStorageSession);
    if (session) {
      useCredentials(session);
    }
  }

  function useCredentials(sessionData) {
    session = sessionData;
    isAuthenticated = true;
  }

  function destroyUserCredentials() {
    session = undefined;
    isAuthenticated = false;
    window.localStorage.removeItem(localStorageSession);
  }
});
