import React from 'react';

export default function Match({ players }) {
	return(
		<li className="list-group-item">
			{players[0]} - {players[1]}
		</li>
	);
}
