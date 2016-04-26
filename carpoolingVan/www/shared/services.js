angular.module('carpoolingVan')

.factory("dateService", function($filter) {
  return {
    format: format
  };

  function format(date, strFormat) {
    var _date,
      _strFormat;

    if(date && angular.isDate(date)) {
       _date = date;
    }
    else {
      _date = new Date();
    }

    if(strFormat && angular.isString(strFormat)) {
       _strFormat = strFormat;
    }
    else {
      _strFormat = "";
    }

    return $filter('date')(_date, _strFormat);
  }
})

.factory("popupService", function($ionicPopup) {

  return {
    showConfirm: showConfirm,
    showPrompt: showPrompt,
    showAlert: showAlert
  };

  function showConfirm(title, template, onConfirm, onCancel) {
    var confirmPopup = $ionicPopup.confirm({
      title: title,
      template: template
    });

   confirmPopup.then(function(res) {
     if(res) {
       if(onConfirm && angular.isFunction(onConfirm)) {
         onConfirm();
       }
       else {
         alert("No action performed");
       }
     } else {
       if(onCancel && angular.isFunction(onCancel)) {
         onCancel();
       }
     }
   });
 }

  function showPrompt(title, template, callback) {
     var promptPopup = $ionicPopup.prompt({
       title: title,
       template: template
     });

    promptPopup.then(function(str) {
      if(str) {
        if(callback && angular.isFunction(callback)) {
          callback(str);
        }
        else {
          alert("No action performed");
        }
      }
    });
  }

  function showAlert(title, template, callback) {
    var promptPopup = $ionicPopup.alert({
      title: title,
      template: template
    });

    if(callback && angular.isFunction(callback)) {
      callback();
    }
  }
});
