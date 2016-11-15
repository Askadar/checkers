import React from 'react';

export default class Player extends React.Component {
	render() {
		// console.log('player render', this.props);
		const { name, rating, side } = this.props;
		return(<div>{`${name} ${rating ? `(${rating})` : ''} and side is ${side}`}</div>);
	}
}
