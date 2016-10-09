import React from 'react';

class Checker extends React.Component {
	handleClick(e) {
		//console.log(e.target, this);
		//console.log(this.props.active, this.props.possibleMove, this.props.showMove);
		if (this.props.possibleMove)
			return this.props.move(this.props.id),
			this.props.hideMove();
		this.props.hideMove();
		if (this.props.active)
			return;
		return this.props.showMove(this.props.id);
	}
	render() {
		console.log(`Checker ${this.props.id} rendered`);
		return <div className={`checker ${this.props.active || ''} ${this.props.possibleMove || ''}`} id={this.props.id} data-checker={this.props.checker} onClick={this.handleClick.bind(this)}/>
	}
}

export default Checker;
