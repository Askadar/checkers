import React from 'react';
import ChatMessage from './SmallViews/ChatMessage';

const Chat = function({ data }) {
	return (
		<div className="chat">
			{data.map((messageData, i) => <ChatMessage key={i} {...messageData}/>)}
		</div>
	);
};

window.RR = { ...window.RR, Chat };

export default Chat;
