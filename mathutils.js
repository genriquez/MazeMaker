(function (context) {	// Select random from array
	Math.randomFromArray = function (values) {
		var index = Math.floor(Math.random() * values.length);
		return values[index];
	};
}(this));

(function (context) {	// 2D Vector class definition
	var Vector2 = context.Vector2 = function (x, y) {
		this.x = x;
		this.y = y;
	};
	
	Vector2.prototype.add = function (vector) {
		return new Vector2(this.x + vector.x, this.y + vector.y);
	};
	
	Vector2.prototype.multiply = function (scalar) {
		return new Vector2(this.x * scalar, this.y * scalar);
	};
	
	Vector2.prototype.transpose = function () {
		return new Vector2(this.y, this.x);		
	};
}(this));

(function (context) {	// 2D Matrix class definition
	var Matrix2 = context.Matrix2 = function (sizeX, sizeY) {
		var matrix = (function () {
			var grid = new Array(sizeX);
			
			var row = 0;
			for(row = 0; row < sizeY; row++) {
				grid[row] = new Array(sizeY);	
			}
			
			return grid;
		}());
		
		this.getPos = function (position) {
			return matrix[position.x][position.y];			
		};
		
		this.setPos = function (position, value) {
			matrix[position.x][position.y] = value;
		};
		
		this.isValidPos = function (position) {
			var isValid = true;
			isValid = isValid && position.x >= 0 && position.x < sizeX;
			isValid = isValid && position.y >= 0 && position.y < sizeY;
			
			return isValid;
		}
	}
}(this));
