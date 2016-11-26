import React from 'react';

const Chat = function({ data }) {
	return (
		<div>
			{data.map(({ message, author }) => { return <li><b>{author}</b>: {message}</li>;})}
		</div>
	);
};

window.RR = { ...window.RR, Chat };
export default Chat;
