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
            rotateline: null
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
            cy: self.NB.attrs.centerY - self.NB.attrs.height/2 * 1.3 
        })
    },
    drawRotateLine: function () {
        var self = this;
        var matrix = self.NB.attrs.matrix;
        var parent  = this.parent._parent(SVG.Nested) || this._parent(SVG.Doc);
        var lineCx = (self.NB.corners.positions[1].x + self.NB.corners.positions[0].x) / 2;
        var lineCy = (self.NB.corners.positions[1].y + self.NB.corners.positions[0].y) / 2;
        var pos = self._transformPos(matrix, self.NB.rotatePoint.cx(), self.NB.rotatePoint.cy());

        var pathStr = 'M' + lineCx + ',' + lineCy + 
                      'L' + pos.x + ',' + pos.y;
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
            this.NB.corners.positions[i].x = pos.x
            this.NB.corners.positions[i].y = pos.y
            corners[i].matrix('1,0,0,1,'+(pos.x - corners[i].bbox().cx)+','+(pos.y-corners[i].bbox().cy)).rotate(config.R)
        }
    },
    updatePath: function () {
        /*var matrix = this.NB.attrs.matrix;
        var path = this.NB.helperPath;
        path.transform('matrix',matrix)*/
        this.NB.helperPath.remove();
        this.drawLine();
    },
    updateRotatePoint: function () {
        var matrix = this.NB.attrs.matrix;
        /*this.NB.rotateline.matrix(matrix);*/
        /*this.NB.rotatePoint.matrix(matrix); */
        var rPoint = this.NB.rotatePoint;
        var pos = this._transformPos(matrix, this.NB.rotatePoint.bbox().cx,this.NB.rotatePoint.bbox().cy);
        rPoint.matrix('1,0,0,1,'+ (pos.x - rPoint.bbox().cx) + ',' + (pos.y - rPoint.bbox().cy))
        //var rLine = this.NB.rotateline;

        /*var linePos = this._transformPos(matrix, rLine.bbox().cx, rLine.bbox().cy);
        rLine.matrix('1,0,0,1,'+ (linePos.x - rLine.bbox().cx) + ',' + (linePos.y - rLine.bbox().cy)) */
    },
    updateRotateLine: function () {
        this.NB.rotateline.remove();
        this.drawRotateLine();
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
                fill: 'transparent',
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
        this.updateRotateLine();
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
        self.drawRotateLine();
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

    path1 = draw.path().attr({
            d: 'M41.216,35.998l-27.236,37.9c0,0,0.57,0.123,12.693-0.822c3.869,12.295,3.765,12.648,3.765,12.648  l27.237-37.9L41.216,35.998z M36.994,46.865l27.236,37.9c0,0-0.104-0.354,3.766-12.648c12.123,0.943,12.691,0.822,12.691,0.822  l-27.236-37.9L36.994,46.865z',
           fill: '#d81624'
    })
    path2 = draw.path().attr({
            d: 'M73.833,31.092c-0.653-2.456-0.381-5.297-1.625-7.447c-1.263-2.179-3.869-3.356-5.642-5.126    c-1.771-1.769-2.942-4.377-5.127-5.64c-2.146-1.243-4.987-0.97-7.44-1.626c-2.375-0.634-4.69-2.309-7.264-2.309    c-2.571,0-4.891,1.675-7.262,2.309c-2.455,0.656-5.296,0.383-7.444,1.626c-2.181,1.262-3.357,3.87-5.126,5.64    c-1.771,1.769-4.379,2.947-5.641,5.126c-1.243,2.149-0.97,4.99-1.625,7.444c-0.636,2.373-2.312,4.69-2.312,7.262    c0,2.571,1.676,4.89,2.312,7.26c0.653,2.455,0.382,5.297,1.625,7.445c1.262,2.182,3.87,3.355,5.639,5.127    c1.771,1.771,2.947,4.379,5.127,5.639c2.149,1.244,4.99,0.975,7.445,1.629c2.372,0.635,4.688,2.311,7.262,2.311    c2.572,0,4.891-1.676,7.264-2.311c2.453-0.656,5.295-0.385,7.44-1.625c2.183-1.264,3.356-3.869,5.127-5.643    c1.771-1.77,4.377-2.945,5.642-5.127c1.244-2.146,0.972-4.99,1.625-7.443c0.635-2.373,2.312-4.69,2.312-7.262    C76.145,35.779,74.468,33.461,73.833,31.092z',
            fill: '#ed1c24'
    })
    path3 = draw.path().attr({
            d: 'M0.6875 9.125q1.5-2.625 2.375-6.0625 1.5625 0.1875 2.1875 0.4375 0.0625 0.0625-0.25 0.6875-0.25 0.5-0.4375 0.9375h2.1875v1.625h-2.875q-0.0625 0.125-0.1875 0.4375-0.1875 0.5-0.375 0.75h3.25v1.625h-1.6875v1.25h2.125v1.625h-2.1875v1.9375q0.4375-0.25 1.25-0.75 0.4375-0.3125 0.6875-0.4375 0.1875 1.3125 0.3125 1.8125-1.9375 1.0625-3.1875 2.0625-0.3125 0.25-0.375 0.25-0.25-0.125-1.125-1.75 0-0.0625 0.125-0.1875 0.4375-0.5625 0.4375-1.125v-1.8125h-2v-1.625h2v-1.3125h-0.4375q-0.1875 0.375-0.4375 0.75-0.4375-0.4375-1.0625-0.9375-0.1875-0.125-0.3125-0.1875zM7 4.5625q0.75-0.25 1.8125-0.75 0.8125 1.4375 1.1875 2.5625-0.625 0.25-1.75 0.6875-0.4375-1.0625-1.25-2.5zM7.5625 17.5625v-9.9375h2.625v-4.4375h0.375q1.8125-0.0625 1.75 0.25 0 0.0625-0.0625 0.375-0.125 0.5625-0.125 1v2.8125h2.5625v8.5q0.5625 1.625-3 1.5625-0.1875-0.8125-0.625-1.9375 1.8125 0.1875 1.5-0.625v-0.75h-3.125v3.1875h-1.875zM12.5625 10.3125v-1.125h-3.125v1.125h3.125zM12.5625 11.6875h-3.125v1.1875h3.125v-1.1875zM12.3125 6.5625q0.8125-1.3125 1.375-2.6875 0.75 0.3125 1.8125 0.75 0 0.0625-0.1875 0.3125-0.1875 0.1875-0.3125 0.375-0.875 1.5-1.125 2-0.875-0.375-1.5625-0.75z M19.125 7.5625v-4.125h10.125v4.125h-10.125zM27.1875 4.6875h-6.125v0.4375h6.125v-0.4375zM27.25 6.5625v-0.4375h-6.1875v0.4375h6.1875zM16.8125 9.25v-1.25h14.5v1.25h-14.5zM19.0625 9.6875h10.1875v4.1875h-4.125v0.5625h4.625v1.125h-4.625v0.4375h5.8125v1.1875h-13.625v-1.1875h5.8125v-0.4375h-4.5625v-1.125h4.5625v-0.5625h-4.0625v-4.1875zM23.125 11.3125v-0.5625h-2.1875v0.5625h2.1875zM27.3125 10.75h-2.1875v0.5625h2.1875v-0.5625zM27.3125 12.8125v-0.5h-2.1875v0.5h2.1875zM20.9375 12.3125v0.5h2.1875v-0.5h-2.1875z',
            fill:'#FFFFFF'
        }).transform({
            x: 29.1963,
            y: 17.021,
            rotation: 0,
            scaleX: 1,
            scaleY: 1
        })
    path4 = draw.path().attr({
            d: 'M0.5 7.8125q1.9375-2.3125 2.5625-4.875 2.125 0.375 2.25 0.4375 0.0625 0.0625-0.125 0.375-0.1875 0.25-0.25 0.375 2.5 1.6875 2.6875 1.9375-0.375 0.375-1 1.125l-0.3125 0.375q-0.5-0.75-2.1875-2-1.4375 2.375-2.6875 3.9375-0.25-0.875-0.9375-1.6875zM7 5.4375v-1.625h8.125v1.625h-3.1875q-0.0625 0.25-0.1875 0.8125l-0.1875 0.5625h3.0625v7.25h-1.9375v-5.6875h-3.3125v5.6875h-2v-7.3125h2.3125l0.3125-1.3125h-3zM10.0625 9.375v-0.1875q-0.125-0.5 0.375-0.375h0.625q0.9375-0.0625 1 0.125 0.125 0.125 0.0625 0.5625-0.125 0.625-0.125 1.25 0 1.5625-0.3125 2.9375 1.9375 1.0625 3.625 2.3125-0.75 0.75-1.375 1.5625-0.75-0.75-2.875-2.3125-1.375 1.625-3.625 2.5625-0.6875-0.875-1.3125-1.5 2.75-1 3.3125-2.1875 0.75-1.0625 0.625-4.75zM4.875 17.125q-1.625-1.9375-3.5625-3.3125l1.125-1.25q0.125 0 1 0.625 0.25 0.1875 0.375 0.3125 0.75-1.6875 0.6875-2.0625h-3.125v-1.5625h5.4375q-0.375 1.8125-1.625 4.6875 0.875 0.75 1.25 1.25zM4.9375 7.0625q0.4375 1.3125 0.625 2.1875l-1.875 0.5q-0.3125-1.5-0.625-2.1875z M22.125 3.875q0.0625 0.0625-0.375 0.6875-0.375 0.5625-0.5625 0.9375h1.9375v-2.5625h0.625q1.75 0 1.6875 0.125 0.0625 0.125-0.0625 0.5-0.125 0.4375-0.125 0.6875v1.25h4.125v1.6875h-4.125v2.0625h5.8125v1.6875h-4.75v3.875q0 0.625 0.625 0.625h1.1875q1.25 0.25 1.1875-2 1.125 0.5625 2.1875 0.8125 0.0625 3.1875-2.3125 2.9375h-3.125q-1.8125 0-1.8125-1.5625v-4.6875h-1q0.0625 5-4.6875 6.75l-1.3125-1.5625q3.9375-1.25 3.9375-5.1875h-4.0625v-1.6875h6v-2.0625h-2.75q-0.3125 0.6875-0.875 1.4375-0.9375-0.4375-1.8125-0.6875 1.6875-2.375 2.1875-4.5625 0.0625 0 0.3125 0.0625 1.9375 0.3125 1.9375 0.4375z',
            fill: '#FFFFFF',
    }).transform({
            x: 29.1963,
            y: 36.8433,
            rotation: 0,
            scaleX: 1,
            scaleY: 1
        })

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
        /*group.add(ellipse).add(rect)*/
        group.add(path1).add(path2).add(path3).add(path4);
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
