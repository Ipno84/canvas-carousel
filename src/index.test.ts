import 'jest-canvas-mock';

import * as ResizeObserverModule from 'resize-observer-polyfill';

import { CanvasCarousel } from './index';
import { CanvasCarouselOptions } from './typings';

(global as any).ResizeObserver = ResizeObserverModule.default;

const selector = '#carousel'
const imagesPath: string[] = [0,1,2,3].map((imageName) => `http://challenge.publitas.com/images/${imageName}.jpg`)
const baseOptions: CanvasCarouselOptions = { selector, imagesPath, aspectRatio: 0.6, resizeTimeoutReaction: 1 }
const baseHTML = `<div style="padding: 30px;" id="canvas-container">
	<canvas id="carousel" width="150" height="150"></canvas>
	<button type="button" id="prev">Prev</button>
	<button type="button" id="next">Next</button>
	<button type="button" id="first">First</button>
	<button type="button" id="last">Last</button>
</div>`

describe('Canvas carousel module', () => {

	beforeAll(() => {
		CanvasCarousel.prototype['prepareImages'] = jest.fn().mockImplementation(() => null);
	})

	beforeEach(() => {
		document.body.innerHTML = baseHTML;
	})

	afterEach(() => {
		document.body.innerHTML = ''
	})

	test('Check selector', () => {
		const canvasCarousel = new CanvasCarousel(baseOptions);
		expect(canvasCarousel.options.selector).toBe(selector);
	});

	test('Check images', () => {
		const canvasCarousel = new CanvasCarousel(baseOptions);
		expect(canvasCarousel.options.imagesPath).toMatchObject(imagesPath);
	});

	test('Check options', () => {
		const canvasCarousel = new CanvasCarousel(baseOptions);
		expect(canvasCarousel.options).toMatchObject({ selector, imagesPath, aspectRatio: 0.6, resizeTimeoutReaction: 1 });
	});

	test('Check onInit called', () => {
		let tmpMethod = CanvasCarousel.prototype['onInit']

		CanvasCarousel.prototype['onInit'] = jest.fn().mockImplementation(() => void 0);

		new CanvasCarousel(baseOptions);

		expect(CanvasCarousel.prototype['onInit']).toHaveBeenCalled()

		CanvasCarousel.prototype['onInit'] = tmpMethod
	});


	test('Check canvas set', () => {
		const canvasCarousel = new CanvasCarousel(baseOptions);
		expect(canvasCarousel.canvas).toBeInstanceOf(HTMLCanvasElement);
	});

	test('Check context set', () => {
		const canvasCarousel = new CanvasCarousel(baseOptions);
		expect(canvasCarousel.context).toBeInstanceOf(CanvasRenderingContext2D);
	});

	test('Check initial currentIndex', () => {
		const canvasCarousel = new CanvasCarousel(baseOptions);
		expect(canvasCarousel.currentIndex).toBe(0);
	});

	test('Check setupSize called', () => {
		let tmpMethod = CanvasCarousel.prototype['setupSize']

		CanvasCarousel.prototype['setupSize'] = jest.fn().mockImplementation(() => void 0);

		new CanvasCarousel(baseOptions);

		expect(CanvasCarousel.prototype['setupSize']).toHaveBeenCalled()

		CanvasCarousel.prototype['setupSize'] = tmpMethod
	});

	test('Check canvas dimensions - with static dimensions options', () => {
		const canvasCarousel = new CanvasCarousel({ ...baseOptions, aspectRatio: void 0, canvasWidth: 600, canvasHeight: 400 });
		expect(canvasCarousel.canvas?.width).toBe(600)
		expect(canvasCarousel.canvas?.height).toBe(400)
	});

	test('Check canvas dimensions - get inner dimensions', () => {
		const canvasCarousel = new CanvasCarousel(baseOptions);
		const canvasContainer = canvasCarousel.canvas?.parentNode as HTMLElement

		if (canvasContainer) {
			const mockCanvasContainerWidth = jest.spyOn(canvasContainer, 'clientWidth', 'get').mockImplementation(() => 600);
			const mockCanvasContainerHeight = jest.spyOn(canvasContainer, 'clientHeight', 'get').mockImplementation(() => 400);

			const dimensions = canvasCarousel['innerDimensions'](canvasContainer)

			expect(dimensions).toMatchObject({ width: 540, height: 340 })

			mockCanvasContainerWidth.mockReset()
			mockCanvasContainerHeight.mockReset()
		}

		expect(canvasContainer).toBeInstanceOf(Node)
	});

	test('Check canvas dimensions - with aspectRatio', () => {
		let tmpMethod = CanvasCarousel.prototype['innerDimensions']

		CanvasCarousel.prototype['innerDimensions'] = jest.fn().mockImplementation(() => ({ width: 540, height: 340 }));

		const canvasCarousel = new CanvasCarousel(baseOptions);
		const canvasContainer = canvasCarousel.canvas?.parentNode as HTMLElement

		if (canvasCarousel) {
			expect(canvasCarousel['parentWidth']).toBe(540)
			expect(canvasCarousel.canvas?.width).toBe(540)
			expect(canvasCarousel.canvas?.height).toBe(324)
		}
		expect(canvasContainer).toBeInstanceOf(Node)

		CanvasCarousel.prototype['innerDimensions'] = tmpMethod
	});

	test('Check prepareImages called', () => {
		new CanvasCarousel(baseOptions);
		expect(CanvasCarousel.prototype['prepareImages']).toHaveBeenCalled()
	});

	test('Check images collection', () => {
		const canvasCarousel = new CanvasCarousel(baseOptions);

		const mockImagesCollection = jest.spyOn(canvasCarousel, 'imagesCollection', 'get').mockImplementation(() => imagesPath.map((src) => {
			const imageName = src.split('/')[src.split('/').length - 1]
			const localImage = require('./assets/images/' + imageName)
			return localImage
		}));

		expect(canvasCarousel['imagesCollection'].length).toBe(4);

		mockImagesCollection.mockReset()
	});

	test('Check resize observer - with defined aspectRatio', () => {
		const canvasCarousel = new CanvasCarousel(baseOptions);
		expect(canvasCarousel.resizeObserver).toBeInstanceOf(ResizeObserver);
	});

	test('Check resize observer - with undefined aspectRatio', () => {
		const canvasCarousel = new CanvasCarousel({ ...baseOptions, aspectRatio: void 0 });
		expect(canvasCarousel.resizeObserver).not.toBeInstanceOf(ResizeObserver)
	});

	test('Canvas scroll - go to next from 0', () => {
		const canvasCarousel = new CanvasCarousel(baseOptions);
		expect(canvasCarousel['canvasPosition']['deltaX']).toBe(0)
		canvasCarousel.goToNext()
		expect(canvasCarousel['canvasPosition']['deltaX']).toBe(-300)
		canvasCarousel.goToNext()
		expect(canvasCarousel['canvasPosition']['deltaX']).toBe(-600)
		canvasCarousel.goToNext()
		expect(canvasCarousel['canvasPosition']['deltaX']).toBe(-900)
		canvasCarousel.goToNext()
		expect(canvasCarousel['canvasPosition']['deltaX']).toBe(-900)
	});

	test('Canvas scroll - go to prev from 0', () => {
		const canvasCarousel = new CanvasCarousel(baseOptions);
		expect(canvasCarousel['canvasPosition']['deltaX']).toBe(0)
		canvasCarousel.goToPrev()
		expect(canvasCarousel['canvasPosition']['deltaX']).toBe(0)
	});

	test('Canvas scroll - go to right index', () => {
		const canvasCarousel = new CanvasCarousel(baseOptions);
		expect(canvasCarousel['canvasPosition']['deltaX']).toBe(0)
		canvasCarousel.goToIndex(3)
		expect(canvasCarousel['canvasPosition']['deltaX']).toBe(-900)
	});

	test('Canvas scroll - go to wrong index', () => {
		const canvasCarousel = new CanvasCarousel(baseOptions);
		expect(canvasCarousel['canvasPosition']['deltaX']).toBe(0)
		canvasCarousel.goToIndex(6)
		expect(canvasCarousel['canvasPosition']['deltaX']).toBe(0)
	});
});
