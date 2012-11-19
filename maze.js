(function (context){
	var MazeBlock = {
		Passage: 1,
		Empty: null
	}
	
	var MazeBuilder = function(mazeMatrix) {
		var position = new Vector2(0, 0);
		var direction = new Vector2(1, 0);
		var mazeTurnPoints = [position];
		var turnRatio = 0.1;

		function hasValidNextStep(currentPosition, currentDirection) {
			currentPosition = currentPosition || position;
			currentDirection = currentDirection || direction;
			
			var hasValidNextStep = mazeMatrix.isValidPos(currentPosition.add(currentDirection.multiply(2)));
			
			var passageCheckProjection = currentPosition.add(currentDirection.multiply(2));
			hasValidNextStep = hasValidNextStep && mazeMatrix.getPos(passageCheckProjection) == MazeBlock.Empty;
			
			return hasValidNextStep;
		}
		
		function decideDeadEnd() {
			var posibleDirections = [];
			posibleDirections.push(direction);
			posibleDirections.push(direction.transpose());
			posibleDirections.push(direction.transpose().multiply(-1));
								  
			var existsValidNextStep = false;
			posibleDirections.forEach(function (direction) {
				existsValidNextStep = existsValidNextStep || hasValidNextStep(position, direction);	
			})
			
			return !existsValidNextStep;
		}
		
		function decideTurn() {
			// Turn decision variables
			var chanceTurn = Math.random() <= turnRatio;
			var invalidNextStep = !hasValidNextStep();
			
			return chanceTurn || invalidNextStep;
		}
		
		function getNewDirection() {
			var newDirections = [direction.transpose(), direction.transpose().multiply(-1)];
			var validDirections = [];
			
			newDirections.forEach(function (direction) {
				if (hasValidNextStep(position, direction)) {
					validDirections.push(direction);
				}
			})
			
			return Math.randomFromArray(validDirections);
		}
		
		function doBuildStep() {
			if (decideDeadEnd()) {
				position = mazeTurnPoints.pop();
				return;
			}
			
			if (decideTurn()) {
				var newDirection = getNewDirection();
				
				if (newDirection != null) {
					mazeTurnPoints.push(position);
					direction = newDirection;
				}
			}
			
			mazeMatrix.setPos(position.add(direction), MazeBlock.Passage);
			position = position.add(direction.multiply(2));
			mazeMatrix.setPos(position, MazeBlock.Passage);
		}
		
		this.build = function () {	
			mazeMatrix.setPos(position, MazeBlock.Passage);
			
			while (mazeTurnPoints.length > 0) {
				doBuildStep();
			}
		}
	};

	var Maze = context.Maze = function(size) {
		var matrix = this.matrix = new Matrix2(size, size);
		
		this.initialize = function() {
			var builder = new MazeBuilder(matrix, size);
			builder.build();
		}
	};
	
}(this));