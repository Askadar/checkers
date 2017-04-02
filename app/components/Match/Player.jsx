import React from 'react';
import locale from '../../config/locale';

export default function Player({ name, rating, side, opponent }) {
	return(<div>{`${opponent ? locale.opponent : ''}${name} ${rating ? `(${rating})` : ''} ${locale.andSide} ${locale[side]}`}</div>);
}
