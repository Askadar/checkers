import React from 'react';
import locale from '../../config/locale';

export default function WinScreen({ type, side, message }) {
	return (<div className="game-result">
		<span className="side">{locale['win' + side]}</span>
		<span className="type">{locale[type]}</span>
		<span className="message">{`${locale.winPrefix} ${locale[(side * -1)]} ${message}`}</span>
	</div>);
}
