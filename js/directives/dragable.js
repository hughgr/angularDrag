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
            var str = '<select ng-model="target" ng-options="t.name for t in targets"><option value="">选择一个对象</option></select>' +
                      '<button style="color:red" ng-click="moveUp()">上移</button>' +
                      '<button style="color:red" ng-click="moveDown()">下移</button>'+
                      '<button style="color:red" ng-click="changeColor()">变色</button>'+
                      '<button style="color:red" ng-click="rotate()">旋转</button>' +
                      '<button style="color:red" ng-click="scale()">拉伸</button>' +
                      '<button style="color:red" ng-click="discale()">缩小</button>' +
                      '<button style="color:blue" ng-click="">计算原点，整体旋转</button>'
            var newNode = $(str);
            $compile(newNode)($scope);
            newNode.appendTo('#ctrl');
            /*window.draw = SVG('svg').fixSubPixelOffset();
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
            rect.draggable();*/
            /*var paper = Raphael('canvas', 600, 600);
            var circle = paper.circle(320, 240, 60).animate({fill: "#223fa3", stroke: "#000", "stroke-width": 80, "stroke-opacity": 0.5}, 2000);
            var rect = paper.rect(20,20,100,100)
            var st = paper.set(circle,rect)
            rect.drag(function (dx, dy) {
                    this.attr({
                            cx: Math.min(Math.max(x + dx, 15), 85),
                            cy: Math.min(Math.max(y + dy, 15), 85)
                        });
                }, function () {
                    x = this.attr("cx");
                    y = this.attr("cy");
                });*/
            /*SVG('rectTest').draggable();*/
            //working rotated drag'n'drop
            var time = 1000;
            var paper = new Raphael('canvas', 600, 1000);
            var r1 = paper.ellipse(100, 100, 50, 20);
            r1.attr({
                    fill: "red"
                });
            //r1.attr({fill:"green"});
            window.pos1 = paper.rect(200, 100, 50, 50).attr({
                    fill: "blue",
                    opacity: 0.5,
                    transform: "r45"
                });
            pos1.showBbox = function () {
                var paper = this.paper;
                var r1Bbox = this.getBBox();
                var matrix2 = this.matrix;
                var helper = paper.rect(0,0,r1Bbox.width,r1Bbox.height).attr({
                    stroke: 'green',
                    strokeWidth: 2
                });

            }
            var pos2 = paper.rect(200, 200, 50, 50).attr({
                    fill: "blue",
                    opacity: 0.5,
                    transform: "r45"
                }).toBack();

            var set = paper.set(pos1, r1, pos2)
            step1();
            setTimeout(function () {
                $scope.target == null && alert('选择一个对象')
            }, 5000)
            $scope.targets = [
                {name: '集合', value: set },
                {name: 'r1', value: r1},
                {name: 'pos1', value: pos1},
                {name: 'pos2', value: pos2}
            ]
            function step1() {
                r1.animate({
                        transform: "t100,0"
                    }, time, step2);
            }

            function step2() {
                r1.animate({
                        transform: "...R45"
                    }, time, step3);
            }

            function step3() {
                r1.animate({
                        transform: "...T0,100"
                    }, time, step4);
            }

            function step4() {
                r1.animate({
                        transform: "...R35"
                    }, time, step5);
            }

            function step5() {
                //alert(r1.transform());
                set.drag(drag_move, drag_start, drag_up);
            }
            var centerCmd = '';
            window.cmd = function() {
                var bBox = set.getBBox();
                var bBoxY = bBox.y + bBox.height/2;
                var bBoxX = bBox.x + bBox.width/2;
                centerCmd = ',' + bBoxX + ',' + bBoxY;
            }
            //set.transform('r0,0,0');
            var ox = null;
            var oy = null;

            function drag_start(x, y, e) {
                $('#mousePoint').val(x + '::' + y)
                $('#oPoint').val(ox + ':' + oy);
        };


        //Now here is the complicated bit


        function drag_move(dx, dy, posx, posy) {
            
             $('#oPoint').val(ox + ':' + oy);
             $('#dragOffSetPoint').val(dx + '::' + dy)
             $('#dragStartPoint').val(posx + "::" + posy);
            r1.attr({
                    fill: "#fa0"
                });
            //
            // Here's the interesting part, apply an absolute transform 
            // with the dx,dy coordinates minus the previous value for dx and dy
            //
            set.attr({
                    transform: "...T" + (dx - ox) + "," + (dy - oy)
                });
            //
            // store the previous versions of dx,dy for use in the next move call.
            //
            ox = dx;
            oy = dy;
        }


        function drag_up(e) {
            // don't forget to reset the original positions.
            ox = 0;
            oy = 0;
        }
            $scope.moveUp = function () {
                $scope.target.value.transform('...T0,-10')
            }
            $scope.moveDown = function () {
                $scope.target.value.animate({transform: '...T0,200'}, 200, '<>')
            }
            $scope.rotate = function () {
                $scope.target.value.animate({transform: '...R45'}, 200, 'elastic')
            }
            $scope.changeColor = function () {
                /*var color = '#' + (~~(Math.random() * 255)).toString(16) + (~~(Math.random() * 255)).toString(16) + (~~(Math.random() * 255)).toString(16);*/
                var color = 'rgb(' + ~~(Math.random() * 255) + ',' + ~~(Math.random() * 255) + ',' + ~~(Math.random() * 255) +')' 
                console.log(color)
                $scope.target.value.animate({fill: color}, 500);
                $('#rgb').val(color);
                /*ellipse.attr({
                    fill: color
                })*/
            }
            $scope.scale = function () {
                $scope.target.value.transform('...S2')
            }
            $scope.discale = function () {
                $scope.target.value.transform('...S0.5')
            }
        }] 
        
    }
}])
