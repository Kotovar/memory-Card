import PropTypes from 'prop-types';

export default function GameCard({url, name}) {
	return (
		<div className="game-card">
			<img src={url} alt={`Изображение ${name}`} />
			<p>{`Существо : ${name}`}</p>
		</div>
	);
}

GameCard.propTypes = {
	url: PropTypes.string,
	name: PropTypes.string,
};
