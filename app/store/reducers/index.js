var getLeft = function(color, indecis) {
	if (color === -1)
		return (parseInt(indecis[0]) - 1) + '-' + (String.fromCharCode(indecis[1].charCodeAt() - 1));
	else
		return (parseInt(indecis[0]) + 1) + '-' + (String.fromCharCode(indecis[1].charCodeAt() + 1));
	}
var getRight = function(color, indecis) {
	if (color === -1)
		(parseInt(indecis[0]) - 1) + '-' + (String.fromCharCode(indecis[1].charCodeAt() + 1));
	else
		return (parseInt(indecis[0]) + 1) + '-' + (String.fromCharCode(indecis[1].charCodeAt() - 1));
	}

/*notes
Checker.connected = [..where < 0 are down and > 0 are up (for whites)]
Checker.color = -2,-1,0,1,2 where number declare color and whether it's a king, positive are white, negative are black and 0 is none

Path.points - array of points [pieces] where we can end up
Path.vectors - array of point that we 'fly' over, like enemy piece
*/
if (!Array.prototype.last) {
	Array.prototype.last = function() {
		return this[this.length - 1];
	};
};
function shouldBecomeDamsel(piece, pieceTo) {
	/*
	Bool-like (pieceFrom, pieceTo), return multiplier if got to enemy territory, otherwise 1
	*/
	const hash = {
		'8': -1,
		'1': 1
	}; //hash10 = {10:-1, 1:1}
	if (piece.checker % 2 == 0 && piece.checker !== 0)
		return 1;
	return hash[pieceTo.id.split('-')[0]] * piece.checker < 0
		? 2
		: 1
}
function findAllPaths(table, turn) {
	var newTable = {};
	var t0 = performance.now();
	var bWhiteMovesOnly = true;
	for (let pieceKey in table) {
		//do repath only for those pieces, that either connected to enemy pieces or connected to white spots
		if (table[pieceKey].checker * turn > 0/* && Object.keys(table[pieceKey].connected).some(d => {
			return table[table[pieceKey].connected[d]].checker * table[pieceKey].checker < 0 || (d * table[pieceKey].checker > 0 && table[table[pieceKey].connected[d]].checker == 0) || (table[pieceKey].checker !== 0 && table[pieceKey].checker % 2 == 0)
		})*/) {
			if (table[pieceKey].checker % 2 != 0){
				newTable[pieceKey] = {
					...table[pieceKey],
					paths: findPaths(table, table[pieceKey])
				}
			}
			else if (table[pieceKey].checker % 2 == 0){
				//console.log('going to lookup paths for', table[pieceKey]);
				newTable[pieceKey] = {
					...table[pieceKey],
					paths: checkDirections(table, table[pieceKey], table[pieceKey]).filter(p=>p.points.length > 0 && p.points.length >= p.vectors.length)
				}
				console.log('Paths for '+pieceKey, newTable[pieceKey].paths);
			}
			newTable[pieceKey].className = newTable[pieceKey].paths.length > 0 ? (newTable[pieceKey].className == 'active' ? 'active' : 'can-move') : ''
			// bWhiteMovesOnly = bWhiteMovesOnly
			// 	? newTable[pieceKey].paths.some(a => a.weight > 0)
			// 	: 'false';
		} else {
			newTable[pieceKey] = table[pieceKey];
		}
	}
	var t1 = performance.now();
	if (t1 - t0 > 5) {
		console.log("Pathing took " + (t1 - t0) + " milliseconds.");
		//debugger;
	} //log pathing time only on really slow occasions
	return newTable
}
function checkDirections(table, piece, pieceFrom, directions = [-2,-1,1,2], path = {
	weight: 0,
	points: [],
	vectors: [],
	emptyVectors: []
}) {
	//console.log('Checking directions', path, pieceFrom);
	// const directionHash = {
	// 	'-1': [	-2, 1,-1],
	// 	'-2': [	2, -1,-2],
	// 	'1': [2, -1,1],
	// 	'2': [-2, 1,2]
	// }
	const directionHash = {
		'-1': [-2,-1,1,2],
		'-2':[-2,-1,1,2],
		'1': [-2,-1,1,2],
		'2':[-2,-1,1,2]
	}
	var paths = [path];
	for (let i in directions) {
		let direction = directions[i];
		var nextPiece = table[pieceFrom.connected[direction]];
		let whiteMovesOnly = true;
		let currentPath = {
			...path
		};
		if (nextPiece == undefined || nextPiece.checker * piece.checker > 0)
			continue;
		while (nextPiece) {
			let nextConnectedPiece = table[nextPiece.connected[direction]];
			if (nextPiece.checker == 0 || currentPath.vectors.some(v=>v.id == nextPiece.id) || (nextPiece.id == piece.id && currentPath.vectors.length > 0)) { //we got empty spot or eaten checker
				if (whiteMovesOnly) {
					currentPath.emptyVectors = currentPath.emptyVectors.concat(nextPiece);
				} else { //send em flyin', kidding, go to directions
					if (!currentPath.emptyVectors.some(p=>nextPiece.id == p.id) /*&& !currentPath.points.some(p=>nextPiece.id == p.id)*/){
						paths = paths.concat(checkDirections(table, piece, nextPiece, directionHash[direction], {
							...currentPath,
							points: [
								...currentPath.points,
								nextPiece
							]
						}));
					}
					// else {
					// 	currentPath.points = currentPath.points.concat(nextPiece);
					// }
				}
			}
			else if (nextPiece.checker * piece.checker < 0 && nextConnectedPiece && nextConnectedPiece.checker === 0 /*&& !currentPath.vectors.some(v=>v.id == nextPiece.id)*/){ //we got enemy and there's empty spot behind it
				if(whiteMovesOnly){
					currentPath.vectors = currentPath.vectors.concat(nextPiece);
					// currentPath.points = currentPath.points.concat(nextConnectedPiece);
					currentPath.weight += 1;
					whiteMovesOnly = false; //somewhat a solition, just don't forget (yeah, sure) about strange doubled points in some cases
					//break;
					// paths = paths.concat(checkDirections(table, piece, nextConnectedPiece, directionHash[direction], {
						// ...currentPath
					// }))
				}
				else{ //stumbled across another enemy piece
					break; //stop path finding and let other instance of this function take care of it
				}
			}
			else if (nextPiece.checker * piece.checker > 0 && whiteMovesOnly && currentPath.vectors.length == 0){
				currentPath.weight = -1;
				break; //stumbled across our piece, and we haven't got any enemy, and all is bad, we should go just die (other direction, actually, or really die)
			}
			else {
				break;
			}
			nextPiece = table[nextPiece.connected[direction]]
		}
		if (whiteMovesOnly && piece == pieceFrom){ //we haven't found anyone, so spuff all points in 0-weighted paths
			paths = paths.concat(currentPath.emptyVectors.map(a=>{return {weight:0, points:[a], vectors: []}}));
		}
		paths = paths.concat(currentPath);
	}
	//console.log('Got paths for direction', paths);
	return paths;
}
function checkDirection(table, piece, pieceFrom, direction, path){

}
function findPaths(table, piece, path = {
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

	function max(b) {
		maxR = b
	}
	var bestPaths = paths.filter(a => {
		a && a.weight > maxR && max(a.weight);
		return a
	}).filter(a => a.weight == maxR);
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
export default function logic(state, action) {
	let game = {
		...state.game
	};
	let table = {
		...state.game.table
	};
	switch (action.type) {
		case 'hideMoves':
			Object.keys(table).map(pos => {
				table[pos] = {
					...table[pos],
					className: table[pos].paths && table[pos].paths.length > 0 && game.turn * table[pos].checker > 0
						? 'can-move'
						: '',
					consume: undefined
				}
			});
			return {
				...state,
				game: {
					...state.game,
					table: {
						...table
					}
				}
			};
		case 'showMoves':
			let paths = [...action.paths];
			//debugger;
			paths.map(path => {
				//path.points.map(point=>{
				table[path.points[0].id].className = 'possible-move';
				//})
			});
			table[action.id].className = 'active';
			return {
				...state,
				game: {
					...state.game,
					table: {
						...state.game.table,
						...table
					},
					lastChecker: action.id
				}
			}
		case 'move':
			const {piece, pieceTo, consume, turn} = action;
			console.log('Moving debug', piece, pieceTo, consume, turn);
			if (consume) {
				table[consume].checker = 0;
			}
			table[pieceTo.id].checker = piece.checker * shouldBecomeDamsel(piece, pieceTo);
			table[pieceTo.id].className = turn != state.game.turn
				? ''
				: 'active';
			table[piece.id].checker = 0;
			table[piece.id].className = '';
			return {
				...state,
				game: {
					...game,
					table: {
						...game.table,
						...table
					},
					turn
				}
			}
		case 'updateAllPaths':
			table = findAllPaths(table, game.turn);
			//console.log('new table: ', game.table);
			return {
				...state,
				game: {
					...game,
					table: {
						...table
					}
				}
			}
		default:
			return state
	}
}
