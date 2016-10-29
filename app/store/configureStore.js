import {createStore} from 'redux';
import reducer from './reducers';
import x from '../config/temp.js'

const state = {
	game: {
		table: x,
		turn: 1,
		rules: {
			onlyBeatIfPossible: true
		}
	}
}
export default createStore(reducer, state, window.devToolsExtension && window.devToolsExtension());
