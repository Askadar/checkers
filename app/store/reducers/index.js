import { findAllPaths } from './pathing';

/* notes
Checker.connected = [..where < 0 are down and > 0 are up (for whites)]
Checker.color = -2,-1,0,1,2 where number declare color and whether it's a king, positive are white, negative are black and 0 is none

Path.points - array of points [pieces] where we can end up
Path.vectors - array of point that we 'fly' over, like enemy piece
*/

function shouldBecomeDamsel(piece, pieceTo) {
	/*
	Bool-like (pieceFrom, pieceTo), return multiplier if got to enemy territory, otherwise 1
	*/
	const hash = {
		'8': -1,
		'1': 1
	}; // hash10 = {10:-1, 1:1}
	if (piece.checker % 2 === 0 && piece.checker !== 0/* && piece.paths.length === 0*/)
		return 1;

	return hash[pieceTo.id.split('-')[0]] * piece.checker < 0
		? 2
		: 1;
}

export default function logic(state, action) {
	let game = {
		...state.game
	};
	let table = {
		...state.game.table
	};
	switch (action.type) {
	case 'setSide':
		return {
			...state,
			game: {
				...game,
				playerSide: action.side
			}
		};
	case 'hideMoves':
		Object.keys(table).map(pos => {
			table[pos] = {
				...table[pos],
				className: table[pos].paths && table[pos].paths.length > 0 && game.turn * table[pos].checker > 0
						? (game.turn * game.playerSide > 0 ? 'can-move' : '')
						: '',
				consume: null
			};
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
	case 'showMoves':
		let paths = [...action.paths];
			// debugger;
		paths.map(path => {
				// path.points.map(point=>{
			table[path.points[0].id].className = 'possible-move';
				// })
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
		};
	case 'move':
		const { piece, pieceTo, consume, turn } = action;
			// console.log('Moving debug', piece, pieceTo, consume, turn);
		let sequentialWhiteMoves = game.sequentialWhiteMoves;
		if (consume) {
			table[consume].checker = 0;
			sequentialWhiteMoves = 0;
		}
		else
			sequentialWhiteMoves += 1;

		table[pieceTo.id].checker = piece.checker * shouldBecomeDamsel(piece, pieceTo);
		table[pieceTo.id].className = turn !== state.game.turn
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
				turn,
				sequentialWhiteMoves
			}
		};
	case 'updateAllPaths':
		let won = null;
		let newTable = { ...table };
		if (game.sequentialWhiteMoves >= 30)
			won = { side: 0, type: 'force draw', message: '30 sequential moves without taking enemy pieces' };
		else
			newTable = findAllPaths(table, game);
		let noPaths = false;
		let noPieces = true;
		for (let i in newTable)
			if (newTable[i].checker * game.turn > 0) {
				noPieces = false;
				if (newTable[i].paths.length > 0) {
					noPaths = false;
					break;
				}
				else{
					noPaths = true;
					continue;
				}
			}
			else if (newTable[i].checker === 0 || newTable[i].checker * game.turn < 0)
				continue;
		won = noPieces ? { side: -game.turn, type: 'no pieces left', message: `${game.turn} side have no more pieces` } : won;

		if (noPaths) won = { side: -game.turn, type: 'no moves left', message: `${game.turn} side have no more moves` };
		return {
			...state,
			game: {
				...game,
				table: {
					...newTable
				},
				won
			}
		};
	default:
		return state;
	}
}
