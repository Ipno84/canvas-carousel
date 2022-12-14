import { CanvasCarouselOptions, IDeltas, ImageSizes } from "./typings"

class CanvasCarousel {
    private _canvas: HTMLCanvasElement | null = null
    private _context: CanvasRenderingContext2D | null | undefined = null
    private _options: CanvasCarouselOptions = { selector: '', imagesPath: [] }
    private _currentIndex: number = 0
    private _resizeObserver: ResizeObserver | null = null
    private _imagesCollection: HTMLImageElement[] = []
    private touch: boolean = navigator.maxTouchPoints > 0;
    private coors: { clientX?: number, x?: number } = {}
    private canvasPosition: { deltaX?: number } = { deltaX: 0 }
    private canvasRect?: DOMRect
    private parentWidth: number | void = void 0
    private resizeTimeout: ReturnType<typeof setTimeout> | null = null
    private oldCanvasWidth?: number = void 0

	constructor(options: CanvasCarouselOptions) {
        this.onResize = this.onResize.bind(this)
        this.onActionStart = this.onActionStart.bind(this)
        this.onActionEnd = this.onActionEnd.bind(this)
        this.onElementLeave = this.onElementLeave.bind(this)
        this.onActionMove = this.onActionMove.bind(this)

        this._options = options

        this.onInit()
    }

    public get options(): CanvasCarouselOptions {
        return this._options
    }

    public get canvas(): HTMLCanvasElement | null {
        return this._canvas
    }

    public get context(): CanvasRenderingContext2D | null | undefined {
        return this._context
    }

    public get currentIndex(): number {
        return this._currentIndex
    }

    public get resizeObserver(): ResizeObserver | null {
        return this._resizeObserver
    }

    public get imagesCollection(): HTMLImageElement[] {
        return this._imagesCollection
    }

    /**
     * It assign to internal canvas class property the proper value using the provided one or the selector
     *
     * @private
     * @memberof CanvasCarousel
     */
    private handleCanvasAssignment(): void {
        if(this.options.node && this.options.node instanceof HTMLCanvasElement) {
            this._canvas = this.options.node
        } else if(this.options.selector) {
            this._canvas = document.querySelector(this.options.selector)
        }
    }

    /**
     * Asyncronously initialize elements. It's triggered in constructor right after setters and method bindings
     * It will instantiate canvas element and its context, setup sizes of the canvas itself (using options),
     * and fetch remote images. It also trigger a resize observer that will observe the parent node of the canvas
     * in order to fit it if options require this behaviour
     *
     * @private
     * @memberof CanvasCarousel
     */
    private onInit(): void {
        this.handleCanvasAssignment()
        this._context = this.canvas?.getContext('2d')

        if(this.context) this.context.imageSmoothingEnabled = true
        
        this.setupSize()
        this.prepareImages()

        if(this.canvas?.parentElement) {
            this._resizeObserver = new ResizeObserver(this.onResize);
            this.resizeObserver?.observe(this.canvas.parentElement);
        }
    }

    /**
     * It will add all listeners, repeat size setup and draw image in canvas context
     * The callback of the resize observer is triggered by default every 300 milliseconds
     * This option can be changed during instantiation
     *
     * @private
     * @memberof CanvasCarousel
     */
    private onResize(): void {
        if(this.resizeTimeout) clearTimeout(this.resizeTimeout)
        if(this.options.aspectRatio && !this.oldCanvasWidth && this.canvas?.width) {
            this.oldCanvasWidth = this.canvas?.width
        }
        this.touch = navigator.maxTouchPoints > 0
        this.resizeTimeout = setTimeout(() => {
            this.addListeners()
            this.setupSize()
            this.handleCanvasReduction()
            this.drawImages()
        }, this.options.resizeTimeoutReaction ?? 300)
    }

    /**
     * Normalize canvas position on x axis form responsive point of view
     *
     * @private
     * @memberof CanvasCarousel
     */
    private handleCanvasReduction(): void {
        if(this.options.aspectRatio && this.canvas && this.oldCanvasWidth) {
            const diff = this.oldCanvasWidth - this.canvas.width
            const percentage = ((diff * 100) / this.oldCanvasWidth) / 100
            if(!this.canvasPosition.deltaX) this.canvasPosition.deltaX = 0
            this.canvasPosition.deltaX = this.canvasPosition.deltaX - (this.canvasPosition.deltaX * percentage)
            this.oldCanvasWidth = void 0
        }
    }

    /**
     * It will track the very first interaction with user
     * After click or touch the method store in class members canvas rect and coordinates in order to use it in other event handlers.
     * It will also start touch or mouse movement listener
     *
     * @private
     * @param {(MouseEvent | TouchEvent)} e
     * @memberof CanvasCarousel
     */
    private onActionStart(e: MouseEvent | TouchEvent): void {
        e.preventDefault()
        this.canvasRect = this.canvas?.getBoundingClientRect()
        const event = this.touch && e instanceof TouchEvent ? e.touches[0] : e as MouseEvent
        this.coors.clientX = (event.clientX - (this.canvasRect?.left ?? 0)) - (this.canvasPosition.deltaX ?? 0);
        this.canvas?.addEventListener(this.touch ? 'touchmove' : 'mousemove', this.onActionMove)
    }

    /**
     * It will be triggered on mouse or touch events end, it will completely destroy event handler
     *
     * @private
     * @memberof CanvasCarousel
     */
    private onActionEnd(): void {
        this.canvas?.removeEventListener(this.touch ? 'touchmove' : 'mousemove', this.onActionMove)
    }

    /**
     * Once the touch has been canceled or mouse leave the element, it triggers the end of the behaviour
     *
     * @private
     * @memberof CanvasCarousel
     */
    private onElementLeave(): void {
        this.canvas?.dispatchEvent(new Event('mouseup'))
        this.canvas?.dispatchEvent(new Event('touchend'))
    }

    /**
     * The core of the class, it will tracks event positions in order to track delta that has to be applied during images draw.
     * It also take care about current index (useful for external and internal purpose) and redraws images too.
     *
     * @private
     * @param {(MouseEvent | TouchEvent)} e
     * @memberof CanvasCarousel
     */
    private onActionMove(e: MouseEvent | TouchEvent): void {
        e.preventDefault()
        const lastXPosition = (-(this.canvas?.width ?? 0) * (this.options.imagesPath.length - 1))
        const event = this.touch && e instanceof TouchEvent ? e.touches[0] : e as MouseEvent
        this.coors.x = event.clientX - (this.canvasRect?.left ?? 0);
        this.canvasPosition.deltaX = (this.coors.x - (this.coors.clientX ?? 0));
        if (this.canvasPosition.deltaX > 0) {
            this.canvasPosition.deltaX = 0;
        } else if (this.canvasPosition.deltaX < lastXPosition ) {
            this.canvasPosition.deltaX = lastXPosition;
        }
        this.setupCurrentIndex()
        this.drawImages()
    }

    /**
     * It set current index changes if needed
     *
     * @private
     * @memberof CanvasCarousel
     */
    private setupCurrentIndex(): void {
        if(this.canvas && typeof this.canvasPosition.deltaX !== 'undefined') {
            const nextIndex = Math.round((Math.abs(this.canvasPosition.deltaX) + this.canvas.width) / this.canvas.width) - 1
            if (nextIndex !== this.currentIndex) {
                this._currentIndex = nextIndex
            }
        }
    }

    /**
     * In order to have always clean listeners, the method will firstly destroy every used event handlers
     * and then it will start the proper ones again
     *
     * @private
     * @memberof CanvasCarousel
     */
    private addListeners(): void {
        if(this.canvas) {
            const start = this.touch ? 'touchstart' : 'mousedown'
            const end = this.touch ? 'touchend' : 'mouseup'
            const cancel = this.touch ? 'touchcancel' : 'mouseleave'

            this.canvas.removeEventListener('touchstart', this.onActionStart)
            this.canvas.removeEventListener('mousedown', this.onActionStart)
            this.canvas.removeEventListener('touchend', this.onActionEnd)
            this.canvas.removeEventListener('mouseup', this.onActionEnd)
            this.canvas.removeEventListener('touchcancel', this.onElementLeave)
            this.canvas.removeEventListener('mouseleave', this.onElementLeave)

            this.canvas.addEventListener(start, this.onActionStart)
            this.canvas.addEventListener(end, this.onActionEnd)
            this.canvas.addEventListener(cancel, this.onElementLeave)
        }
    }

    /**
     * Helper method, useful to achieve parent node inner width for responsive purpose
     *
     * @private
     * @param {HTMLElement} node
     * @return {*}  {ImageSizes}
     * @memberof CanvasCarousel
     */
    private innerDimensions(node: HTMLElement): ImageSizes {
        const computedStyle = getComputedStyle(node)

        let width = node.clientWidth
        let height = node.clientHeight

        height -= Number.parseFloat(computedStyle.paddingTop) + Number.parseFloat(computedStyle.paddingBottom)
        width -= Number.parseFloat(computedStyle.paddingLeft) + Number.parseFloat(computedStyle.paddingRight)

        return { height, width }
    }

    /**
     * It will set canvas size using options. If aspectRatio option's provided it will use it to retrieve responsive behaviour
     * If canvasHeight and canvasWidth are provided, instead, it will use it without responsive any behaviour
     *
     * @private
     * @memberof CanvasCarousel
     */
    private setupSize(): void {
        if(this.canvas && this.options.aspectRatio) {
            const parentNode = this.canvas.parentNode as HTMLElement | undefined
            if(parentNode) {
                this.parentWidth = this.innerDimensions(parentNode).width
                this.canvas.width = this.parentWidth
                this.canvas.height = this.parentWidth * this.options.aspectRatio
            }
        } else if(this.canvas && this.options.canvasHeight && this.options.canvasWidth) {
            this.canvas.width = this.options.canvasWidth
            this.canvas.height = this.options.canvasHeight
        }
    }

    /**
     * It fetch remote images and draw image once every image has been downloaded
     *
     * @private
     * @return {*} 
     * @memberof CanvasCarousel
     */
    private prepareImages(): void {
        this.options.imagesPath.forEach((src, index) => {
            const image = new Image()
            image.src = src
            image.onload = () => {
                this._imagesCollection[index] = image
                this.drawImages()
            }
        })
        
    }

    /**
     * This method handle image aspect ratio in order to render them properly in every slide inside the canvas element
     *
     * @private
     * @param {HTMLImageElement} image
     * @return {*}  {ImageSizes}
     * @memberof CanvasCarousel
     */
    private getNormalizedImageSizes(image: HTMLImageElement): ImageSizes {
        if(this.canvas) {
            const imageAspectRatio = image.width / image.height
            if(imageAspectRatio > 1) {
                return {
                    width: this.canvas.width,
                    height: this.canvas.width / imageAspectRatio
                }
            } else {
                return {
                    width: this.canvas.height * imageAspectRatio,
                    height: this.canvas.height
                }
            }
        }
        return {
            width: 0,
            height: 0
        }
    }

    /**
     * This method is used to properly set images at the very center of the slide
     *
     * @private
     * @param {number} width
     * @param {number} height
     * @return {*}  {IDeltas}
     * @memberof CanvasCarousel
     */
    private getDeltas(width: number, height: number): IDeltas {
        if(!this.canvas) {
            return {
                x: 0,
                y: 0
            }
        }
        return {
            x: (this.canvas.width - width) / 2,
            y: (this.canvas.height - height) / 2
        }
    }

    /**
     * Generic method the move the canvas to the provided image index
     *
     * @param {number} index
     * @memberof CanvasCarousel
     */
    public goToIndex(index: number): void {
        if (this.canvas && index >= 0 && index < this.options.imagesPath.length) {
            const delta = 0 - (this.canvas.width * index)
            this.canvasPosition.deltaX = delta
            this.drawImages()
            this.setupCurrentIndex()
        }
    }

    /**
     * It use goToIndex method to move the canvas carousel to the next slide
     *
     * @memberof CanvasCarousel
     */
    public goToNext(): void {
        this.goToIndex(this.currentIndex + 1)
    }

    /**
     * It use goToIndex method to move the canvas carousel to the previous slide
     *
     * @memberof CanvasCarousel
     */
    public goToPrev(): void {
        this.goToIndex(this.currentIndex - 1)
    }

    /**
     * It use goToIndex method to move the canvas carousel to the first slide
     *
     * @memberof CanvasCarousel
     */
     public goToFirst(): void {
        this.goToIndex(0)
    }

    /**
     * It use goToIndex method to move the canvas carousel to the last slide
     *
     * @memberof CanvasCarousel
     */
     public goToLast(): void {
        this.goToIndex(this.options.imagesPath.length - 1)
    }

    /**
     * This method will draw images in canvas context setting properly deltas, sizes and positioning
     *
     * @private
     * @memberof CanvasCarousel
     */
    private drawImages(): void {
        this.context?.clearRect(0, 0, this.canvas?.width ?? 0, this.canvas?.height ?? 0);
        this._imagesCollection.forEach((image, index) => {
            if(this.canvas) {
                const { width, height } = this.getNormalizedImageSizes(image)
                const { x, y } = this.getDeltas(width, height)
                this.context?.drawImage(
                    image,
                    (this.canvas.width * index) + x + (this.canvasPosition.deltaX ?? 0),
                    y,
                    width,
                    height
                )
            }
        })
    }
}

export { CanvasCarousel };
