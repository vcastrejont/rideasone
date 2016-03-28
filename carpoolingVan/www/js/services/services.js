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
});
