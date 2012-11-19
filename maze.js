(function (context){
	var MazeBlock = {
		Passage: 1,
		Empty: null
	}
	
	var MazeBuilder = function(mazeMatrix) {
		var position = new Vector2(0, 0);
		var direction = new Vector2(1, 0);
		var mazeTurnPoints = [position];
		var complexity = 0.4;
		var backtracking = false;

		function hasValidNextStep(position, direction) {
			var hasValidNextStep = mazeMatrix.isValidPos(position.add(direction.multiply(2)));
			
			var passageCheckProjection = position.add(direction.multiply(2));
			hasValidNextStep = hasValidNextStep && mazeMatrix.getPos(passageCheckProjection) == MazeBlock.Empty;
			
			return hasValidNextStep;
		}
		
		function decideChangeDirection() {
			var chanceTurn = Math.random() <= complexity;
			var invalidNextStep = !hasValidNextStep(position, direction);
			
			return chanceTurn || invalidNextStep || backtracking;
		}

		function isDeadEnd() {
			var existsValidNextStep = false;
			existsValidNextStep = existsValidNextStep || hasValidNextStep(position, direction)
			existsValidNextStep = existsValidNextStep || getNewDirection() != null;
			
			return !existsValidNextStep;
		}
		
		function getNewDirection() {
			var newDirections = [direction, direction.multiply(-1), direction.transpose(), direction.transpose().multiply(-1)];
			var validDirections = [];
			
			newDirections.forEach(function (direction) {
				if (hasValidNextStep(position, direction)) {
					validDirections.push(direction);
				}
			})
			
			return Math.randomFromArray(validDirections);
		}
		
		function doBuildStep() {
			if (isDeadEnd()) {
				position = mazeTurnPoints.pop();
				backtracking = true;
				return;
			}
			
			if (decideChangeDirection()) {
				direction = getNewDirection();
				mazeTurnPoints.push(position);
			}
			
			backtracking = false;
			mazeMatrix.setPos(position.add(direction), MazeBlock.Passage);
			position = position.add(direction.multiply(2));
			mazeMatrix.setPos(position, MazeBlock.Passage);
		}
		
		this.build = function (selectedComplexity) {
			complexity = selectedComplexity || complexity;
			mazeMatrix.setPos(position, MazeBlock.Passage);
			
			while (mazeTurnPoints.length > 0) {
				doBuildStep();
			}
		}
	};

	var Maze = context.Maze = function(size) {
		var matrix = this.matrix = new Matrix2(size, size);
		
		this.initialize = function(complexity) {
			var builder = new MazeBuilder(matrix, size);
			builder.build(complexity);
		}
	};
	
}(this));