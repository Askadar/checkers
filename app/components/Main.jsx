import React from 'react';
import CheckersTable from './Parts/CheckersTable'
import table from '../config/temp';

class App extends React.Component {
	render() {
		console.log(this.props)
		return (
			<div style={{
				background: 'rgba(0,0,0,0.4)',
				borderRadius: 12,
				padding: 1 + 'rem'
			}}>
				<header>Some title stuff here</header>
				<CheckersTable table={this.props.table} zoom={this.props.zoom} whites={this.props.whiteInPlay}/>
				<footer>Some footer text here, too</footer>
			</div>
		)
	}
}

export default App;
