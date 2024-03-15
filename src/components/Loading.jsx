import PropTypes from 'prop-types';
import loadingImage from '../assets/images/animated/loading.webp';
import loadingRunAnimation from '../assets/images/animated/run.gif';

export default function Loading({
	// onloadImagesStart,
	progressValue,
	progressMax,
	error,
}) {
	return (
		<div className="loading">
			{error ? (
				<h1>{error}</h1>
			) : (
				<>
					<div className="flickering-shield">
						<img src={loadingImage} alt="Loading animation" />
					</div>
					<h1>Mysterious Creatures of Hyrule</h1>
					<div className="progress-bar">
						<img
							src={loadingRunAnimation}
							alt="Loading animation"
							style={{marginLeft: `${progressValue}px`}}
						/>
						<progress
							max={progressMax}
							value={progressValue}
							// value="15"
							aria-label="The game is loading"
						></progress>
					</div>
				</>
			)}
		</div>
	);
}

Loading.propTypes = {
	onloadImagesStart: PropTypes.bool,
	progressValue: PropTypes.number,
	progressMax: PropTypes.number,
	error: PropTypes.string,
};
