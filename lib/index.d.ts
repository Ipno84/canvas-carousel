import { CanvasCarouselOptions } from "./typings";
declare class CanvasCarousel {
    private _canvas;
    private _context;
    private _options;
    private _currentIndex;
    private _resizeObserver;
    private _imagesCollection;
    private touch;
    private coors;
    private canvasPosition;
    private canvasRect?;
    private parentWidth;
    private resizeTimeout;
    private oldCanvasWidth?;
    constructor(options: CanvasCarouselOptions);
    get options(): CanvasCarouselOptions;
    get canvas(): HTMLCanvasElement | null;
    get context(): CanvasRenderingContext2D | null | undefined;
    get currentIndex(): number;
    get resizeObserver(): ResizeObserver | null;
    get imagesCollection(): HTMLImageElement[];
    /**
     * It assign to internal canvas class property the proper value using the provided one or the selector
     *
     * @private
     * @memberof CanvasCarousel
     */
    private handleCanvasAssignment;
    /**
     * Asyncronously initialize elements. It's triggered in constructor right after setters and method bindings
     * It will instantiate canvas element and its context, setup sizes of the canvas itself (using options),
     * and fetch remote images. It also trigger a resize observer that will observe the parent node of the canvas
     * in order to fit it if options require this behaviour
     *
     * @private
     * @memberof CanvasCarousel
     */
    private onInit;
    /**
     * It will add all listeners, repeat size setup and draw image in canvas context
     * The callback of the resize observer is triggered by default every 300 milliseconds
     * This option can be changed during instantiation
     *
     * @private
     * @memberof CanvasCarousel
     */
    private onResize;
    /**
     * Normalize canvas position on x axis form responsive point of view
     *
     * @private
     * @memberof CanvasCarousel
     */
    private handleCanvasReduction;
    /**
     * It will track the very first interaction with user
     * After click or touch the method store in class members canvas rect and coordinates in order to use it in other event handlers.
     * It will also start touch or mouse movement listener
     *
     * @private
     * @param {(MouseEvent | TouchEvent)} e
     * @memberof CanvasCarousel
     */
    private onActionStart;
    /**
     * It will be triggered on mouse or touch events end, it will completely destroy event handler
     *
     * @private
     * @memberof CanvasCarousel
     */
    private onActionEnd;
    /**
     * Once the touch has been canceled or mouse leave the element, it triggers the end of the behaviour
     *
     * @private
     * @memberof CanvasCarousel
     */
    private onElementLeave;
    /**
     * The core of the class, it will tracks event positions in order to track delta that has to be applied during images draw.
     * It also take care about current index (useful for external and internal purpose) and redraws images too.
     *
     * @private
     * @param {(MouseEvent | TouchEvent)} e
     * @memberof CanvasCarousel
     */
    private onActionMove;
    /**
     * It set current index changes if needed
     *
     * @private
     * @memberof CanvasCarousel
     */
    private setupCurrentIndex;
    /**
     * In order to have always clean listeners, the method will firstly destroy every used event handlers
     * and then it will start the proper ones again
     *
     * @private
     * @memberof CanvasCarousel
     */
    private addListeners;
    /**
     * Helper method, useful to achieve parent node inner width for responsive purpose
     *
     * @private
     * @param {HTMLElement} node
     * @return {*}  {ImageSizes}
     * @memberof CanvasCarousel
     */
    private innerDimensions;
    /**
     * It will set canvas size using options. If aspectRatio option's provided it will use it to retrieve responsive behaviour
     * If canvasHeight and canvasWidth are provided, instead, it will use it without responsive any behaviour
     *
     * @private
     * @memberof CanvasCarousel
     */
    private setupSize;
    /**
     * It fetch remote images and draw image once every image has been downloaded
     *
     * @private
     * @return {*}
     * @memberof CanvasCarousel
     */
    private prepareImages;
    /**
     * This method handle image aspect ratio in order to render them properly in every slide inside the canvas element
     *
     * @private
     * @param {HTMLImageElement} image
     * @return {*}  {ImageSizes}
     * @memberof CanvasCarousel
     */
    private getNormalizedImageSizes;
    /**
     * This method is used to properly set images at the very center of the slide
     *
     * @private
     * @param {number} width
     * @param {number} height
     * @return {*}  {IDeltas}
     * @memberof CanvasCarousel
     */
    private getDeltas;
    /**
     * Generic method the move the canvas to the provided image index
     *
     * @param {number} index
     * @memberof CanvasCarousel
     */
    goToIndex(index: number): void;
    /**
     * It use goToIndex method to move the canvas carousel to the next slide
     *
     * @memberof CanvasCarousel
     */
    goToNext(): void;
    /**
     * It use goToIndex method to move the canvas carousel to the previous slide
     *
     * @memberof CanvasCarousel
     */
    goToPrev(): void;
    /**
     * It use goToIndex method to move the canvas carousel to the first slide
     *
     * @memberof CanvasCarousel
     */
    goToFirst(): void;
    /**
     * It use goToIndex method to move the canvas carousel to the last slide
     *
     * @memberof CanvasCarousel
     */
    goToLast(): void;
    /**
     * This method will draw images in canvas context setting properly deltas, sizes and positioning
     *
     * @private
     * @memberof CanvasCarousel
     */
    private drawImages;
}
export { CanvasCarousel };
