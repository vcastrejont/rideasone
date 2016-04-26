angular.module('carpoolingVan')

.factory('authFactory', function (firebaseRef, $q, usersService) {
  var isAuthenticated = false,
  gSession,
  user,
  localStorageSession = "firebase:session::blazing-heat-3837",
  ref = new Firebase(firebaseRef);

  return {
    login: function() {
      var deferred = $q.defer();

      ref.authWithOAuthPopup("google", function(error, authData) {
        if (error) {
          deferred.reject("Login Failed! " + error);
        } else {
          saveIfDoesntExists(authData);
          useCredentials(authData).then(function(user) {
            deferred.resolve(user);
          });
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
      return gSession;
    },
    currentUser: function() {
      return user;
    }
  };

  function loadUserCredentials() {
    gSession = window.localStorage.getItem(localStorageSession);
    if (gSession) {
      useCredentials(gSession);
    }
  }

  function useCredentials(authData) {
    gSession = authData;
    isAuthenticated = true;

    return usersService.get(authData.uid).then(function(u) {
      user = u;
      return user;
    });
  }

  function destroyUserCredentials() {
    gSession = undefined;
    isAuthenticated = false;
    window.localStorage.removeItem(localStorageSession);
  }

  function saveIfDoesntExists(authData) {
    ref.once("value", function(snapshot) {
      if(!snapshot.child("users/" + authData.uid).exists()) {
        ref.child("users").child(authData.uid).set({
          name: authData.google.displayName,
          image: authData.google.profileImageURL
        });
      }
    });
  }
});
