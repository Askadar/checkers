import React from 'react';

export default function({ selectedType, selectedTime, activePanel, types, times, playHandler }) {
	return(<nav id="NewGame" className="nav nav-tabs nav-justified">
		<li className="col-md-6">
			<a name="typePanel">{selectedType || 'Type'}</a>
			<div className={`type-panel ${activePanel === 'typePanel' ? ' active' : ''}`}>
					{types.map((type, i) => <span key={i} className={`type ${type.toLowerCase()}`}>{type}</span>)}
			</div>
		</li>
		<li className="col-md-6">
			<a name="timePanel">{selectedTime || 'Time'}</a>
			<div className={`time-panel ${activePanel === 'timePanel' ? ' active' : ''}`}>
					{times.map((time, i) => <span key={i} className={`type ${time.toLowerCase()}`}>{time}</span>)}
			</div>
		</li>
		<li id="play" className="col-md-12"><button className="btn-primary btn" onClick={playHandler}>Play</button></li>
	</nav>);
}
