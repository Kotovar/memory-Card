import PropTypes from 'prop-types';

export default function GameCard({url, name, id}) {
	return (
		<div className="game-card">
			<img
				src={url}
				alt={`Изображение ${name}`}
				className="gameImage"
				data-id={id}
			/>
			<p>{`Существо : ${name}`}</p>
		</div>
	);
}

GameCard.propTypes = {
	url: PropTypes.string,
	name: PropTypes.string,
	id: PropTypes.number,
};
