import { CanvasCarousel } from './index';

const baseOptions = {
	selector: '#carousel',
	imagesPath: [
		'http://challenge.publitas.com/images/0.jpg',
		'http://challenge.publitas.com/images/1.jpg',
		'http://challenge.publitas.com/images/2.jpg',
		'http://challenge.publitas.com/images/3.jpg'
	],
	resizeTimeoutReaction: 1
};

const staticSizesOptions = {
	...baseOptions,
	canvasWidth: 200,
	canvasHeight: 200
};

const responsiveOptions = {
	...baseOptions,
	aspectRatio: 0.6
};

const canvasCarousel = new CanvasCarousel(responsiveOptions);

const buttonNext = document.getElementById('next');
const buttonPrev = document.getElementById('prev');
const buttonFirst = document.getElementById('first');
const buttonLast = document.getElementById('last');

buttonNext?.addEventListener('click', e => {
	e.preventDefault();
	canvasCarousel.goToNext();
});

buttonPrev?.addEventListener('click', e => {
	e.preventDefault();
	canvasCarousel.goToPrev();
});

buttonFirst?.addEventListener('click', e => {
	e.preventDefault();
	canvasCarousel.goToIndex(0);
});

buttonLast?.addEventListener('click', e => {
	e.preventDefault();
	canvasCarousel.goToIndex(canvasCarousel.options.imagesPath.length - 1);
});

export {};
