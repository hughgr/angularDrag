(function(env) {

	var ns = "http://www.w3.org/2000/svg";
	var basesvg = document.createElementNS(ns, "svg");
	var MATRIX = {
		a: 1,
		b: 0,
		c: 0,
		d: 1,
		e: 0,
		f: 0
	};

	function transformPos(matrix, pos) {
		return {
			x: matrix.a * pos.x + matrix.c * pos.y + matrix.e,
			y: matrix.b * pos.x + matrix.d * pos.y + matrix.f
		}
	}
	function matrix3(_a, _b) {
		return {
			a:_a.a * _b.a + _a.c * _b.b,
			b:_a.b * _b.a + _a.d * _b.b,
			c:_a.a * _b.c + _a.c * _b.d,
			d:_a.b * _b.c + _a.d * _b.d,
			e:_a.a * _b.e + _a.c * _b.f + _a.e,
			f:_a.b * _b.e + _a.d * _b.f + _a.f
		};
	}
	function createSVGTransform() {
		return basesvg.createSVGTransform();
	}
	function tansformAngle(angle){
		return angle - parseInt(angle / 360) * 360;
	}
	function Ntm(node) {
		if (typeof node == "string") {
			node = document.getElementById(node);
		}
		var tfmList = node.transform.baseVal;
		var bbox = node.getBBox();
		var bboxOriginCenter = {
			x:bbox.x + bbox.width/2,
			y:bbox.y + bbox.height/2
		}
		var ntm =  {
			node:node,
			insertTranslate:function(x,y){
				var transform = createSVGTransform();
				transform.setTranslate(x,y);
				tfmList.insertItemBefore(transform, 0);
				return this;
			},
			insertRotate:function(angle,x,y){
				var transform = createSVGTransform();
				transform.setRotate(angle, x, y);
				tfmList.insertItemBefore(transform, 0);
				return this;
			},
			insertScale:function(scaleX,scaleY){
				var transform = createSVGTransform();
				transform.setScale(scaleX, scaleY);
				tfmList.insertItemBefore(transform, 0);
				return this;
			},
			appendScale:function(scaleX,scaleY){
				var transform = createSVGTransform();
				transform.setScale(scaleX, scaleY);
				tfmList.appendItem(transform);
				return this;
			},
			mergeRST:function(){
				var rst = this.getRST();
				var num = tfmList.numberOfItems;
		        for (var i = 0; i <num ; i++) {
		        	tfmList.removeItem(0);
		        }
		       	this.insertScale(rst.scaleX,rst.scaleY)
		       		.insertRotate(rst.rotate,bboxOriginCenter.x*rst.scaleX,bboxOriginCenter.y*rst.scaleY)
		       		.insertTranslate(rst.translateX,rst.translateY);
		        return this;
			},
			getBBoxCenter: function() {
				var num = tfmList.numberOfItems;
				var matrix = this.getRST().matrix;
                var point = transformPos(matrix,bboxOriginCenter);
                return point;
			},
			translate: function(x, y) {
				this.insertTranslate(x,y);
				this.mergeRST();
				return this;
			},
			rotate: function(angle) {
				this.insertRotate(angle,0,0);
				this.mergeRST();
				return this;
			},
			translateByPoints:function(pos,newPos){
				var rst = this.getRST();
				var matrix = rst.matrix;
				var point = transformPos(matrix,pos);
				this.translate(newPos.x-point.x,newPos.y-point.y);
				return this;
			},
			scale: function(scaleX, scaleY) {
				this.appendScale(scaleX,scaleY)				
				this.mergeRST();
				return this;
			},
			getRotate:function(){
				var rst = this.getRST();
				return rst.rotate;
			},
			getScale:function(){
				var rst = this.getRST();
				return {
					scaleX:rst.scaleX,
					scaleY:rst.scaleY
				};
			},
			getTranslate:function(){
				var rst = this.getRST();
				return {
					x:rst.translateX,
					y:rst.translateY
				}
			},
			translateTo:function(x,y){
				this.mergeRST();
				tfmList.removeItem(0);
				this.translate(x,y);
				return this;
			},
			rotateTo:function(angle){
				this.mergeRST();
				tfmList.removeItem(1);
				this.rotate(angle);
				return this;
			},
			scaleTo:function(scaleX,scaleY){
				this.mergeRST();
				tfmList.removeItem(2);
				this.scale(scaleX,scaleY);
				return this;
			},
			getRST:function(){
				var num = tfmList.numberOfItems;
				var matrix = MATRIX;
				var R = 0;
				var SX = 1;
				var SY = 1;
				var TX = 0;
				var TY = 0;
		        for (var i = 0; i < num; i++) {
		        	var item = tfmList.getItem(i);
		            matrix = matrix3(matrix, item.matrix);
		           	switch(item.type){
		           		case 2:
		           			TX += item.matrix.e;
		            		TY += item.matrix.f;
		           			break;
		           		case 3:
		           			SX *= item.matrix.a;
		            		SY *= item.matrix.d;
		           			break;
		           		case 4:
		           			R += item.angle;
		           			break;
		           		default:
		           			break;
		           	}
		        }
		        R = tansformAngle(R);
		        return {
		        	rotate:R,
		        	scaleX:SX,
		        	scaleY:SY,
		        	translateX:TX,
		        	translateY:TY,
		        	matrix:matrix
		        };
			},
			getTransformPoint:function(point){
				var rst = this.getRST();
				var matrix = rst.matrix;
				return transformPos(matrix,point);
			},
			centerTo:function(x,y){
				this.translateByPoints(bboxOriginCenter,{
					x:x,
					y:y
				});
				return this;
			},
			getBBoxOriginCenter:function(){
				return bboxOriginCenter;
			}
		};
		node.Ntm = ntm;
		return ntm;
	}

	env.Ntm = Ntm;

})(this);
