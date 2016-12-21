import React from 'react';
import NewGameView from '../components/NewGameView';

class NewGame extends React.Component {
	constructor(p) {
		super(p);

		const types = ['Russian', 'World'];
		const times = ['15|0', '10|0'];
		this.state = {
			selectedType: types[0],
			selectedTime: times[0],
			activePanel: false,
			types,
			times
		};
	}
	componentDidMount() {
		this.test = this.handleClick.bind(this);
		window.document.body.addEventListener('click', this.test);
	}
	componentWillUnmount() {
		window.document.body.removeEventListener('click', this.test);
	}
	handleClick(e) {
		e.preventDefault();
		const checking = { panel: ['typePanel', 'timePanel'], variable: ['selectedType', 'selectedTime'] };
		if (checking.panel.includes(e.target.name)) {
			let state = {};
			state.activePanel = this.state.activePanel === e.target.name ? null : e.target.name;
			this.setState(state);
		}
		else if (checking.variable.includes(e.target.dataset.name)) {
			let state = {};
			state[e.target.dataset.name] = e.target.textContent;
			this.setState(state);
		}
		else
			this.setState({ activePanel: false });
	}
	play() {
		const { selectedType, selectedTime } = this.state;
		const { handler } = this.props;
		handler({ type: 'play', selectedType, selectedTime });
	}
	render() {
		return (
			<NewGameView {...this.state} playHandler={this.play.bind(this)}/>
		);
	}
}
window.RR = { ...window.RR, 'Play': NewGame };
export default NewGame;
