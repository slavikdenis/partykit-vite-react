import type * as Party from 'partykit/server';
import { createUpdateMessage, parseActionMessage } from './types';
import { rateLimit } from './limiter';

const json = (response: string) =>
	new Response(response, {
		headers: {
			'Content-Type': 'application/json',
		},
	});

export default class Server implements Party.Server {
	options: Party.ServerOptions = { hibernate: false };
	constructor(readonly party: Party.Party) {}
	count: number = 0;

	async onStart() {
		// Load counter from storage on startup
		this.count = (await this.party.storage.get<number>('count')) ?? 0;
	}

	async onRequest() {
		// For all HTTP request, respond with the current count
		return json(createUpdateMessage(this.count));
	}

	onConnect(connection: Party.Connection) {
		// For all WebSocket connections, send the current count
		connection.send(createUpdateMessage(this.count));
	}

	onMessage(message: string, sender: Party.Connection) {
		// For all WebSocket messages, parse the message and update the count

		// Rate limit incoming messages
		rateLimit(sender, 100, () => {
			const parsed = parseActionMessage(message);
			this.updateAndBroadcastCount(parsed.action);
		});
	}

	updateAndBroadcastCount(action: string) {
		// Update stored count
		if (action === 'upvote') this.count++;
		else if (action === 'downvote') this.count--;

		// Send updated count to all connected listeners
		this.party.broadcast(createUpdateMessage(this.count));
		// Store updated count
		this.party.storage.put('count', this.count);
	}
}

Server satisfies Party.Worker;
