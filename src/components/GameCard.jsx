import PropTypes from 'prop-types';
import backImage from '../assets/images/static/test.jpg';

export default function GameCard({name, id, isFlipping, img}) {
	return (
		<div
			className={`game-card ${isFlipping ? 'flip-in-front' : 'flip-out-front'}`}
		>
			<div className={`game-card-front`}>
				<img
					src={img.src}
					alt={`Изображение ${name}`}
					className="gameImage"
					data-id={id}
				/>
				<p>{name}</p>
			</div>

			<div
				className={`game-card-back ${
					isFlipping ? 'flip-in-back' : 'flip-out-back'
				} `}
			>
				<img src={backImage} alt="backside" />
			</div>
		</div>
	);
}

GameCard.propTypes = {
	name: PropTypes.string,
	src: PropTypes.string,
	id: PropTypes.number,
	isFlipping: PropTypes.bool,
	isNew: PropTypes.bool,
	img: PropTypes.object,
};
