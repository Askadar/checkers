import React from 'react';
import Match from './Match';

const Live = function({ data }) {
	return (
		<div id="Live">
			<ul className="list-group">
				{data.map(match => <Match {...match} />)}
			</ul>
		</div>
	);
};
window.RR = { ...window.RR, Live };
export default Live;
