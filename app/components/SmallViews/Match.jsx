import React from 'react';
import { Link } from 'react-router';

export default function Match({ players, roomId, type, time }) {
	let stringedPlayers = players.map(player => `${player.name} (${player.rating})`);
	return(
		<li className="list-group-item">
			<Link to={`/checkers/match/${roomId}`}>{`${stringedPlayers[0]} - ${stringedPlayers[1]} | ${type}, ${time}`}</Link>
		</li>
	);
}
