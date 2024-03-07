import PropTypes from 'prop-types';
import {useState} from 'react';
import GameCard from './GameCard';
import EndGame from './EndGame';

export default function ActiveGame({
	difficult,
	bestResult,
	onUpdateBestResult,
	onChangeMode,
}) {
	const [currentResult, setCurrentResult] = useState(0);
	const [gameOver, setGameOver] = useState(false);

	const gameSettings = {
		easy: 5,
		medium: 7,
		hard: 10,
	};

	function closeModal() {
		setGameOver(false);
	}

	let cards = new Array(10).fill('');
	cards = cards.map((el, index) => <GameCard key={index} cardId={index} />);

	return (
		<>
			<p>Active game</p>
			<p>{`Score: ${currentResult}`}</p>
			<p>{`Best score ${bestResult}`}</p>

			<p>{`Уровень игры: ${difficult}`}</p>
			<p>{`Количество раундов: ${gameSettings[difficult]}`}</p>
			<button onClick={() => setGameOver(true)}>Open modal</button>
			{gameOver && (
				<EndGame onChangeMode={onChangeMode} onCloseModal={closeModal} />
			)}
			{cards}
		</>
	);
}

ActiveGame.propTypes = {
	difficult: PropTypes.string,
	bestResult: PropTypes.number,
	onUpdateBestResult: PropTypes.func,
	onChangeMode: PropTypes.func,
};
