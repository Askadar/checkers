import React from 'react';

export default class Player extends React.Component {
	render() {
		console.log('player render', this.props);
		const { name, rating } = this.props;
		return(<div>{`${name} - ${rating}`}</div>);
	}
}
