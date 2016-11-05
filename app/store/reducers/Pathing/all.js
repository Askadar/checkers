import checkDirections from './directions';
import findPaths from './paths';

export default function findAllPaths(table, game) {
	const { turn, rules, playerSide } = game;
	let newTable = {};
	let t0 = performance.now();
	let bWhiteMovesOnly = true;
	let ruledVal = true;
	let sidesHash = { '1': 0, '-1': 0 };
	// if (turn * playerSide < 0)		{
	// 	return table;
	// }
	for (let pieceKey in table)
		// do repath only for those pieces, that either connected to enemy pieces or connected to white spots
		if (table[pieceKey].checker * turn > 0/* && Object.keys(table[pieceKey].connected).some(d => {
			return table[table[pieceKey].connected[d]].checker * table[pieceKey].checker < 0 || (d * table[pieceKey].checker > 0 && table[table[pieceKey].connected[d]].checker == 0) || (table[pieceKey].checker !== 0 && table[pieceKey].checker % 2 == 0)
		})*/) {
			if (table[pieceKey].checker % 2 !== 0)
				newTable[pieceKey] = {
					...table[pieceKey],
					paths: findPaths(table, table[pieceKey])
				};
			
			else if (table[pieceKey].checker % 2 === 0)
				// console.log('going to lookup paths for', table[pieceKey]);
				newTable[pieceKey] = {
					...table[pieceKey],
					paths: checkDirections(table, table[pieceKey], table[pieceKey]).filter(p => p.points.length > 0 && p.points.length >= p.vectors.length)
				};
				// console.log('Paths for '+pieceKey, newTable[pieceKey].paths);
			
			newTable[pieceKey].className = newTable[pieceKey].paths.length > 0 ? (newTable[pieceKey].className === 'active' ? 'active' : (turn * playerSide > 0 ? 'can-move' : '')) : '';
			bWhiteMovesOnly = bWhiteMovesOnly
				? !newTable[pieceKey].paths.some(path => path.weight > 0)
				: 'false';
		}
		else
			newTable[pieceKey] = table[pieceKey];
		
		// if (ruledVal
		// 	&& sidesHash[newTable[pieceKey].checker > 0 ? 1 : (newTable[pieceKey].checker < 0 ? -1 : 0 )] === 0
		// 	&& newTable[pieceKey].paths.some(p=>p.weight > 0))
		// 	sidesHash[newTable[pieceKey].checker] = 1;
	
	// TODO: fix this thingy later
	console.log('White moves only', bWhiteMovesOnly);
	if (rules.onlyBeatIfPossible && !bWhiteMovesOnly)
		Object.keys(newTable)
			.filter(key => newTable[key].checker * turn > 0)
			.map(key => {
				newTable[key].paths = newTable[key].paths
					.filter(path => path.weight > 0);
				newTable[key].className = newTable[key].paths.length > 0 ? newTable[key].className : '';
			});
	
	// if (sidesHash[-1] == 1 || sidesHash[1] == 1){
	// 	for (let pieceKey in newTable){
	// 		newTable[pieceKey].paths = newTable[pieceKey].paths ? newTable[pieceKey].paths.filter(p=>p.weight >= sidesHash[(newTable[pieceKey].checker > 0 ? 1 : -1)]) : newTable[pieceKey].paths;
	// 	}
	// }
	let t1 = performance.now();
	if (t1 - t0 > 5)
		console.log('Pathing took ' + (t1 - t0) + ' milliseconds.');
		// debugger;
	 // log pathing time only on really slow occasions
	return newTable;
}
