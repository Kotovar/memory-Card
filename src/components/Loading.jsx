import PropTypes from 'prop-types';
import loadingImage from '../assets/images/loading.webp';

export default function Loading({
	onloadImagesStart,
	progressValue,
	progressMax,
}) {
	return (
		<>
			<p>
				{onloadImagesStart
					? "It's okay, the game will start soon"
					: 'Loading...'}
			</p>
			<progress max={progressMax} value={progressValue}></progress>
			<img src={loadingImage} alt="Loading animation" />
		</>
	);
}

Loading.propTypes = {
	onloadImagesStart: PropTypes.bool,
	progressValue: PropTypes.number,
	progressMax: PropTypes.number,
};
