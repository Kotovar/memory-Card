import PropTypes from 'prop-types';
export default function StartPage({onChangeDifficult}) {
	return (
		<div className="gameContainer">
			<div className="greetings">Select difficulty</div>
			<div className="difficult">
				<button onClick={() => onChangeDifficult('easy')}>easy</button>
				<button onClick={() => onChangeDifficult('medium')}>medium</button>
				<button onClick={() => onChangeDifficult('hard')}>hard</button>
			</div>
		</div>
	);
}

StartPage.propTypes = {
	onChangeDifficult: PropTypes.func,
};
