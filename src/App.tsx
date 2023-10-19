import reactLogo from './assets/react.svg';
import partyKitLogo from './assets/partykit.png';
import viteLogo from '/vite.svg';
import './App.css';
import { Reactions } from './components/Reactions';
import { getPostId } from './utils';

function App() {
	const postID = getPostId();

	return (
		<>
			<div>
				<a href="https://vitejs.dev" target="_blank">
					<img src={viteLogo} className="logo" alt="Vite logo" />
				</a>
				<a href="https://react.dev" target="_blank">
					<img src={reactLogo} className="logo react" alt="React logo" />
				</a>
				<a href="https://partykit.io" target="_blank">
					<img
						src={partyKitLogo}
						className="logo partkit"
						alt="PartyKit logo"
					/>
				</a>
			</div>
			<h1>PartyKit + Vite + React</h1>
			<div className="card">
				<Reactions postID={postID} />
			</div>
			<p className="read-the-docs">
				Click on the PartyKit, Vite and React logos to learn more
			</p>
		</>
	);
}

export default App;
