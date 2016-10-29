'use strict';

import {findAllPaths} from './pathing';

// var getLeft = function(color, indecis) {
// 	if (color === -1)
// 		return (parseInt(indecis[0]) - 1) + '-' + (String.fromCharCode(indecis[1].charCodeAt() - 1));
// 	else
// 		return (parseInt(indecis[0]) + 1) + '-' + (String.fromCharCode(indecis[1].charCodeAt() + 1));
// 	}
// var getRight = function(color, indecis) {
// 	if (color === -1)
// 		(parseInt(indecis[0]) - 1) + '-' + (String.fromCharCode(indecis[1].charCodeAt() + 1));
// 	else
// 		return (parseInt(indecis[0]) + 1) + '-' + (String.fromCharCode(indecis[1].charCodeAt() - 1));
// 	}

/*notes
Checker.connected = [..where < 0 are down and > 0 are up (for whites)]
Checker.color = -2,-1,0,1,2 where number declare color and whether it's a king, positive are white, negative are black and 0 is none

Path.points - array of points [pieces] where we can end up
Path.vectors - array of point that we 'fly' over, like enemy piece
*/
// if (!Array.prototype.last) {
// 	Array.prototype.last = function() {
// 		return this[this.length - 1];
// 	};
// };
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
					...game,
					table: {
						...table
					}
				}
			};
		break;
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
					...game,
					table: {
						...table
					},
					lastChecker: action.id
				}
			}
		break;
		case 'move':
			const {piece, pieceTo, consume, turn} = action;
			//console.log('Moving debug', piece, pieceTo, consume, turn);
			if (consume) {
				table[consume].checker = 0;
			}
			table[pieceTo.id].checker = piece.checker * shouldBecomeDamsel(piece, pieceTo);
			table[pieceTo.id].className = turn != state.game.turn
				? ''
				: 'active';
			table[piece.id].checker = 0;
			table[piece.id].className = '';
			game.lastChecker = pieceTo.id;
			return {
				...state,
				game: {
					...game,
					table: {
						...table
					},
					turn
				}
			}
		break;
		case 'updateAllPaths':
			table = findAllPaths(table, game.turn, game.rules.onlyBeatIfPossible);
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
		break;
		default:
			return state
	}
}
