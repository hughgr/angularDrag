//感谢伟大的数学天才！！！
$(function(){
SVG.extend(SVG.Element, {
    
    showHelper: function () {
        var self = this;
        self.NB = {
            attrs: {
                x: self.bbox().x,
                y: self.bbox().y,
                width: self.bbox().width,
                height: self.bbox().height,
                centerX: self.bbox().cx,
                centerY: self.bbox().cy,
                matrix: [1,0,0,1,0,0]
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
    updateCorners: function () {
        var matrix = this.NB.attrs.matrix;
        var corners = this.NB.corners.bboxs;
        for (var i = 0; i < corners.length; i++) {
            corners[i].transform('matrix', matrix);
        }
    },
    updatePath: function () {
        var matrix = this.NB.attrs.matrix;
        var path = this.NB.helperPath;
        path.transform('matrix',matrix)
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
    doDrag: function () {
        var matrix = this.NB.attrs.matrix;
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
        }
        this.draggable();
    },
    moveTo: function (tx, ty) {
        var cfg = this.NB.config;
        /*cfg.cx += tx;
        cfg.cy += ty */
        tx = tx - this.NB.attrs.centerX;
        ty = ty - this.NB.attrs.centerY;
        cfg.tx = tx;
        cfg.ty = ty;
        this._applyMatrix();
    },
    scaleTo: function (sx, sy, cx, cy) {
        var cfg = this.NB.config;
        cfg.sx = sx;
        cfg.sy = sy;
        this._applyMatrix();
    },
    rotateTo: function (angle) {
        var cfg = this.NB.config;
        cfg.R = angle;
        this._applyMatrix();
    },
    _applyMatrix: function () {
        this._transfromToMatrix();
        this.matrix(this.NB.attrs.matrix);
        this.updateCorners();
        this.updatePath();
    },
    _transfromToMatrix: function () {
        var config = this.NB.config;
        config.R = config.R * ( Math.PI / 180 );
        var sin = Math.sin(config.R);
        var cos = Math.cos(config.R);
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
                 sx * (-cx * cos + cy * sin + cx) + tx,
                 sy * (-cx * sin - cy * cos + cy) + ty
        ].join(',')
    },
    init: function () {
        var self = this;
        self.showHelper();
        self.drawCorners();
        self.drawLine();
        self.doDrag();
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
    draw = SVG('canvas').fixSubPixelOffset();
    ellipse = draw.ellipse(100, 50).attr({
            stroke: 'red',
            strokeWidth: '2',
            cx: 100,
            cy: 100,
    });
    ellipse.init();
    var i = 0 ;
    var a = setInterval(function () {
        i ++;

        ellipse.rotateTo(i * 25);
        ellipse.moveTo(i,100);
        showMax();
    }, 50)
    window.showMax = function () {
        var max = ellipse.NB.attrs.matrix.split(',');
        var str = '<div>['+ max[0].slice(0,4) + ' , ' + max[2].slice(0,4) + ' , ' + max[4].slice(0,6) + ']</div>' +
                         '<div>['+ max[1].slice(0,4) + ' , ' + max[3].slice(0,4) + ' , ' + max[5].slice(0,6) + ']</div>' +                        
                         '<div>[0.0 , 0.0 , 1.0]';
        $('#max').html(str)
    }
    
})
