import React from 'react';
import ChatMessage from './SmallViews/ChatMessage';

function smoothScroll(c, a, b, i) {
	i++; if (i > 30) return;
	c.scrollTop = a + (b - a) / 30 * i;
	setTimeout(function() {smoothScroll(c, a, b, i); }, 20);
}

export default class Chat extends React.Component {
	constructor(p) {
		super(p);
		this.state = {
			message: '',
			author: p.author || 'Foo',
			data: p.data
		};
	}
	sendMessage() {
		const { data, author, message } = this.state;
		smoothScroll(this.refs.messagesBox, this.refs.messagesBox.scrollTop, this.refs.messagesBox.scrollHeight, 0);
		this.setState({ message: '', data: [...data, { author, message, status: 'sending' }] });
	}
	chatInputHandler(e) {
		this.setState({ message: e.target.value });
	}
	chatSendMessageHandler(e) {
		e.preventDefault();
		this.state.message !== '' &&	this.sendMessage();
		// this.setState({ message: '' });
	}
	render() {
		const { data, message } = this.state;
		return (
			<div className="chat">
				<div className="messages" ref="messagesBox">
					{data.map((messageData, i) => <ChatMessage key={i} {...messageData}/>)}
				</div>
				<div className="chat-input">
					<textarea placeholder="Your message" type="text" value={message} onChange={this.chatInputHandler.bind(this)}/>
					<button type="submit" onClick={this.chatSendMessageHandler.bind(this)}>Send</button>
				</div>
			</div>
		);
	}
}

window.RR = { ...window.RR, Chat };
