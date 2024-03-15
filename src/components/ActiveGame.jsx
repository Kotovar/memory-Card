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
	const [isClickable, setIsClickable] = useState(true);

	const [isFlipping, setIsFlipping] = useState(false);

	const selectedCards = useRef([]);
	const isGameWon = useRef(false);
	const DURATION_ANIMATON = 1500;
	const START_DURATION_ANIMATON = DURATION_ANIMATON / 2;

	useEffect(() => {
		setIsFlipping(true);

		const randomCards = getRandomElements(
			cards,
			gameNumberCardsForRound[difficult],
		);

		setCurrentGameCards(randomCards);

		setTimeout(() => {
			setIsFlipping(false);
		}, START_DURATION_ANIMATON);
	}, []);

	function clickImage(e) {
		if (!isClickable) return;
		const currentId = e.target.dataset.id;

		if (currentId && !selectedCards.current.includes(currentId)) {
			selectedCards.current.push(currentId);
			const newResult = currentResult + 1;
			setCurrentResult(newResult);

			if (selectedCards.current.length === gameRounds[difficult]) {
				isGameWon.current = true;
				setGameOver(true);
				onUpdateBestResult(newResult);
				setIsClickable(false);
			} else {
				newRound();
			}
		} else if (currentId) {
			onUpdateBestResult(currentResult);
			setGameOver(true);
			setIsClickable(false);
		}
	}

	function getRandomElements(arr, count) {
		const usedCardsForMix = shuffle(selectedCards.current); // перемешанный массив всех уже использованных карточек
		const currentCardsForMix = numberCardsToMix[selectedCards.current.length]; // количество карт для микса раунда
		const currentShuffledIdCardsForMix = usedCardsForMix.slice(
			0,
			currentCardsForMix,
		); // массив индексов, которые должны быть замешаны в изначальный массив

		let startArr = currentShuffledIdCardsForMix.map((id) =>
			arr.find((el) => el[0] === Number(id)),
		); // Уже использованные карточки, для замешивания в новый список

		let startId = currentShuffledIdCardsForMix.map((id) =>
			arr.findIndex((el) => el[0] === Number(id)),
		); // id уже использованных карточкек из оригинального массива изображений, для замешивания в новый список

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
		setIsClickable(false);
		setIsFlipping(true);

		const randomCards = getRandomElements(
			cards,
			gameNumberCardsForRound[difficult],
		);

		setTimeout(() => {
			setCurrentGameCards(randomCards);
			setIsClickable(true);
			setIsFlipping(false);
		}, DURATION_ANIMATON);
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
			<div className="game">
				<div className="game--information">
					<div className="game-score">
						<p>{`Score: ${currentResult}`}</p>
						<p>{`Best score: ${bestResult}`}</p>
					</div>
					<div className="game-round">
						<p>{`Round ${selectedCards.current.length} / ${gameRounds[difficult]}`}</p>
					</div>
				</div>
				<div className="game--cards" onClick={(e) => clickImage(e)}>
					{currentGameCards.map((el) => (
						// eslint-disable-next-line react/jsx-key
						<GameCard
							id={el[0]}
							name={el[1]}
							img={el[2]}
							isFlipping={isFlipping}
						/>
					))}
				</div>
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
	numberCardsToMix: PropTypes.object,
};
