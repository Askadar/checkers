import React from 'react';
import NewGameView from '../components/NewGame/';

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
		if (e.target.name in { typePanel: '', timePanel: '' }) {
			let state = {};
			state.activePanel = this.state.activePanel === e.target.name ? null : e.target.name;
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
