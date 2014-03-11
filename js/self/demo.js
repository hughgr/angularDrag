//感谢伟大的数学天才！！！
$(function(){
SVG.extend(SVG.Element, {
    
    initHelper: function () {
        var self = this;
        self.NB = {
            attrs: {
                x: self.bbox().x,
                y: self.bbox().y,
                width: self.bbox().width,
                height: self.bbox().height,
                centerX: self.bbox().cx,
                centerY: self.bbox().cy,
                matrix: '1,0,0,1,0,0'
            },
            config: {
                R: 0,                 //[R]otation
                cx: self.bbox().cx,   //[C]enterX
                cy: self.bbox().cy,   //[C]enterY
                sx: 1,                //[S]caleX
                sy: 1,                //[S]caleY
                tx: 0,                //[T]ranslateX
                ty: 0                 //[T]ranslateY
            },
            corners: {
                positions: [],
                bboxs: [],
            },
            size: 5,
            helperPath: null,
            rotatePoint: null,
            rotateline: null,
            handles: {
        
            }
        }
    },
    drawCorners: function () {
        var self = this;
        var parent  = this.parent._parent(SVG.Nested) || this._parent(SVG.Doc);
        var helperBox = self.NB.attrs;
			var signs = [{ x: -1, y: -1 },
                         { x:  1, y: -1 },
                         { x:  1, y:  1 },
                         { x: -1, y:  1 }];
            for (var i = 0; i < signs.length; i++) {
                self.NB.corners.positions.push({
                    x: helperBox.centerX + signs[i].x * (helperBox.width / 2),
                    y: helperBox.centerY + signs[i].y * (helperBox.height / 2)
                })
            }
            for (var i = 0; i < self.NB.corners.positions.length; i++) {
                self.NB.corners.bboxs.push(parent.rect(self.NB.size * 2, self.NB.size * 2).attr({
                    fill: 'red',
                    x: self.NB.corners.positions[i].x - self.NB.size,
                    y: self.NB.corners.positions[i].y - self.NB.size
                }))
            }

    },
    drawRotatePoint: function () {
        var self = this;
        var parent  = this.parent._parent(SVG.Nested) || this._parent(SVG.Doc);
        self.NB.rotatePoint = parent.circle(self.NB.size * 2).attr({
            fill: 'red',
            cx: self.NB.attrs.centerX,
            cy: self.NB.attrs.centerY - self.NB.attrs.height/2 * 1.6 
        })
        var pathStr = 'M' + self.NB.rotatePoint.cx() + ',' + (self.NB.attrs.centerY - self.NB.attrs.height / 2) + 
                      'L' + self.NB.rotatePoint.cx() + ',' + self.NB.rotatePoint.cy();
            self.NB.rotateline = parent.path(pathStr).back().attr({
                stroke: '#000',
                'stroke-dasharray': '4,4',
                fill: 'transparent'

         })
    },
    
    updateCorners: function () {
        var matrix = this.NB.attrs.matrix;
        var corners = this.NB.corners.bboxs;
        var config = this.NB.config;
        for (var i = 0; i < corners.length; i++) {
            //3D模式
            /*corners[i].transform('matrix', matrix);*/
            //2D模式
            var pos = this._transformPos(matrix, corners[i].bbox().cx, corners[i].bbox().cy);
            corners[i].matrix('1,0,0,1,'+(pos.x - corners[i].bbox().cx)+','+(pos.y-corners[i].bbox().cy)).rotate(config.R)
        }
    },
    updatePath: function () {
        var matrix = this.NB.attrs.matrix;
        var path = this.NB.helperPath;
        path.transform('matrix',matrix)
    },
    updateRotatePoint: function () {
        var matrix = this.NB.attrs.matrix;
        this.NB.rotateline.matrix(matrix);
        /*this.NB.rotatePoint.matrix(matrix); */
        var rPoint = this.NB.rotatePoint;
        var pos = this._transformPos(matrix, this.NB.rotatePoint.bbox().cx,this.NB.rotatePoint.bbox().cy);
        rPoint.matrix('1,0,0,1,'+ (pos.x - rPoint.bbox().cx) + ',' + (pos.y - rPoint.bbox().cy))
        //var rLine = this.NB.rotateline;
        /*var linePos = this._transformPos(matrix, rLine.bbox().cx, rLine.bbox().cy);
        rLine.matrix('1,0,0,1,'+ (linePos.x - rLine.bbox().cx) + ',' + (linePos.y - rLine.bbox().cy)) */
    },
    drawLine: function () {
        var self = this,
        parent  = this.parent._parent(SVG.Nested) || this._parent(SVG.Doc);
        var corner = self.NB.corners.positions;
        var pathStr = 'M' + corner[0].x + ',' + corner[0].y +
            'L' + corner[1].x + ',' + corner[1].y +
            'L' + corner[2].x + ',' + corner[2].y +
            'L' + corner[3].x + ',' + corner[3].y +
            'L' + corner[0].x + ',' + corner[0].y 
        self.NB.helperPath = parent.path(pathStr).back().attr({
                stroke: '#000',
                'stroke-dasharray': '4,4',
                fill: 'transparent'
        });

    },
    destoryHelper: function () {
        var self = this.NB;
        self.helperPath = null;
    },
    updateAttr: function () {
        var self = this.NB.attrs
        self.x = this.bbox().x;
        self.y = this.bbox().y;
        self.width = this.bbox().width;
        self.height = this.bbox().height;
        self.centerX = this.bbox().cx;
        self.centerY = this.bbox().cy;
        
    },
    doDrag: function () {
        /*var matrix = this.NB.attrs.matrix;
        var self = this;
        this.dragstart = function (move) {
            console.log(move)
        };
        this.dragend = function (move, e) {
            console.log(move)
            matrix[5] = self.y() - self.height() + '';
            matrix[4] = self.x() - self.width() + '';
            self.updatePath();
            self.updateCorners();
        }*/

      var self = this;
      self.on('mousedown', start)
      var firstMoveX;
      var firstMoveY;
      var cx = self.NB.config.cx;
      var cy = self.NB.config.cy; 
      var offSetX,offSetY;
      var ts;
      function drag (event) {
          offSetX = event.pageX - firstMoveX;
          offSetY = event.pageY - firstMoveY;
          self.moveTo(cx + offSetX, cy + offSetY) 
      }
      function end (event) {
          SVG.off(window, 'mousemove', drag)
          SVG.off(window, 'mouseup',   end)
          if ( !!offSetX) {
              /*self.showHelper();*/
              cx = cx + offSetX;
              cy = cy + offSetY
          }
      }
      function start (event) {
          console.log(event)
          ts = new Date().getTime();
          //self.hideHelper();
          setTimeout(function(){
              var ts2 = new Date().getTime
              firstMoveX = event.pageX;
              firstMoveY = event.pageY; 
              SVG.on(window, 'mousemove', drag)
              SVG.on(window, 'mouseup',   end)
          
          },1)
      }
    },
    doRotate: function () {
      var rp = this.NB.rotatePoint;
      var self = this;
      var startEvent 
      rp.on('mousedown', start)
      function rotate (event) {
          var matrix = self.NB.attrs.matrix.split(',')
          var ex = event.pageX;
          var ey = event.pageY;
          var cx = self.NB.config.cx + self.NB.config.tx;
          var cy = self.NB.config.cy + self.NB.config.ty;
          if (event.shiftKey) {
              if (ex - cx >= 0 && ey - cy <= 0 ) {  //第一象限
                  self.rotateTo(90) 
              }
              else if (ex - cx >= 0 && ey - cy >= 0 ) {  //第二象限
                  self.rotateTo(180) 
              }
              else if (ex - cx <= 0 && ey - cy >= 0 ) {  //第三象限
                  self.rotateTo(270) 
              }
              else {  
                self.rotateTo(0)
              }
      
          } else {
              var matrix = self.NB.attrs.matrix.split(',')
              var cx = self.NB.config.cx + self.NB.config.tx;
              var cy = self.NB.config.cy + self.NB.config.ty;
              var raidus = Math.PI / 2 + Math.atan2(event.pageY- cy,event.pageX - cx);
              var rotation = raidus * 180 /Math.PI;
              self.rotateTo(rotation)
          }
      }
      function end (event) {
          SVG.off(window, 'mousemove', rotate)
          SVG.off(window, 'mouseup',   end)
      }
      function start (event) {
          SVG.on(window, 'mousemove', rotate)
          SVG.on(window, 'mouseup',   end)
      }
        
         
    },
    doScale: function () {
        var self = this;
        var conners = self.NB.corners.bboxs;
        var startX,startY,lastSx,lastSy;
        for (var i = 0; i < conners.length; i++) {
            conners[i].on('mousedown', start)
        }
        var i = 0;

        lastSx = Math.abs(self.NB.config.sx);
        lastSy = Math.abs(self.NB.config.sy);
        function scale (event) {
            sx = (event.pageX - startX) / (self.NB.attrs.width / 2 )
            sy = (event.pageY - startY) / (self.NB.attrs.height / 2 )
            event.shiftKey ? self.scaleTo(lastSx + sx, lastSx + sx) : self.scaleTo(lastSx + sx, lastSy + sy);
        }
        function end () {
          SVG.off(window, 'mousemove', scale)
          SVG.off(window, 'mouseup',   end)
        }
        function start (event) {
          startX = event.pageX;
          startY = event.pageY;
          lastSx = self.NB.config.sx;
          lastSy = self.NB.config.sy;
          SVG.on(window, 'mousemove', scale)
          SVG.on(window, 'mouseup',   end)
        }
         
    },
    moveTo: function (tx, ty) {
        var cfg = this.NB.config;
        //cfg.cx += tx;
        //cfg.cy += ty 
        tx = tx - this.NB.attrs.centerX;
        ty = ty - this.NB.attrs.centerY;
        cfg.tx = tx;
        cfg.ty = ty;
        this._applyMatrix();
        return this;
    },
    scaleTo: function (sx, sy) {
        var cfg = this.NB.config;
        cfg.sx = sx;
        cfg.sy = sy;
        this._applyMatrix();
        //this._scaleMatrix();

    },
    rotateTo: function (angle) {
        var cfg = this.NB.config;
        cfg.R = angle;
        this._applyMatrix();
        return this;
    },
    hideHelper: function () {
        var self = this;
        self.NB.helperPath.hide();
        self.NB.rotatePoint.hide();
        self.NB.rotateline.hide();
        for (var i = 0; i < self.NB.corners.bboxs.length; i++) {
            self.NB.corners.bboxs[i].hide();
        }
    },
    showHelper: function () {
        var self = this;
        self.NB.helperPath.show();
        self.NB.rotatePoint.show();
        self.NB.rotateline.show();
        for (var i = 0; i < self.NB.corners.bboxs.length; i++) {
            self.NB.corners.bboxs[i].show();
        }
    },
    _applyMatrix: function () {
        this._transfromToMatrix();
        this.matrix(this.NB.attrs.matrix);
        this.updateCorners();
        this.updatePath();
        this.updateRotatePoint();
        showMax();
    },
    _transfromToMatrix: function () {
        var config = this.NB.config;
        var R = config.R * ( Math.PI / 180 );
        var sin = Math.sin(R);
        var cos = Math.cos(R);
        var cx = config.cx;
        var cy = config.cy;
        var tx = config.tx;
        var ty = config.ty;
        var sx = config.sx;
        var sy = config.sy;
        this.NB.attrs.matrix = [
                 sx * cos,
                 sy * sin,
                -sx * sin,
                 sy * cos,
                 sx * (-cx * cos + cy * sin + cx) + cx - cx * sx + tx,
                 sy * (-cx * sin - cy * cos + cy) + cy - cy * sy + ty
        ].join(',')
        this.NB.attrs.matrix2 = [
                 sx * cos,
                 sy * sin,
                -sx * sin,
                 sy * cos,
                 sx * (-cx * cos + cy * sin + cx) + cx - cx * sx + tx,
                 sy * (-cx * sin - cy * cos + cy) + cy - cy * sy + ty
        ].join(',')
    },
    
    _transformPos: function (matrix, originX, originY) {
        var max = matrix.split(',');
        for (var i = 0; i < max.length; i++ ) {
            max[i] = parseFloat(max[i])
        } 
		return {
			x: max[0] * originX + max[2] * originY + max[4],
			y: max[1] * originX + max[3] * originY + max[5]
		}
	},
    _scaleMatrix: function () {
        var config = this.NB.config;
        var matrix = this.NB.attrs.matrix.split(',');
        matrix[0] = pareseFloat(matrix[0]) * config.sx
        matrix[3] = pareseFloat(matrix[3]) * config.sy
    },
    init: function () {
        var self = this;
        self.initHelper();
        self.drawCorners();
        self.drawLine();
        self.drawRotatePoint();
        self.doDrag();
        self.doRotate();
        self.doScale();
        self._applyMatrix();
        /*self.on('click', function (e) {
             console.log(e)
             self.showHelper();
             e.stopPropagation();
        });
        SVG.on(window, 'click', function () {
             self.hideHelper(); 
        })*/
    },

        //parent.rect(helperBox.width, helperBox.height).attr({
            //stroke: 'green',
            //'stroke-width': 2,
            //'stroke-dasharray': '4,4',
            //fill: 'transparent',
            //x: helperBox.x,
            //y: helperBox.y
        //})
})
/*
function NB (svgEle) {
    this.svg = svgEle;
    this.parent  = this.parent._parent(SVG.Nested) || this._parent(SVG.Doc);
    var selfBBox= svgEle.bbox;
    this.NB = {
            attrs: {
                x: selfBBox.x,
                y: selfBBox.y,
                width: selfBBox.width,
                height: selfBBox.height,
                centerX: selfBBox.cx,
                centerY: selfBBox.cy,
                matrix: svgEle.transform().matrix
            },
            corners: {
                positions: [],
                bboxs: [],
            },
            size: 5,
            helperPath: null,
            handles: {
        
            }
          }
}
NB.prototype._drawCorners = function () {
            var self = this;
            var helperBox = self.NB.attrs;
			var signs = [{ x: -1, y: -1 },
                         { x: 1, y: -1 },
                         { x: 1, y: 1 },
                         { x: -1, y: 1 }];
            for (var i = 0; i < signs.length; i++) {
                self.NB.corners.positions.push({
                    x: helperBox.centerX + signs[i].x * (helperBox.width / 2),
                    y: helperBox.centerY + signs[i].y * (helperBox.height / 2)
                })
            }
            for (var i = 0; i < self.NB.corners.positions.length; i++) {
                self.NB.corners.bboxs.push(parent.rect(self.NB.size * 2, self.NB.size * 2).attr({
                    fill: 'red',
                    x: self.NB.corners.positions[i].x - self.NB.size,
                    y: self.NB.corners.positions[i].y - self.NB.size
                }))
            }
            return self;

}
NB.prototype._drawLine = function () {
            var self = this;
            var corner = self.NB.corners.positions;
            var pathStr = 'M' + corner[0].x + ',' + corner[0].y +
                          'L' + corner[1].x + ',' + corner[1].y +
                          'L' + corner[2].x + ',' + corner[2].y +
                          'L' + corner[3].x + ',' + corner[3].y +
                          'L' + corner[0].x + ',' + corner[0].y 
               self.NB.helperPath = self.parent.path(pathStr).back().attr({
                    stroke: '#000',
                    'stroke-dasharray': '4,4',
                    fill: 'transparent'
                    });
                return self
}
                    */

    //testmatrix: '0.866025,0.500000,-0.500000,0.866025,490,348' 旋转30度
    draw = SVG('canvas').fixSubPixelOffset()
    group = draw.group();
    ellipse = draw.ellipse(100, 50).attr({
            stroke: 'red',
            strokeWidth: '2',
            cx: 100,
            cy: 200
    });
    rect = draw.rect(100, 50).attr({
            stroke: 'red',
            strokeWidth: '2',
            x: 200,
            y: 200 
    });
/*img = draw.image('http://gtms03.alicdn.com/tps/i3/T1a3XvFu8EXXX8quM7-240-101.gif').loaded(function(loader) {
    this.size(loader.width,loader.height)
})*/
    rect1 = draw.rect(100, 50).attr({
            stroke: 'transparent',
            strokeWidth: '2',
            x: 600,
            y: 100,
            fill: 'yellow'
    });
/*img.init();*/
    //ellipse.init();
    var i = 0 ;
    /*var a = setInterval(function () {
        i ++;

        ellipse.rotateTo(i * 25);
        ellipse.moveTo(i,100);
        showMax();
    }, 50)*/
    $(function () {
        group.add(ellipse).add(rect)
        group.init();
        rect1.init();
    })
    window.showMax = function () {
        var max = group.NB.attrs.matrix.split(',');
        var str = '<div>['+ max[0].slice(0,4) + ' , ' + max[2].slice(0,4) + ' , ' + max[4].slice(0,6) + ']</div>' +
                         '<div>['+ max[1].slice(0,4) + ' , ' + max[3].slice(0,4) + ' , ' + max[5].slice(0,6) + ']</div>' +                        
                         '<div>[0.0 , 0.0 , 1.0]';
        $('#max').html(str)
    }
    
})
