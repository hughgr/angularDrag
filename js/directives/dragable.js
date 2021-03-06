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
                var str = '<select ng-model="target" ng-change="showBBox(target)" ng-options="t.name for t in targets" ><option value="">选择一个对象</option></select>' +
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
            var time = 100;
            var paper = new Raphael('canvas', 600, 1000);
            var r1 = paper.ellipse(100, 100, 50, 20);
            var helper = null;
            r1.attr({
                    fill: "red"
                });
            //r1.attr({fill:"green"});
            window.pos1 = paper.rect(200, 100, 50, 50).attr({
                    fill: "blue",
                    opacity: 0.5,
                    transform: "r45"
                });
            $scope.showBBox = function (r) {
                var bBox = r.value.getBBox(true);
                var bBoxNew = r.value.getBBox();
                helper = paper.rect(bBox.x, bBox.y, bBox.width, bBox.height).attr({
                    stroke: 'black',
                    strokeWidth: 10,
                    transform: r.value.matrix.toTransformString()
                })
            }
            var pos2 = paper.rect(200, 200, 50, 50).attr({
                    fill: "blue",
                    opacity: 0.5,
                    transform: "r45"
                }).toBack();

            var set = paper.set(pos1, r1, pos2)
            step1();
            /*setTimeout(function () {
                $scope.target == null && alert('选择一个对象')
            }, 5000)*/
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
                helper.hide();
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
            $scope.target.value.attr({
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
            $scope.showBBox($scope.target)
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
    var cir = paper.ellipse(40,40,20, 40).attr({
            "fill": "green",
            "stroke": "red" // border color of the rectangle 
            });
    /*window.newcir = cir.clone().attr({ "fill": "yellow" }).transform("t100,100R30S1.5"); 
    var bbox = newcir.getBBox();
    var bboxOld = newcir.getBBox(true); //我们通过获得的包围盒来绘制包裹圆的矩形 
    var helper = paper.rect(bboxOld.x, bboxOld.y, bboxOld.width, bboxOld.height).attr({ "stroke": "black","stroke-width":3 });
    helper.attr({transform: newcir.matrix.toTransformString()})
   
    paper.rect(bboxOld.x, bboxOld.y, bboxOld.width, bboxOld.height).attr({ "stroke": "purple" })*/
                
       
Raphael.fn.nbTransform = function(subject, options, callback) {
    var paper = this;
    var bbox = subject.getBBox(true);
    var nb = subject.nbTransform = {
		attrs: {
			x: bbox.x,
			y: bbox.y,
			size: { width: bbox.width, height: bbox.height },
			center: { x: bbox.x + bbox.width  / 2, y: bbox.y + bbox.height / 2 },
			rotate: 0,
			scale: { x: 1, y: 1 },
			translate: { x: 0, y: 0 },
			ratio: 1, //按比例
            matrix: subject.matrix
			},
        bbox: null,
        opts: {
			attrs: { fill: '#F00', stroke: '#000' }, //helper point的颜色
            size: 5,
            distance: 1.6
        },
        handles: {
            bbox: [],
            rPoint: null,
            line: null
        },
        items: []
    }
	if ( !Array.prototype.hasOwnProperty('map') ) {
		Array.prototype.map = function(callback, arg) {
			var i, mapped = [];

			for ( i in this ) {
				if ( this.hasOwnProperty(i) ) { mapped[i] = callback.call(arg, this[i], i, this); }
			}

			return mapped;
		};
	}

	function transformPos(matrix, pos) {
		return {
			x: matrix.a * pos.x + matrix.c * pos.y + matrix.e,
			y: matrix.b * pos.x + matrix.d * pos.y + matrix.f
		}
	}
    nb.showHelper = function () {
        nb.handles.line = paper.path([ 'M', nb.attrs.center.x, nb.attrs.center.y ])
    			        .attr({
                           stroke: nb.opts.attrs.stroke,
                           'stroke-dasharray': '- '
				         });
        nb.handles.rPoint = paper
				.circle(nb.attrs.center.x, nb.attrs.center.y, nb.opts.size)
				.attr(nb.opts.attrs);

        nb.helperBBox = paper
				.path('')
				.attr({
					stroke: nb.opts.attrs.stroke,
					'stroke-dasharray': '- ',
					opacity: .5
					});

            nb.handles.bbox = [];
        for (var i = 0; i < 8; i++) {
            var handle = {};
            handle.axis     = i % 2 ? 'x' : 'y';
            handle.isCorner = i < 4; //是否是4个角，scale以这个为圆心

            handle.element = paper
            .rect(nb.attrs.center.x, nb.attrs.center.y, nb.opts.size * 2, nb.opts.size * 2)
            .attr(nb.opts.attrs) ;

            nb.handles.bbox[i] = handle;
        }

			/*nb.handles.center.disc = paper
				.circle(nb.attrs.center.x, nb.attrs.center.y, nb.opts.size.center)
				.attr(nb.opts.attrs)
				;*/
        nb.updateHelper(); 
    }
    nb.updateHelper = function () {
        var corners = getBBox();
        var rad = nb.attrs.rotate * Math.PI / 180;
        var radius = nb.attrs.size.width / 2 * nb.attrs.scale.x; 
        var cx = nb.attrs.center.x + nb.attrs.translate.x + radius * nb.opts.distance * Math.cos(rad);
        var cy = nb.attrs.center.y + nb.attrs.translate.y + radius * nb.opts.distance * Math.sin(rad);
        nb.handles.rPoint.attr({
            cx: cx,
            cy: cy
        })
        nb.handles.line.toFront().attr({
            path: [ [ 'M', nb.attrs.center.x + nb.attrs.translate.x + nb.attrs.size.width / 2, nb.attrs.center.y + nb.attrs.translate.y ], [ 'L', nb.handles.rPoint.attrs.cx, nb.handles.rPoint.attrs.cy ] ]
        });
		if ( nb.helperBBox ) {
			nb.helperBBox.toFront().attr({
				path: [
					[ 'M', corners[0].x, corners[0].y ],
					[ 'L', corners[1].x, corners[1].y ],
					[ 'L', corners[2].x, corners[2].y ],
					[ 'L', corners[3].x, corners[3].y ],
					[ 'L', corners[0].x, corners[0].y ]
					]
				});
        }
        var bboxHandleDirection = [
            [ -1, -1 ], [ 1, -1 ], [ 1, 1 ], [ -1, 1 ],
            [  0, -1 ], [ 1,  0 ], [ 0, 1 ], [ -1, 0 ]
        ];

        if ( nb.handles.bbox ) {
            nb.handles.bbox.map(function (handle, i) {
                    var cx, cy, j, k;

                    if ( handle.isCorner ) {
                        cx = corners[i].x;
                        cy = corners[i].y;
                    } else {
                        j  = i % 4;
                        k  = ( j + 1 ) % corners.length;
                        cx = ( corners[j].x + corners[k].x ) / 2;
                        cy = ( corners[j].y + corners[k].y ) / 2;
                    }

                    handle.element.toFront()
                    .attr({
                            x: cx - (nb.opts.size),
                            y: cy - (nb.opts.size)
                        })
                    .transform('R' + nb.attrs.rotate);

                    handle.x = bboxHandleDirection[i][0];
                    handle.y = bboxHandleDirection[i][1];
                });
        }
            
    }
    
	function getBBox() {
		var rad = {  //弧度，弧度=角度*PI /180
			x: ( nb.attrs.rotate      ) * Math.PI / 180,
			y: ( nb.attrs.rotate + 90 ) * Math.PI / 180
			};

		var radius = {
			x: nb.attrs.size.width / 2 * nb.attrs.scale.x,
			y: nb.attrs.size.height / 2 * nb.attrs.scale.y
			};

		var
			corners = [],
			signs   = [ { x: -1, y: -1 }, { x: 1, y: -1 }, { x: 1, y: 1 }, { x: -1, y: 1 } ]
			;

		signs.map(function(sign) {
			corners.push({
				x: ( nb.attrs.center.x + nb.attrs.translate.x + sign.x * radius.x * Math.cos(rad.x) ) + sign.y * radius.y * Math.cos(rad.y),
				y: ( nb.attrs.center.y + nb.attrs.translate.y + sign.x * radius.x * Math.sin(rad.x) ) + sign.y * radius.y * Math.sin(rad.y)
				});
            /*
				x: ( nb.attrs.center.x + nb.attrs.translate.x + sign.x * radius.x * Math.cos(rad.x) ),
                y: ( nb.attrs.center.y + nb.attrs.translate.y + sign.y * radius.y * Math.sin(rad.y) )
                */
		});

		return corners;
	}
    nb.init = function () {
        nb.showHelper();
    }();

    return nb;
    
}


window.img = paper.ellipse(100 ,200,50,100 ).attr({fill: 'yellow'});
window.rect = paper.rect(300,300,50, 50).attr({fill: 'yellow'});
window.set1 = paper.set(img,rect)
                /*paper.freeTransform(img);
                paper.freeTransform(rect)*/
                window.nb = paper.freeTransform(set1);
                //window.nb = paper.nbTransform(img);
        }] 
        
    }
}])
