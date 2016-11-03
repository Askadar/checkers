import { createStore } from 'redux';
import reducer from './reducers';
import x from '../config/temp.js';

const state = {
	game: {
		table: x,
		turn: 1,
		rules: {
			onlyBeatIfPossible: true
		},
		winConditions: {
			noMovesLeft: true,
			foceDrawAfterWhiteMoves: 30,
			forceDrawAfter3vs1Damsels: 15
		},
		won: { side: 1, type: 'debug', message: 'some long debugging victory message just to write some css and stuff' }
	}
};

export default createStore(reducer, state, window.devToolsExtension && window.devToolsExtension());
