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

function findAllPaths(table) {
    var newTable = {};
	var t0 = performance.now();
    for (let pieceKey in table) {
        if (table[pieceKey].checker !== 0 && Object.keys(table[pieceKey].connected).filter(d => {
                return table[table[pieceKey].connected[d]].checker * table[pieceKey].checker < 0 || (d * table[pieceKey].checker > 0 && table[table[pieceKey].connected[d]].checker == 0)
            }).length > 0) {
            newTable[pieceKey] = {...table[pieceKey],
                paths: findPaths(table, table[pieceKey])
            }
        } else {
            newTable[pieceKey] = table[pieceKey];
        }
    }
	var t1 = performance.now();
	console.log("Pathing took " + (t1 - t0) + " milliseconds.")
    return newTable
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
                points: [...path.points, connectedPiece],
                vectors: path.vectors
            }
        } else if (direction * piece.checker > 0 && connectedPiece.checker == 0) { //heading forth and got empty spot
            //console.log(piece.id, `At last some place to rest our flaty surface.`, path.weight, [...path.points, connectedPiece], path.vectors);
            return {
                weight: path.weight + 0,
                points: [...path.points, connectedPiece],
                vectors: path.vectors
            }
        } else; //return console.log(piece.id, `We've stuck in field and can't move forth`, piece.id, path) //, path;
    } //we're going from empty ground and there's no enemy pieces nearby
}
export default function logic(state, action) {
	let game = {...state.game};
	let table = {...state.game.table};
    switch (action.type) {
        case 'hideMoves':
            Object.keys(table).map(pos => {
                table[pos] = {
					...table[pos],
					possibleMove: '',
                    active: '',
                    consume: undefined
                }
			})
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
			paths.map(path=>{
				//path.points.map(point=>{
				table[path.points[0].id].possibleMove = 'possible-move';
				//})
			})
			table[action.id].active = 'active';
			return {
				...state, game: {
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
			console.log('Moving debug', piece,pieceTo,consume, turn);
			if (consume){
				table[consume].checker = 0;
			}
			table[pieceTo.id].checker = piece.checker;
			table[pieceTo.id].active = 'active';
			table[piece.id].checker = 0;
			return {
				...state,
				game: {
					...state.game,
					table: {
						...state.game.table,
						...table
					},
					turn
				}
			}
		case 'updateAllPaths':
			game.table = findAllPaths(game.table);
			//console.log('new table: ', game.table);
			return {
				...state,
				game: {
					...game,
					table: {
						...game.table
					}
				}
			}
        default:
            return state
    }
}
