import PropTypes from 'prop-types';
import loadingImage from '../assets/images/loading.webp';

export default function Loading({onloadImagesStart, progressValue}) {
	return (
		<>
			<p>
				{onloadImagesStart
					? "It's okay, the game will start soon"
					: 'Loading...'}
			</p>
			<progress max="160" value={progressValue}></progress>
			<img src={loadingImage} alt="Loading animation" />
		</>
	);
}

Loading.propTypes = {
	onloadImagesStart: PropTypes.bool,
	progressValue: PropTypes.number,
};
