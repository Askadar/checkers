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
            //console.log(findPath(table, piece, direction, path));
            //beware of .concat(null or undefined), or just filter it afterwards while getting max value
            // or just flush everything later via array.filter


        //~~~we're returning undef on hitting end of path, replace with prev path or smth/
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
            // game.lastChecker = action.id
            // var pos = action.id;
            // findPaths(game.table, game.table[pos]);
            // if (game.table[pos].checker !== 0 && game.table[pos].checker == game.turn) {
            //     game.table[pos].active = 'active'
            //     switch (game.table[pos].checker) {
            //         case -1:
            //             var foundToEat = false;
            //             Object.keys(game.table[pos].connected).map(d => {
            //                 let key = game.table[pos].connected[d];
            //                 //console.log(d, key);
            //                 if ((d < 0 && game.table[key].checker === 0) || game.table[key].checker > 0) // if we are looking black worfard and they aren't another black checkers OR if thi is a white checker
            //                     if (game.table[key].checker > 0 &&
            //                     (game.table[game.table[key].connected[d]] && game.table[game.table[key].connected[d]].checker === 0)) {
            //                     game.table[game.table[key].connected[d]].possibleMove = 'possible-move';
            //                     game.table[game.table[key].connected[d]].consume = key;
            //                     //console.log('Black can move to ', game.table[key].connected[d], 'while eating', key, 'and the checker is ', game.table[game.table[key].connected[d]]);
            //                 } else if (game.table[key].checker === 0 && !foundToEat)
            //                     game.table[key].possibleMove = 'possible-move';
            //                 //else in case
            //             })
            //             break;
            //         case 1:
            //             Object.keys(game.table[pos].connected).map(d => {
            //                 let key = game.table[pos].connected[d];
            //                 //console.log(d, key);
            //                 if ((d > 0 && game.table[key].checker === 0) || (game.table[key].checker < 0)) // if we are looking white forward and they aren't another white checkers OR if thi is a black checker
            //                     if (game.table[key].checker === 0)
            //                         game.table[key].possibleMove = 'possible-move';
            //                     else if (game.table[key].checker === -1 && (game.table[game.table[key].connected[d]] && game.table[game.table[key].connected[d]].checker === 0)) {
            //                     game.table[game.table[key].connected[d]].possibleMove = 'possible-move';
            //                     game.table[game.table[key].connected[d]].consume = key;
            //                     //console.log('White can move to ', game.table[key].connected[d], 'while eating', key, 'and the checker is ', game.table[game.table[key].connected[d]]);
            //                 }
            //             })
            //             break;
            //     }
            //     //console.log('state', state, game)
            //     return {
            //         ...state,
            //         game: {
            //             ...game,
            //             table: {
            //                 ...game.table
            //             }
            //         }
            //     };
            // }
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
            // let pos = action.id;
            // let turn = action.turn;
            // //console.log('Moving to ', pos, 'and should consume ', game.table[pos].consume);
            // let color = game.table[game.lastChecker].checker;
            // if (game.table[pos].consume) {
            //     game.table[game.table[pos].consume].checker = 0;
            //     //console.log('and consuming ', pos);
            // }
            // game.table[game.lastChecker].checker = 0
            // game.table[pos].checker = color;
        	// //console.log('state: ', state, game)
            // //console.log('new table: ', game.table);
            // return {
            //     ...state,
            //     game: {
            //         ...game,
            //         table: {
            //             ...game.table
            //         },
            //         turn
            //     }
            // }
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

// switch (game.table[pos].checker) {
// 	case 'black':
// 		var indecis = pos.split('-');
// 		var right = getRight('black', indecis);
// 		var left = getLeft('black', indecis);
// 		break;
// 	case 'white':
// 		var indecis = pos.split('-');
// 		var right = getRight('white', indecis);
// 		var left = getLeft('white', indecis);
// }
// var poses = [left, right],
// 	currentColor = game.table[pos].checker;
// poses.map((p, i) => {
// 	let l, r;
// 	console.log(p, game.table[p])
// 	switch (game.table[p].checker) {
// 		case 'white':
// 			l = getLeft('white', p.split('-'));
// 			r = getRight('white', p.split('-'));
// 			if (i == 0 && game.table[l] && game.table[l].checker === 0)
// 				game.table[l].possibleMove = 'possible-move';
// 			if (i == 1 && game.table[r] && game.table[r].checker === 0)
// 				game.table[r].possibleMove = 'possible-move';
// 		case 'black':
// 			l = getLeft('black', p.split('-'));
// 			r = getRight('black', p.split('-'));
// 			if (i == 0 && game.table[l] && game.table[l].checker === 0)
// 				game.table[l].possibleMove = 'possible-move';
// 			if (i == 1 && game.table[r] && game.table[r].checker === 0)
// 				game.table[r].possibleMove = 'possible-move';
// 		case 'black-damsel':
// 			break;
// 		case 'white-damsel':
// 			break;
// 		case 'none':
// 		default:
// 			game.table[p].possibleMove = 'possible-move'
// 			break;
// 	}
// })
// game.table[pos].active = 'active';
// console.log(game.table[pos]);
