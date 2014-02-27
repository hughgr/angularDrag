controllers.controller('indexCtrl', ['$scope', '$timeout', function ($scope, $timeout) {
    $scope.text = 'this is the text'; 
    setTimeout(function () {
        /*$scope.$apply(function () {
                $scope.text = 'refresh!!!';
        })*/
        /*angular.element('.operation').append(angular.element('<span style="color:red">1111</span>'))*/
        $scope.text = 'rrefresh at will!!!refresh at will!!!refresh at will!!!refresh at will!!!efresh at will!!!refresh at will!!!refresh at will!!!refresh at will!!!' 
        $scope.$apply();
    }, 2000)
    $scope.showAlert = function () {
        alert(1)
    }
}])
