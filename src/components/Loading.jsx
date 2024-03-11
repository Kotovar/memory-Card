import loadingImage from '../assets/images/loading.webp';

export default function Loading() {
	return (
		<>
			<p>Loading...</p>
			<img src={loadingImage} alt="Loading animation" />
		</>
	);
}
