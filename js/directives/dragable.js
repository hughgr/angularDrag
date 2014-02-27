/*$(function(){
    $('.phoneContainer, .phoneContainer2').addClass('in');
    $('.operation').addClass('left-in');
    $('.phoneContainer').sortable({
        placeholder: 'helper',
        connectWith: '.phoneContainer',
        revert: false,
        revertDuration: 200
    });
    [>$('.phoneContainer2').sortable(); <]
})*/
directives.directive('dragable', ['$timeout', '$compile', function ($timeout, $compile) {
    $('.phoneContainer, .phoneContainer2').addClass('in');
    $('.operation').addClass('left-in');
    return {
        restrict: 'A',
        scope: {
            hookNode: '@hookNode'        
        },
        link: function (scope, ele, attr) {
            node = (attr.dragable == '' ? ('.' + attr.class) : ('.' + attr.dragable));
            $(node).draggable();                
        },
        controller: ['$scope', '$compile', function($scope, $compile) {
            var str = '<button style="color:red" ng-click="moveUp()">上移</button>' +
                      '<button style="color:red" ng-click="moveDown()">下移</button>'+
                      '<button style="color:red" ng-click="changeColor()">变色</button>'+
                      '<button style="color:red" ng-click="rotate()">旋转</button>' +
                      '<button style="color:red" ng-click="scale()">拉伸</button>'
            var newNode = $(str);
            $compile(newNode)($scope);
            newNode.appendTo('#ctrl');
            window.draw = SVG('svg').fixSubPixelOffset();
            draw.image('http://local.tmall.net/nb/public/123.jpg');
            var ellipse = draw.ellipse(100, 50).attr({
                stroke: 'red',
                strokeWidth: '2'
            });
            var ellipseId = ellipse.attr('id')
            var rect = draw.rect(100, 50).attr({
                fill: 'red'
            });
            rect.move(100,50)
            var group = draw.group();
            group.add(ellipse);
            group.add(rect);
            rectID = rect.attr('id');
            rect.draggable();
            /*SVG('rectTest').draggable();*/
            $scope.moveUp = function () {
                var tmp = ellipse.cy();
                ellipse.cy(tmp - 10);
            }
            $scope.moveDown = function () {
                var tmp = ellipse.cy();
                ellipse.cy(tmp + 10);
            }
            $scope.rotate = function () {
                var tmp = ellipse.trans.rotation;
                ellipse.rotate(tmp + 60)
            }
            $scope.changeColor = function () {
                var color = '#' + (~~(Math.random() * 255)).toString(16) + (~~(Math.random() * 255)).toString(16) + (~~(Math.random() * 255)).toString(16);
                console.log(color)
                ellipse.animate(200, '>', 0).attr({
                        fill: color 
                })
                /*ellipse.attr({
                    fill: color
                })*/
            }
            $scope.scale = function () {
                var tmp = ellipse.scale();
            }
        }] 
        
    }
}])
