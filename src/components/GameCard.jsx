import PropTypes from 'prop-types';
import backImage from '../assets/images/test.jpg';

export default function GameCard({url, name, id, isFlipping}) {
	return (
		<div className="game-card">
			<div className="wrapper">
				<div
					className={`game-card-front ${
						isFlipping ? 'flip-in-front' : 'flip-out-front'
					}`}
				>
					<img
						src={url}
						alt={`Изображение ${name}`}
						className="gameImage"
						data-id={id}
						loading="lazy"
					/>
					<p>{`Существо : ${name}`}</p>
				</div>

				<div
					className={`game-card-back ${
						isFlipping ? 'flip-in-back' : 'flip-out-back'
					}`}
				>
					<img src={backImage} alt="backside" />
				</div>
			</div>
		</div>
	);
}

GameCard.propTypes = {
	url: PropTypes.string,
	name: PropTypes.string,
	id: PropTypes.number,
	isFlipping: PropTypes.bool,
	isNew: PropTypes.bool,
};
