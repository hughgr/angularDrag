$(function () {
    $('.J_open').on('click', function () {
        $('#J_msg').modal();
    })
    $('.J_close').on('click', function () {
        $('#J_msg').modal('hide');
    })
})


var app = angular.module('app', ['ui.bootstrap']);
app.directive('myDialog', function () {
        return {
            restrict: 'E',
            template: '<div class="modal hide fade" ng-transclude></div>',
            transclude: true,
            replace: true
        }
    }
)
app.controller('dialogCtrl', ['$scope', '$modal', function ($scope, $modal) {
        $scope.util = {
            text: '使用angularUI打开'

        }
        $scope.openDialog = function () {
            $modal.open({
                templateUrl: 'dialog.html',
                resolve: {
                    util: function () {
                        return $scope.util;
                    }
                },
                controller: function ($scope, $modalInstance, util) {
                    $scope.tmp = {
                        text: ''
                    }
                    $scope.tmp = util;
                    $scope.cancelDialog = function () {
                        $modalInstance.close();
                    }
                    $scope.$watch('tmp', function () {
                        util.text = $scope.tmp.text;
                    }, true)
                }
            });
        }
        $scope.openBootDialog = function () {
            $('#J_msg').modal();
        }
    }
])
