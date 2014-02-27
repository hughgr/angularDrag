var app = angular.module('app',['controllers', 'services', 'directives', 'filters']);
    /*config(['$routeProvider', function($routeProvider){
        when('/home/index', {templateUrl: 'homePage.html',controller: 'homePageCtrl'}).
        otherwise({redirectTo: '/home/index'});
    }])*/
var controllers = angular.module('controllers',[]);
var services = angular.module('services',[]);
var directives = angular.module('directives',[]);
var filters = angular.module('filters',[]);
