import React from 'react';

export default function Player({ name, rating, side }) {
	return(<div>{`${name} ${rating ? `(${rating})` : ''} and side is ${side}`}</div>);

}
