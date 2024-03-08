import StartPage from './StartPage';
import ActiveGame from './ActiveGame';
import {useState, useEffect} from 'react';

function App() {
	const initialScore = 0;
	const [bestResult, setBestResult] = useState(loadFromLocalStorage());
	const [difficult, setDifficult] = useState('easy'); // 'easy', 'medium', 'hard'
	const [gameState, setGameState] = useState('start'); // 'start', 'game', 'win', 'defeat'
	const [cards, setCards] = useState([]); // массив всех изображений

	const FIRST_IMAGE = 84;
	const NUMBER_OF_ALL_IMAGES = 80;
	const NUMBER_OF_IMAGES_FOR_LOAD = 10;
	const NUMBER_OF_LOADINGS = Math.ceil(
		NUMBER_OF_ALL_IMAGES / NUMBER_OF_IMAGES_FOR_LOAD,
	);

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

		for (let i = 0; i < NUMBER_OF_LOADINGS; i++) {
			loadImages(FIRST_IMAGE + i * NUMBER_OF_IMAGES_FOR_LOAD);
		}
	}, []);

	async function downloadImages(firstImage) {
		let imagesArray = [];

		for (let i = 0; i < NUMBER_OF_IMAGES_FOR_LOAD; i++) {
			const imageInfo = await getImageNameAndSource(firstImage + i);
			imagesArray.push(imageInfo);
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
				/>
			)}
		</>
	);
}

export default App;
