import { useEffect, useRef, useState } from 'react';
import usePartySocket from 'partysocket/react';
import reactLogo from './assets/react.svg';
import viteLogo from '/vite.svg';
import './App.css';

function App() {
	const [count, setCount] = useState(0);

	const timeout = useRef<number | null>(null);
	const add = (text: string) => {
		console.log('Adding text', text);
	};

	const conn = usePartySocket({
		// usePartySocket takes the same arguments as PartySocket.
		host: 'http://localhost:1999', // or localhost:1999 in dev
		room: 'my-room',

		// in addition, you can provide socket lifecycle event handlers
		// (equivalent to using ws.addEventListener in an effect hook)
		onOpen() {
			add('Connected');
			add('Sending a ping every 2 seconds...');
		},
		onMessage(e) {
			add(`Receiver -> ${e.data}`);
		},
		onClose() {
			add('Closed');
		},
		onError(e) {
			add(`Error -> ${JSON.stringify(e)}`);
		},
	});

	useEffect(() => {
		timeout.current = setInterval(() => {
			conn.send('ping');
		}, 2000);

		return () => {
			timeout.current && clearInterval(timeout.current);
		};
	}, []);

	return (
		<>
			<div>
				<a href="https://vitejs.dev" target="_blank">
					<img src={viteLogo} className="logo" alt="Vite logo" />
				</a>
				<a href="https://react.dev" target="_blank">
					<img src={reactLogo} className="logo react" alt="React logo" />
				</a>
			</div>
			<h1>Vite + React</h1>
			<div className="card">
				<button onClick={() => setCount((count) => count + 1)}>
					count is {count}
				</button>
				<p>
					Edit <code>src/App.tsx</code> and save to test HMR
				</p>
			</div>
			<p className="read-the-docs">
				Click on the Vite and React logos to learn more
			</p>
		</>
	);
}

export default App;
