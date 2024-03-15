import PropTypes from 'prop-types';
export default function StartPage({onChangeDifficult}) {
	return (
		<div className="gameContainer">
			<div className="gameContainer-block">
				<p className="greetings h2">Select difficulty</p>
				<div className="difficult">
					<button onClick={() => onChangeDifficult('easy')}>easy</button>
					<button onClick={() => onChangeDifficult('medium')}>medium</button>
					<button onClick={() => onChangeDifficult('hard')}>hard</button>
				</div>
			</div>
		</div>
	);
}

StartPage.propTypes = {
	onChangeDifficult: PropTypes.func,
};
