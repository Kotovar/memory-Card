import PropTypes from 'prop-types';

export default function GameCard({cardId}) {
	return <p>{`Это игровая карточка номер: ${cardId}`}</p>;
}

GameCard.propTypes = {
	cardId: PropTypes.number,
};
