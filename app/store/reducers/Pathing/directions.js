export default function checkDirections(table, piece, pieceFrom, directions = [-2,-1,1,2], path = {
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
			if (nextPiece.checker == 0 || currentPath.vectors.some(v=>v.id == nextPiece.id) /*|| (nextPiece.id == piece.id && currentPath.vectors.length > 0)*/) { //we got empty spot or eaten checker
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
