import React from 'react';

export default function ChatMessage({ author, message }) {
	return <p ><b>{author}</b><span>{message}</span></p>;
}
