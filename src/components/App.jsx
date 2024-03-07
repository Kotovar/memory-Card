import StartPage from './StartPage';
import ActiveGame from './ActiveGame';
import {useState} from 'react';

function App() {
	const initialScore = 0;
	const [bestResult, setBestResult] = useState(loadFromLocalStorage());
	const [difficult, setDifficult] = useState('easy'); // 'easy', 'medium', 'hard'
	const [gameState, setGameState] = useState('start'); // 'start', 'game', 'win', 'defeat'

	function changeDifficult(difficult) {
		setDifficult(difficult);
		setGameState('game');
	}

	function updateBestResult(score) {
		if (score > bestResult) {
			setBestResult(score);
			saveToLocalStorage(score);
		}
	}

	function saveToLocalStorage(score) {
		let scoreJSON = JSON.stringify(score);
		localStorage.setItem('score', scoreJSON);
	}

	function loadFromLocalStorage() {
		const retrievedJSON = localStorage.getItem('score');
		let score;
		if (retrievedJSON) {
			score = JSON.parse(retrievedJSON);
		} else {
			score = initialScore;
		}

		return score;
	}

	return (
		<>
			{gameState === 'start' && (
				<StartPage onChangeDifficult={changeDifficult} />
			)}
			{gameState === 'game' && (
				<ActiveGame
					difficult={difficult}
					bestResult={bestResult}
					onUpdateBestResult={updateBestResult}
				/>
			)}
		</>
	);
}

export default App;

// - useState для хранения лучшего результата, который будет сохраняться в локалсторадж и оттуда загружаться при первом рендере.
// - useState для хранения текущего уровня сложности.
// - useState для хранения текущего статуса, что нужно рендерить: "Стартовое окно", "Игра", "Победа", "Поражение". В зависимости от статуса -
// рендерит 1 из 3х дочерних компонент. По умолчанию - "Стартовое окно"
