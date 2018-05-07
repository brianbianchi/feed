(function (angular) {
  'use strict';

  // not best practice if this wasn't a static app
  angular
    .module('feedApp')
    .config(function ($sceDelegateProvider) {
      $sceDelegateProvider.resourceUrlWhitelist(['**']);
    });

})(angular);