import { useCallback, useState } from 'react';
import usePartySocket from 'partysocket/react';
import throttle from 'lodash.throttle';
import s from './Reactions.module.css';
import {
	GO_AWAY_SENTINEL,
	SLOW_DOWN_SENTINEL,
	createActionMessage,
	parseUpdateMessage,
} from '../server/types';

// In case of custom setup, change this to your server's host
const host = import.meta.env.PROD
	? window.location.origin
	: 'http://localhost:1999';

export const Reactions = ({ postID }: { postID: string }) => {
	const [count, setCount] = useState<number | null>(null);

	const socket = usePartySocket({
		host,
		room: postID,
		onMessage(event) {
			if (event.data === SLOW_DOWN_SENTINEL) {
				console.log("Cool down. You're sending too many messages.");
				return;
			}

			if (event.data === GO_AWAY_SENTINEL) {
				// server told us to go away. They already closed the connection, but
				// we'll call socket.close() to stop reconnection attempts
				console.log('Good bye.');
				socket.close();
				return;
			}

			updateValues(event);
		},
	});

	const updateValues = useCallback(
		throttle((event: WebSocketEventMap['message']) => {
			const message = parseUpdateMessage(event.data);
			setCount(message.count);
		}, 50),
		[]
	);

	const vote = (action: 'upvote' | 'downvote') => {
		socket.send(createActionMessage(action));
	};

	return (
		<div>
			<button disabled={count === null} onClick={() => vote('upvote')}>
				<span>👍</span>
			</button>

			<span className={s.counter}>{count ?? '-'}</span>

			<button disabled={count === null} onClick={() => vote('downvote')}>
				<span>👎</span>
			</button>
		</div>
	);
};
