import React from 'react';

export default ({ selectedType, selectedTime, activePanel, types, times, playHandler }) => {
	const spans = (variable, index, type) => <span key={index} data-name={type} className={`type ${variable.toLowerCase()}`}>{variable}</span>;
	return(<nav id="NewGame" className="nav nav-tabs nav-justified">
		<li className="col-md-6">
			<a name="typePanel">{selectedType || 'Type'}</a>
			<div className={`type-panel${activePanel === 'typePanel' ? ' active' : ''}`}>
					{types.map((type, i) => spans(type, i, 'selectedType'))}
			</div>
		</li>
		<li className="col-md-6">
			<a name="timePanel">{selectedTime || 'Time'}</a>
			<div className={`time-panel${activePanel === 'timePanel' ? ' active' : ''}`}>
					{times.map((time, i) => spans(time, i, 'selectedTime'))}
			</div>
		</li>
		<li id="play" className="col-md-12"><button className="btn-primary btn" onClick={playHandler}>Play</button></li>
	</nav>);
};
