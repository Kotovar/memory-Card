import StartPage from './StartPage';
import ActiveGame from './ActiveGame';
import Loading from './Loading';
import {useState, useEffect} from 'react';

function App() {
	const initialScore = 0;
	const [bestResult, setBestResult] = useState(loadFromLocalStorage());
	const [difficult, setDifficult] = useState('easy'); // 'easy', 'medium', 'hard'
	const [gameState, setGameState] = useState('loading'); // 'loading', 'start', 'game', 'win', 'defeat'
	const [loadingFinish, setLoadingFinish] = useState(false); // загрузилось ли минимальное количество изображений
	const [cards, setCards] = useState([]); // массив всех изображений

	const FIRST_IMAGE = 84;
	const LAST_IMAGE = 164;
	const NUMBER_OF_ALL_IMAGES = LAST_IMAGE - FIRST_IMAGE;

	const gameRounds = {
		easy: 5,
		medium: 7,
		hard: 10,
	};

	const gameNumberCardsForRound = {
		easy: 3,
		medium: 5,
		hard: 10,
	};

	useEffect(() => {
		async function loadImages(firstImage) {
			const images = await downloadImages(firstImage);
			setCards((prevCards) => {
				const newImages = images.filter((image) => {
					return !prevCards.some((card) => card[0] === image[0]);
				});
				return [...prevCards, ...newImages];
			});
		}
		for (let i = 0; i < NUMBER_OF_ALL_IMAGES; i++) {
			loadImages(FIRST_IMAGE + i * 1);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	useEffect(() => {
		if (cards.length >= gameNumberCardsForRound['hard'] && !loadingFinish) {
			setLoadingFinish(true);
			setGameState('start');
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [cards]);

	async function downloadImages(firstImage) {
		let imagesArray = [];

		for (let i = 0; i < 1; i++) {
			const imageInfo = await getImageNameAndSource(firstImage + i);
			if (imageInfo) {
				imagesArray.push(imageInfo);
			}
		}
		return imagesArray;
	}

	async function getImageNameAndSource(id) {
		try {
			let creatureResponse = await fetch(
				`https://botw-compendium.herokuapp.com/api/v2/entry/${id}`,
			);

			if (!creatureResponse.ok) {
				throw new Error(`HTTP error! status: ${creatureResponse.status}`);
			}

			let creatureData = await creatureResponse.json();
			let imageUrl = creatureData.data.image;

			return [id, creatureData.data.name, imageUrl];
		} catch (error) {
			console.error('Error when retrieving creature data:', error);
		}
	}

	function changeDifficult(difficult) {
		setDifficult(difficult);
		setGameState('game');
	}

	function changeMode(mode) {
		setGameState(mode);
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
			{gameState === 'loading' && <Loading />}
			{gameState === 'start' && (
				<StartPage onChangeDifficult={changeDifficult} />
			)}
			{gameState === 'game' && (
				<ActiveGame
					difficult={difficult}
					bestResult={bestResult}
					onUpdateBestResult={updateBestResult}
					onChangeMode={changeMode}
					cards={cards}
					gameNumberCardsForRound={gameNumberCardsForRound}
					gameRounds={gameRounds}
				/>
			)}
		</>
	);
}

export default App;
