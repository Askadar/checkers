import React from 'react';

function self(name) {
	return name === 'Foo';
}

export default function ChatMessage({ author, message, status }) {
	return <p data-author={author} className={(status || '') + (self(author) ? ' own' : '')}>{message}</p>;
}
