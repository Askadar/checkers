import React from 'react';

class NewGame extends React.Component {
	constructor(p) {
		super(p);

		const types = ['Russian', 'World'];
		const times = ['15|0', '10|0'];
		this.state = {
			selectedType: types[0],
			selectedTime: times[0],
			typePanel: false,
			timePanel: false,
			types,
			times
		};
	}
	handleTypeClick(e) {
		e.preventDefault();
		this.setState({ typePanel: !this.state.typePanel });
	}
	handleTimeClick(e) {
		e.preventDefault();
		this.setState({ timePanel: !this.state.timePanel });
	}
	play() {
		const { selectedType, selectedTime } = this.state;
		const { handler } = this.props;
		handler({ type: 'play', selectedType, selectedTime });
	}
	render() {
		const { selectedTime, selectedType, typePanel, timePanel } = this.state;
		return (
			<nav id="NewGame" className="nav nav-tabs nav-justified">
				<li className="col-md-6 panel">
					<a onClick={this.handleTypeClick.bind(this)}>{selectedType || 'Type'}</a>
					<div className="type-panel panel" style={{ display: typePanel ? 'block' : 'none' }}>
						<ul>
							{this.state.types.map((type, i) => <li key={i} className={`game-type ${type.toLowerCase()}`}>{type}</li>)}
						</ul>
					</div>
				</li>
				<li className="col-md-6 panel">
					<a href="" onClick={this.handleTimeClick.bind(this)}>{selectedTime || 'Time'}</a>
					<div className="time-panel panel" style={{ display: timePanel ? 'block' : 'none' }}>
						<ul>
							{this.state.times.map((time, i) => <li key={i}>{time}</li>)}
						</ul>
					</div>
				</li>
				<li id="play" className="col-md-12"><button className="btn-primary btn" onClick={this.play.bind(this)}>Play</button></li>
			</nav>
		);
	}
}
window.RR = { ...window.RR, 'Play': NewGame };
export default NewGame;
