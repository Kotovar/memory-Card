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
	numberCardsToMix,
}) {
	const [currentResult, setCurrentResult] = useState(0);
	const [gameOver, setGameOver] = useState(false);
	const [currentGameCards, setCurrentGameCards] = useState([]);
	const selectedCards = useRef([]);
	const isGameWon = useRef(false);

	useEffect(() => {
		newRound();
	}, []);

	function clickImage(e) {
		const currentId = e.target.dataset.id;

		if (currentId && !selectedCards.current.includes(currentId)) {
			selectedCards.current.push(currentId);
			const newResult = currentResult + 1;
			setCurrentResult(newResult);

			if (selectedCards.current.length === gameRounds[difficult]) {
				isGameWon.current = true;
				setGameOver(true);
				onUpdateBestResult(newResult);
			} else {
				newRound();
			}
		} else if (currentId) {
			onUpdateBestResult(currentResult);
			setGameOver(true);
		}
	}

	function getRandomElements(arr, count) {
		const usedCardsForMix = shuffle(selectedCards.current); // перемешанный массив всех уже использованных карточек
		const currentCardsForMix = numberCardsToMix[selectedCards.current.length]; // количество карт для микса раунда
		const currentShuffledIdCardsForMix = usedCardsForMix.slice(
			0,
			currentCardsForMix,
		); // массив индексов, которые должны быть замешаны в изначальный массив

		console.log(currentShuffledIdCardsForMix); //
		let startArr = currentShuffledIdCardsForMix.map((id) =>
			arr.find((el) => el[0] === Number(id)),
		); // Уже использованные карточки, для замешивания в новый список

		let startId = currentShuffledIdCardsForMix.map((id) =>
			arr.findIndex((el) => el[0] === Number(id)),
		); // Id уже использованных карточкек из оригинального массива изображений, для замешивания в новый список

		const randomElements = [...startArr];
		const usedIndices = new Set(startId); // Добавление индексов, чтобы такие элементы не замешивались в новый список карточек

		while (randomElements.length < count) {
			const randomIndex = Math.floor(Math.random() * arr.length);
			if (!usedIndices.has(randomIndex)) {
				randomElements.push(arr[randomIndex]);
				usedIndices.add(randomIndex);
			}
		}

		return randomElements;
	}

	function shuffle(array) {
		const newArray = [...array];
		for (let i = newArray.length - 1; i > 0; i--) {
			let j = Math.floor(Math.random() * (i + 1));
			[newArray[i], newArray[j]] = [newArray[j], newArray[i]];
		}

		return newArray;
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
		newRound();
	}

	function resetGame() {
		if (!isGameWon.current) {
			setCurrentResult(0);
		}

		selectedCards.current = [];
		isGameWon.current = false;
	}

	return (
		<>
			<div className="game--information">
				<p>Active game</p>
				<p>{`Score: ${currentResult}`}</p>
				<p>{`Best score ${bestResult}`}</p>
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
						isGameWon={isGameWon.current}
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