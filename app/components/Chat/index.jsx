import React from 'react';

const Chat = function({ data }) {
	return (
		<div className="chat">
			{data.map(({ message, author }, i) => { return <p key={i}><b>{author}</b><span>{message}</span></p>;})}
		</div>
	);
};

window.RR = { ...window.RR, Chat };
export default Chat;
