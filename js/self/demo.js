$(function(){
SVG.extend(SVG.Element, {
    
    showHelper: function () {
        var self = this,
        parent  = this.parent._parent(SVG.Nested) || this._parent(SVG.Doc);
        self.NB = {
            attrs: {
                x: self.bbox().x,
                y: self.bbox().y,
                width: self.bbox().width,
                height: self.bbox().height,
                centerX: self.bbox().cx,
                centerY: self.bbox().cy,
                matrix: self.transform().matrix
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
        var helperBox = self.NB.attrs;
        function _drawCorners () {
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
            _drawLine();
        }
        function _drawLine () {
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
        }
        _drawCorners();

        function doMatrix(_a, _b) {
            return {
                a:_a.a * _b.a + _a.c * _b.b,
                b:_a.b * _b.a + _a.d * _b.b,
                c:_a.a * _b.c + _a.c * _b.d,
                d:_a.b * _b.c + _a.d * _b.d,
                e:_a.a * _b.e + _a.c * _b.f + _a.e,
                f:_a.b * _b.e + _a.d * _b.f + _a.f
            };
        }
        function transformPos(matrix, pos) {
            return {
                x: matrix.a * pos.x + matrix.c * pos.y + matrix.e,
                y: matrix.b * pos.x + matrix.d * pos.y + matrix.f
            }
        }
        //parent.rect(helperBox.width, helperBox.height).attr({
            //stroke: 'green',
            //'stroke-width': 2,
            //'stroke-dasharray': '4,4',
            //fill: 'transparent',
            //x: helperBox.x,
            //y: helperBox.y
        //})
    }
})
    draw = SVG('canvas').fixSubPixelOffset();
    ellipse = draw.ellipse(100, 50).attr({
            stroke: 'red',
            strokeWidth: '2',
            cx: 100,
            cy: 100,
    });
    ellipse.draggable();
    
})
