import React from 'react';
import Entry from './entry';

class Tournament extends React.Component {
	constructor(p) {
		super(p);
		this.state = { entries:
		[{ type: 'Test', timeframe: { total: 15, turn: 0 }, startsAt: Date.now() + 1000 * 60 * 7, players: 3 },
			{ type: 'Test', timeframe: { total: 15, turn: 0 }, startsAt: Date.now() + 1000 * 60 * 83, players: 3 },
			{ type: 'Test', timeframe: { total: 10, turn: 60 }, startsAt: Date.now() + 1000 * 60 * 52, players: 3 },
			{ type: 'Test', timeframe: { total: 10, turn: 3 }, startsAt: Date.now() + 1000 * 60 * 35, players: 3 },
			{ type: 'Test', timeframe: { total: 45, turn: 15 }, startsAt: Date.now() + 1000 * 60 * 12, players: 3 }]
		};
	}
	render() {
		const { entries } = this.state;
		return (
			<div id="Tournament">
				{ entries.map((data, i) => <Entry key={i} {...data} />)	}
			</div>
		);
	}
}
window.RR = { ...window.RR, Tournament };
export default Tournament;
