import React from 'react';

export default function WinScreen({ type, side, message }) {
	return (<div className="game-result">
		<span className="side">{side === 1 ? 'white' : 'black'}</span>
		<span className="type">{type}</span>
		<span className="message">{message}</span>
	</div>);
}
