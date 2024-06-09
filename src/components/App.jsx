import StartPage from './StartPage';
import ActiveGame from './ActiveGame';
import Loading from './Loading';
import {useState, useEffect} from 'react';
import {getGameSettings} from '../utils/getGameSettings';

function App() {
	const initialScore = 0;
	const [bestResult, setBestResult] = useState(loadFromLocalStorage());
	const [difficult, setDifficult] = useState('easy');
	const [gameState, setGameState] = useState('loading');
	const [onloadImagesFinish, setOnloadImagesFinish] = useState(false);
	const [onloadImagesStart, setOnloadImagesStart] = useState(false);
	const [loadedImages, setLoadedImages] = useState(0);
	const [cards, setCards] = useState([]);
	const [brightness, setBrightness] = useState(100);
	const {
		NUMBER_OF_ALL_IMAGES,
		FIRST_IMAGE,
		gameRounds,
		gameNumberCardsForRound,
		numberCardsToMix,
	} = getGameSettings();

	useEffect(() => {
		document.body.style.backdropFilter = `brightness(${brightness}%)`;
	}, [brightness]);

	useEffect(() => {
		async function downloadImages(firstImage) {
			const imagesArray = [];

			for (let i = 0; i < 1; i++) {
				const imageInfo = await getImageNameAndSource(firstImage + i);

				if (imageInfo) {
					imagesArray.push(imageInfo);
				}
			}

			return imagesArray;
		}

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
	}, [FIRST_IMAGE, NUMBER_OF_ALL_IMAGES]);

	useEffect(() => {
		function preloadImages(imageArray) {
			let loadedCount = 0;
			const totalImages = imageArray.length;

			imageArray.forEach((imgObject) => {
				const img = new Image();

				img.onload = () => {
					loadedCount++;
					updateLoadingState(loadedCount, totalImages);
				};

				img.onerror = () => {
					setGameState('loadingError');
					console.error(`Ошибка при загрузке изображения с URL: ${img.src}`);
				};

				img.src = imgObject[2].src;

				if (img.complete) {
					loadedCount++;
					updateLoadingState(loadedCount, totalImages);
				}
			});
		}

		function updateLoadingState(loadedCount, totalImages) {
			setLoadedImages(loadedCount);
			if (loadedCount === totalImages) {
				setOnloadImagesFinish(true);
			}
		}

		if (cards.length === NUMBER_OF_ALL_IMAGES && !onloadImagesStart) {
			preloadImages(cards);
			setOnloadImagesStart(true);
		}
	}, [NUMBER_OF_ALL_IMAGES, cards, onloadImagesStart]);

	useEffect(() => {
		if (onloadImagesFinish) {
			setGameState('start');
			changeBrightness(100);
		}
	}, [onloadImagesFinish]);

	const changeBrightness = (newBrightness) => {
		setBrightness(newBrightness);
	};

	async function getImageNameAndSource(id) {
		try {
			const creatureResponse = await fetch(
				`https://botw-compendium.herokuapp.com/api/v2/entry/${id}`,
			);

			if (!creatureResponse.ok) {
				throw new Error(`HTTP error! status: ${creatureResponse.status}`);
			}

			const creatureData = await creatureResponse.json();
			const imageUrl = creatureData.data.image;

			const img = new Image();
			img.src = imageUrl;

			return [id, creatureData.data.name, img];
		} catch (error) {
			console.error('Error when retrieving creature data:', error);
			setGameState('loadingError');
		}
	}

	function changeDifficult(difficult) {
		setDifficult(difficult);
		setGameState('game');
		changeBrightness(75);
	}

	function changeMode(mode) {
		setGameState(mode);
		if (mode === 'start') {
			changeBrightness(100);
		}
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

		return retrievedJSON ? JSON.parse(retrievedJSON) : initialScore;
	}

	return (
		<>
			{(gameState === 'loading' || gameState === 'loadingError') && (
				<Loading
					onloadImagesStart={onloadImagesStart}
					progressValue={cards.length + loadedImages}
					progressMax={NUMBER_OF_ALL_IMAGES * 2}
					error={
						gameState === 'loadingError'
							? 'There was a loading error, please reload the page'
							: ''
					}
				/>
			)}
			{gameState === 'start' && (
				<StartPage onChangeDifficult={changeDifficult} />
			)}
			{gameState === 'game' && (
				<ActiveGame
					difficult={difficult}
					bestResult={bestResult}
					cards={cards}
					gameRounds={gameRounds}
					gameNumberCardsForRound={gameNumberCardsForRound}
					numberCardsToMix={numberCardsToMix}
					onChangeMode={changeMode}
					onUpdateBestResult={updateBestResult}
				/>
			)}
		</>
	);
}

export default App;
