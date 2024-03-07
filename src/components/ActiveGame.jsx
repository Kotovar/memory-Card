import PropTypes from 'prop-types';
import EndGame from './EndGame';
import {useState} from 'react';

export default function ActiveGame({
	difficult,
	bestResult,
	onUpdateBestResult,
}) {
	const [currentResult, setCurrentResult] = useState(0);
	const [gameOver, setGameOver] = useState(false);

	const gameSettings = {
		easy: 5,
		medium: 7,
		hard: 10,
	};

	return (
		<>
			<p>Active game</p>
			<p>{`Score: ${currentResult}`}</p>
			<p>{`Best score ${bestResult}`}</p>

			<p>{`Уровень игры: ${difficult}`}</p>
			<p>{`Количество раундов: ${gameSettings[difficult]}`}</p>
			{gameOver && <EndGame />}
		</>
	);
}

ActiveGame.propTypes = {
	difficult: PropTypes.string,
	bestResult: PropTypes.number,
	onUpdateBestResult: PropTypes.func,
};
