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

Path.points - array of points where we can end up
Path.vectors - array of point that we 'fly' over, like enemy piece
*/
if (!Array.prototype.last){
    Array.prototype.last = function(){
        return this[this.length - 1];
    };
};
function findPaths(table, piece, path = {weight: 0, points: [], vectors: []){
	var paths = [];
	for(let direction in piece.connected){
		if( path.vectors.filter(p=>p.id == table[piece.connected[direction]].id).length == 0)
		paths.concat(findPath(table, piece, direction)) //beware of .concat(null or undefined), or just filter it afterwards while getting max value
	}
	return paths;

}
function findPath(table, piece, direction, path = {weight: 0, points: [], vectors: []}){
	//for(let direction in piece.connected){
	let connectedPiece = table[piece.connected[direction]];
	if(!connectedPiece)
		return;
	if (piece.checker % 2 == 0) // we're damsel
		return {...path}
	else //we're peasant
		if(connectedPiece.checker * piece.checker < 0){ //got enemy checker
			if(table[connectedPiece.connected[direction]]){
				weight: path.weight+=1
			}
		}
		else if (connectedPiece.checker * piece.checker > 0 || (direction * piece.checker < 0 && connectedPiece.checker == 0)) //got our checker or heading back and got empty spot
			return {
					weight: path.weight -= 1,
					points: [...path.points, connectedPiece],
					vectors: path.vectors
				}
		else if (direction * piece.checker > 0 && connectedPiece.checker == 0) //heading forth and got empty spot
			return {
					weight: path.weight += 0,
					points: [...path.points, connectedPiece],
					vectors: path.vectors
				}
		else ; //we're going from empty ground and there's no enemy pieces nearby
	//}
}
export default function logic(state, action) {
    var game = Object.assign({}, state.game);
    switch (action.type) {
        case 'hideMove':
            Object.keys(game.table).map(pos => {
                game.table[pos] = Object.assign({}, game.table[pos], {
                    possibleMove: '',
                    active: '',
                    consume: undefined
                })
            })
            return {
                ...state,
                game: {
                    ...game,
					table:{
						...game.table
					}
                }
            };
        case 'showMove':
            game.lastChecker = action.id
            var pos = action.id;
            if (game.table[pos].checker !== 0 && game.table[pos].checker == game.turn) {
                game.table[pos].active = 'active'
                switch (game.table[pos].checker) {
                    case -1:
						var foundToEat = false;
                        Object.keys(game.table[pos].connected).map(d => {
                            let key = game.table[pos].connected[d];
                            //console.log(d, key);
                            if ((d < 0 && game.table[key].checker === 0) || game.table[key].checker > 0) // if we are looking black worfard and they aren't another black checkers OR if thi is a white checker
                                if (game.table[key].checker > 0 &&
									(game.table[game.table[key].connected[d]] && game.table[game.table[key].connected[d]].checker === 0)) {
	                                game.table[game.table[key].connected[d]].possibleMove = 'possible-move';
	                                game.table[game.table[key].connected[d]].consume = key;
	                                console.log('Black can move to ', game.table[key].connected[d], 'while eating', key, 'and the checker is ', game.table[game.table[key].connected[d]]);
                            	}
								else if (game.table[key].checker === 0 && !foundToEat)
                                    game.table[key].possibleMove = 'possible-move';
							//else in case
                        })
                        break;
                    case 1:
                        Object.keys(game.table[pos].connected).map(d => {
                            let key = game.table[pos].connected[d];
                            //console.log(d, key);
                            if ((d > 0 && game.table[key].checker === 0) || (game.table[key].checker < 0))// if we are looking white forward and they aren't another white checkers OR if thi is a black checker
                                if (game.table[key].checker === 0)
                                    game.table[key].possibleMove = 'possible-move';
                                else if (game.table[key].checker === -1 && (game.table[game.table[key].connected[d]] && game.table[game.table[key].connected[d]].checker === 0)) {
                                game.table[game.table[key].connected[d]].possibleMove = 'possible-move';
                                game.table[game.table[key].connected[d]].consume = key;
                                console.log('White can move to ', game.table[key].connected[d], 'while eating', key, 'and the checker is ', game.table[game.table[key].connected[d]]);
                            }
                        })
                        break;
                }
                console.log('state', state, game)
                return {
                    ...state,
                    game: {
                        ...game,
                        table: {
							...game.table
                        }
                    }
                };
            }
            return state
        case 'move':
            let pos = action.id;
            console.log('Moving to ', pos, 'and should consume ', game.table[pos].consume);
            let color = game.table[game.lastChecker].checker;
			let turn = color > 0 ? -1 : 1;
            if (game.table[pos].consume) {
                game.table[game.table[pos].consume].checker = 0;
                console.log('and consuming ', pos);
            }
            game.table[game.lastChecker].checker = 0
            game.table[pos].checker = color;
            console.log('state: ', state, game)
			return {
				...state,
				game: {
					...game,
					table:{
						...game.table
					},
					turn
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
