var calendar = angular.module('Calendar', ['ui.calendar']);

calendar.config(
      ['$routeProvider', function($routeProvider){
      $routeProvider.
         when('/showCal', {
            templateUrl: 'partials/cal.htm',
            controller: 'CalController'
         }).
         when('/login', {
            templateUrl: 'partials/login.htm',
            controller: 'LoginController'
         }).
         otherwise({
            redirectTo: '/login'});
}]);