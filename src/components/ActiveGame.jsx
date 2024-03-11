import PropTypes from 'prop-types';
import {useState, useEffect, useRef} from 'react';
import GameCard from './GameCard';
import EndGame from './EndGame';

export default function ActiveGame({
	difficult,
	bestResult,
	onUpdateBestResult,
	onChangeMode,
	cards,
	gameNumberCardsForRound,
	gameRounds,
}) {
	const [currentResult, setCurrentResult] = useState(0);
	const [gameOver, setGameOver] = useState(false);
	const [currentGameCards, setCurrentGameCards] = useState([]);
	const selectedCards = useRef([]);
	let isGameWon = false;

	useEffect(() => {
		newRound();
	}, []);

	function clickImage(e) {
		const currentId = e.target.dataset.id;

		if (currentId && !selectedCards.current.includes(currentId)) {
			selectedCards.current.push(currentId);
			setCurrentResult(currentResult + 1);
			newRound();
			if (selectedCards.current.length === gameRounds[difficult]) {
				onUpdateBestResult(currentResult);
				console.log(isGameWon);
				isGameWon = true;
				setGameOver(true);
				console.log(isGameWon);
			}
		} else if (currentId) {
			onUpdateBestResult(currentResult);
			setGameOver(true);
		}
	}

	function getRandomElements(arr, count) {
		const randomElements = [];
		const usedIndices = new Set();
		while (randomElements.length < count) {
			const randomIndex = Math.floor(Math.random() * arr.length);
			if (!usedIndices.has(randomIndex)) {
				randomElements.push(arr[randomIndex]);
				usedIndices.add(randomIndex);
			}
		}

		return randomElements;
	}

	function newRound() {
		const randomCards = getRandomElements(
			cards,
			gameNumberCardsForRound[difficult],
		);
		setCurrentGameCards(randomCards);
	}

	function closeModal() {
		setGameOver(false);
		resetGame();
	}

	function resetGame() {
		setCurrentResult(0);
		selectedCards.current = [];
		isGameWon = false;
	}

	return (
		<>
			<div className="game--information">
				<p>Active game</p>
				<p>{`Score: ${currentResult}`}</p>
				<p>{`Best score ${bestResult}`}</p>

				<p>{`Уровень игры: ${difficult}`}</p>
				<p>{`Количество раундов: ${gameRounds[difficult]}`}</p>
				<button onClick={() => setGameOver(true)}>Open modal</button>
				<button
					onClick={() => {
						newRound();
					}}
				>
					New round
				</button>
			</div>
			<div className="game--cards" onClick={(e) => clickImage(e)}>
				{currentGameCards.map((el) => (
					<GameCard key={el[0]} id={el[0]} url={el[2]} name={el[1]} />
				))}
			</div>
			<div className="game--dialog">
				{gameOver && (
					<EndGame
						onChangeMode={onChangeMode}
						onCloseModal={closeModal}
						isGameWon={isGameWon}
					/>
				)}
			</div>
		</>
	);
}

ActiveGame.propTypes = {
	difficult: PropTypes.string,
	bestResult: PropTypes.number,
	onUpdateBestResult: PropTypes.func,
	onChangeMode: PropTypes.func,
	cards: PropTypes.array,
	gameNumberCardsForRound: PropTypes.object,
	gameRounds: PropTypes.object,
};
