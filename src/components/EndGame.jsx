import PropTypes from 'prop-types';
import {useRef} from 'react';

export default function EndGame({onChangeMode, onCloseModal, isGameWon}) {
	const dialogRef = useRef(null);

	const closeDialog = (mode) => {
		if (dialogRef.current) dialogRef.current.close();
		onChangeMode(mode);
		onCloseModal();
	};

	return (
		<dialog
			ref={dialogRef}
			id="finishGame"
			aria-label="Show the modal window"
			open
		>
			Game over
			<p>You {isGameWon ? 'Win' : 'Lose'} !</p>
			<button onClick={() => closeDialog('game')}>Start again</button>
			<button onClick={() => closeDialog('start')}>Change difficulty</button>
		</dialog>
	);
}

EndGame.propTypes = {
	onChangeMode: PropTypes.func,
	onCloseModal: PropTypes.func,
};
