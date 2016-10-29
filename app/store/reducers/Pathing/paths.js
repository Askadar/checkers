export default function findPaths(table, piece, path = {
	weight: 0,
	points: [],
	vectors: []
}) {
	var paths = [];
	for (let direction in piece.connected) {
		//console.log(piece.id, `We're seekers of truth going to ${direction} while standing at ${piece.id}, and we have: `, path.vectors, table[piece.connected[direction]].id, path.vectors.filter(p => p.id == table[piece.connected[direction]].id).length == 0);
		if (path.vectors.filter(p => p.id == table[piece.connected[direction]].id).length == 0)
			paths = paths.concat(findPath(table, piece, direction, path))
	}
	path.weight > 0 && paths.push(path);
	//console.log(piece.id, `we've found our way to glory and death`, paths);
	var maxR = 0;
	var ruledVal = true;
	function max(b) {
		maxR = b
	}
	var bestPaths = paths.filter(a => {
		a && a.weight > maxR && (ruledVal ? max(1) : max(a.weight));
		return a
	}).filter(a => a.weight >= maxR);
	//console.log('And the king is', bestPaths);
	return bestPaths;
}

function findPath(table, piece, direction, path = {
	weight: 0,
	points: [],
	vectors: []
}) {
	//for(let direction in piece.connected){
	let connectedPiece = table[piece.connected[direction]];
	if (!connectedPiece)
		return;

	//console.log(piece.id, `We've gone to solice at ${connectedPiece.id}, and got ourselves a nice pieces `, connectedPiece, piece);
	if (piece.checker != 0 && piece.checker % 2 == 0) { // we're damsel
		//console.log(piece.id, 'All hail our mightyness!');
		path.emptyVectors = path.emptyVectors || [];

		return {
			...path
		}
	} else { //we're peasant
		//console.log(piece.id, `We're just a peasant, but we are still stand strong, `, connectedPiece, piece, path);
		if (connectedPiece.checker * piece.checker < 0 || (path.vectors[0] && path.vectors[0].checker * connectedPiece.checker > 0)) { //got enemy checker
			let nextConnectedPiece = table[connectedPiece.connected[direction]];
			//console.log(piece.id, `We've faced an enemy, but we'll never give up until we hit a wall of them or other`, nextConnectedPiece);
			if (nextConnectedPiece && nextConnectedPiece.checker == 0) { //we got enemy with space behind them, strike!
				return findPaths(table, nextConnectedPiece, {
					weight: path.weight + 1,
					points: path.points.concat(nextConnectedPiece),
					vectors: path.vectors.concat(connectedPiece)
				})
			}
		} else if (connectedPiece.checker * piece.checker > 0 || (direction * piece.checker < 0 && connectedPiece.checker == 0)) { //got our checker or heading back and got empty spot
			//console.log(piece.id, `We haven't found our enemy today, but we'll try another time`);
			return {
				weight: path.weight - 1,
				points: [
					...path.points,
					connectedPiece
				],
				vectors: path.vectors
			}
		} else if (direction * piece.checker > 0 && connectedPiece.checker == 0) { //heading forth and got empty spot
			//console.log(piece.id, `At last some place to rest our flaty surface.`, path.weight, [...path.points, connectedPiece], path.vectors);
			return {
				weight: path.weight + 0,
				points: [
					...path.points,
					connectedPiece
				],
				vectors: path.vectors
			}
		} else ; //return console.log(piece.id, `We've stuck in field and can't move forth`, piece.id, path) //, path;
		}
	//we're going from empty ground and there's no enemy pieces nearby
}
