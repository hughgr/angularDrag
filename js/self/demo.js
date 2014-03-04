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
                matrix: self.transform().matrix.split(' ')
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

    },
    updateCorners: function () {
        var matrix = this.NB.attrs.matrix.join(',');
        var corners = this.NB.corners.bboxs;
        for (var i = 0; i < corners.length; i++) {
            corners[i].transform('matrix', matrix);
        }
    },
    updatePath: function () {
        var matrix = this.NB.attrs.matrix.join(',');
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
    draw = SVG('canvas').fixSubPixelOffset();
    ellipse = draw.ellipse(180, 96).attr({
            stroke: 'red',
            strokeWidth: '2',
            cx: 100,
            cy: 100,
    });
    ellipse.init();
    
})
