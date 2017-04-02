import React from 'react';
import locale from '../../config/locale';
import { Link } from 'react-router';

export default function WinScreen({ type, side, message }) {
	return (<div className="game-result">
		<span className="side">{locale['win' + side]}</span>
		<span className="type">{locale[type]}</span>
		<span className="message">{`${locale.winPrefix} ${locale[(side * -1)]} ${message}`}</span>
		<span className="link"><Link to="/checkers/">{locale.backToSingleplayer}</Link></span>
	</div>);
}
