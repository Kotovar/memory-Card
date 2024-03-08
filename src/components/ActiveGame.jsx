import PropTypes from 'prop-types';
import {useState} from 'react';
import GameCard from './GameCard';
import EndGame from './EndGame';

export default function ActiveGame({
	difficult,
	bestResult,
	onUpdateBestResult,
	onChangeMode,
	cards,
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

	// const gameCards =
	// 	cards.length > 0 &&
	// 	cards.map((el) => <GameCard key={el[0]} url={el[2]} name={el[1]} />);

	return (
		<>
			<p>Active game</p>
			<p>{`Score: ${currentResult}`}</p>
			<p>{`Best score ${bestResult}`}</p>

			<p>{`Уровень игры: ${difficult}`}</p>
			<p>{`Количество раундов: ${gameSettings[difficult]}`}</p>
			<button onClick={() => setGameOver(true)}>Open modal</button>
			<button onClick={() => console.log(cards)}>
				Показать количество изображений
			</button>
			{gameOver && (
				<EndGame onChangeMode={onChangeMode} onCloseModal={closeModal} />
			)}
			{/* {gameCards} */}
		</>
	);
}

ActiveGame.propTypes = {
	difficult: PropTypes.string,
	bestResult: PropTypes.number,
	onUpdateBestResult: PropTypes.func,
	onChangeMode: PropTypes.func,
	cards: PropTypes.array,
};
