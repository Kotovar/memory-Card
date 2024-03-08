import PropTypes from 'prop-types';
import {useState, useEffect} from 'react';
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
	const [gameCards, setGameCards] = useState([]);

	useEffect(() => {
		newRound();
	}, []);

	function closeModal() {
		setGameOver(false);
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
		setGameCards(randomCards);
	}

	return (
		<>
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
				Показать количество изображений
			</button>
			{gameOver && (
				<EndGame onChangeMode={onChangeMode} onCloseModal={closeModal} />
			)}
			{gameCards.map((el) => (
				<GameCard key={el[0]} url={el[2]} name={el[1]} />
			))}
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
