import React from 'react';

class Entry extends React.Component {
	constructor(p) {
		super(p);
		this.state = { timeLeft: Math.round((p.startsAt - Date.now()) / (60 * 1000)) };
	}
	render() {
		const { type, timeframe, players } = this.props;
		const { timeLeft } = this.state;
		return(
			<div className={`entry ${type}`}>
				<span className="timeframe">{`${timeframe.total}|${timeframe.turn}`}</span>
				<span className="type-label">{type}</span>
				<span className="time-left">{timeLeft}</span>
				<span className="players">{players}</span>
			</div>);
	}
}

export default Entry;
