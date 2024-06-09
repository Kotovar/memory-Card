export function getGameSettings() {
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
		hard: 8,
	};

	const numberCardsToMix = {
		0: 0,
		1: 1,
		2: 1,
		3: 2,
		4: 2,
		5: 3,
		6: 4,
		7: 5,
		8: 6,
		9: 7,
	};

	return {
		NUMBER_OF_ALL_IMAGES,
		FIRST_IMAGE,
		gameRounds,
		gameNumberCardsForRound,
		numberCardsToMix,
	};
}
