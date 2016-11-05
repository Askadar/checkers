import React from 'react';

class Checker extends React.Component {
	handleClick(e) {
		// console.log(e.target, this);
		// console.log(this.props.active, this.props.possibleMove, this.props.showMove);
		const {
			className,
			active,
			move,
			hideMoves,
			showMoves,
			id
		} = this.props;
		switch (className) {
		case 'can-move':
			hideMoves();
			showMoves(id);
			break;
		case 'active':
			hideMoves();
			break;
		case 'possible-move':
			move(id);
			break;
		default:
				// hideMoves();
			break;
		}

		// if (this.props.class == 'possible-move')
		// 	return this.props.move(this.props.id),
		// 	this.props.hideMove();
		// this.props.hideMove();
		// if (this.props.class == 'active')
		// 	return;
		// if (this.props.checker !== 0) {
		// 	return this.props.showMove(this.props.id);
		// }
	}
	render() {
		return <div className={`checker ${this.props.className}`} id={this.props.id} data-checker={this.props.checker} onClick={this.handleClick.bind(this)}/>;
	}
}

export default Checker;
