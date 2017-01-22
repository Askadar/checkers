import React from 'react';
import locale from '../../config/locale';

export default function Player({ name, rating, side }) {
	return(<div>{`${name} ${rating ? `(${rating})` : ''} ${locale.andSide} ${locale[side]}`}</div>);

}
