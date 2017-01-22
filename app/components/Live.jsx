import React from 'react';
import Match from './SmallViews/Match';
import locale from '../config/locale';

const Live = function({ data }) {
	return (
		<div id="Live">
			<ul className="list-group">
				{
					data.length > 0 ?
						data.map(match => <Match key={match.roomId} {...match} />) :
						<div className="spinner">{locale.noLiveGames}</div>
				}
			</ul>
		</div>
	);
};
window.RR = { ...window.RR, Live };
export default Live;
