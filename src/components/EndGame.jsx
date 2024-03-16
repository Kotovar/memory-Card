import PropTypes from 'prop-types';
import {useRef, useEffect} from 'react';
import winImage from '../assets/images/animated/win.webp';
import loseImage from '../assets/images/animated/lose.webp';

export default function EndGame({onChangeMode, onCloseModal, isGameWon}) {
	const dialogRef = useRef(null);

	const closeDialog = (mode) => {
		if (dialogRef.current) dialogRef.current.close();
		onChangeMode(mode);
		onCloseModal();
	};

	useEffect(() => {
		if (dialogRef.current) dialogRef.current.showModal();
		document.body.style.overflow = 'hidden';

		return () => {
			document.body.style.overflow = 'auto';
		};
	}, []);

	return (
		<dialog
			ref={dialogRef}
			id="finishGame"
			aria-label="Show the modal window"
			aria-modal="true"
		>
			<div className="dialog-message">
				<p className="h2">You {isGameWon ? 'Win' : 'Lose'} !</p>
			</div>
			<div className="dialog-image">
				<img src={isGameWon ? winImage : loseImage} alt="Result image" />
			</div>
			<div className="dialog-buttons">
				<button onClick={() => closeDialog('game')}>Start again</button>
				<button onClick={() => closeDialog('start')}>Change difficulty</button>
			</div>
		</dialog>
	);
}

EndGame.propTypes = {
	onChangeMode: PropTypes.func,
	onCloseModal: PropTypes.func,
	isGameWon: PropTypes.bool,
};
