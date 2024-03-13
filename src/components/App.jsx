import StartPage from './StartPage';
import ActiveGame from './ActiveGame';
import Loading from './Loading';
import {useState, useEffect} from 'react';

function App() {
	const initialScore = 0;
	const [bestResult, setBestResult] = useState(loadFromLocalStorage());
	const [difficult, setDifficult] = useState('easy'); // 'easy', 'medium', 'hard'
	const [gameState, setGameState] = useState('loading'); // 'loading', 'start', 'У', 'win', 'defeat'
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

	const numberCardsToMix = {
		0: 0,
		1: 1,
		2: 1,
		3: 2,
		4: 2,
		5: 3,
		6: 5,
		7: 6,
		8: 7,
		9: 8,
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
		if (cards.length === NUMBER_OF_ALL_IMAGES && !loadingFinish) {
			setLoadingFinish(true);
			setGameState('start');
			preloadImages(cards); // проверка созданного массива на предзагрузку всех изображений
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
		}
	}

	function preloadImages(imageArray) {
		let loadedCount = 0;
		const totalImages = imageArray.length;

		imageArray.forEach((imgObject) => {
			console.log('пошла загрузка');
			imgObject[2].onload = () => {
				loadedCount++;
				if (loadedCount === totalImages) {
					// Все изображения загружены
					console.log('Все изображения загружены и готовы к использованию.');
					// Здесь можно вызвать функцию обратного вызова или обновить состояние
				}
			};
			// Обработка ошибок на случай, если изображение не может быть загружено
			imgObject[2].onerror = () => {
				console.error(
					`Ошибка при загрузке изображения с URL: ${imgObject.img.src}`,
				);
			};
		});
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
