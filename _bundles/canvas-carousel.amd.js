define("canvas-carousel", [], () => { return /******/ (() => { // webpackBootstrap
/******/ 	"use strict";
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it uses a non-standard name for the exports (exports).
(() => {
var exports = __webpack_exports__;

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.CanvasCarousel = void 0;
var CanvasCarousel = /** @class */ (function () {
    function CanvasCarousel(options) {
        this._canvas = null;
        this._context = null;
        this._options = { selector: '', imagesPath: [] };
        this._currentIndex = 0;
        this._resizeObserver = null;
        this._imagesCollection = [];
        this.touch = navigator.maxTouchPoints > 0;
        this.coors = {};
        this.canvasPosition = { deltaX: 0 };
        this.parentWidth = void 0;
        this.resizeTimeout = null;
        this.oldCanvasWidth = void 0;
        this.onResize = this.onResize.bind(this);
        this.onActionStart = this.onActionStart.bind(this);
        this.onActionEnd = this.onActionEnd.bind(this);
        this.onElementLeave = this.onElementLeave.bind(this);
        this.onActionMove = this.onActionMove.bind(this);
        this._options = options;
        this.onInit();
    }
    Object.defineProperty(CanvasCarousel.prototype, "options", {
        get: function () {
            return this._options;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(CanvasCarousel.prototype, "canvas", {
        get: function () {
            return this._canvas;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(CanvasCarousel.prototype, "context", {
        get: function () {
            return this._context;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(CanvasCarousel.prototype, "currentIndex", {
        get: function () {
            return this._currentIndex;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(CanvasCarousel.prototype, "resizeObserver", {
        get: function () {
            return this._resizeObserver;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(CanvasCarousel.prototype, "imagesCollection", {
        get: function () {
            return this._imagesCollection;
        },
        enumerable: false,
        configurable: true
    });
    /**
     * It assign to internal canvas class property the proper value using the provided one or the selector
     *
     * @private
     * @memberof CanvasCarousel
     */
    CanvasCarousel.prototype.handleCanvasAssignment = function () {
        if (this.options.node && this.options.node instanceof HTMLCanvasElement) {
            this._canvas = this.options.node;
        }
        else if (this.options.selector) {
            this._canvas = document.querySelector(this.options.selector);
        }
    };
    /**
     * Asyncronously initialize elements. It's triggered in constructor right after setters and method bindings
     * It will instantiate canvas element and its context, setup sizes of the canvas itself (using options),
     * and fetch remote images. It also trigger a resize observer that will observe the parent node of the canvas
     * in order to fit it if options require this behaviour
     *
     * @private
     * @memberof CanvasCarousel
     */
    CanvasCarousel.prototype.onInit = function () {
        var _a, _b, _c;
        this.handleCanvasAssignment();
        this._context = (_a = this.canvas) === null || _a === void 0 ? void 0 : _a.getContext('2d');
        if (this.context)
            this.context.imageSmoothingEnabled = true;
        this.setupSize();
        this.prepareImages();
        if ((_b = this.canvas) === null || _b === void 0 ? void 0 : _b.parentElement) {
            this._resizeObserver = new ResizeObserver(this.onResize);
            (_c = this.resizeObserver) === null || _c === void 0 ? void 0 : _c.observe(this.canvas.parentElement);
        }
    };
    /**
     * It will add all listeners, repeat size setup and draw image in canvas context
     * The callback of the resize observer is triggered by default every 300 milliseconds
     * This option can be changed during instantiation
     *
     * @private
     * @memberof CanvasCarousel
     */
    CanvasCarousel.prototype.onResize = function () {
        var _this = this;
        var _a, _b, _c;
        if (this.resizeTimeout)
            clearTimeout(this.resizeTimeout);
        if (this.options.aspectRatio && !this.oldCanvasWidth && ((_a = this.canvas) === null || _a === void 0 ? void 0 : _a.width)) {
            this.oldCanvasWidth = (_b = this.canvas) === null || _b === void 0 ? void 0 : _b.width;
        }
        this.touch = navigator.maxTouchPoints > 0;
        this.resizeTimeout = setTimeout(function () {
            _this.addListeners();
            _this.setupSize();
            _this.handleCanvasReduction();
            _this.drawImages();
        }, (_c = this.options.resizeTimeoutReaction) !== null && _c !== void 0 ? _c : 300);
    };
    /**
     * Normalize canvas position on x axis form responsive point of view
     *
     * @private
     * @memberof CanvasCarousel
     */
    CanvasCarousel.prototype.handleCanvasReduction = function () {
        if (this.options.aspectRatio && this.canvas && this.oldCanvasWidth) {
            var diff = this.oldCanvasWidth - this.canvas.width;
            var percentage = ((diff * 100) / this.oldCanvasWidth) / 100;
            if (!this.canvasPosition.deltaX)
                this.canvasPosition.deltaX = 0;
            this.canvasPosition.deltaX = this.canvasPosition.deltaX - (this.canvasPosition.deltaX * percentage);
            this.oldCanvasWidth = void 0;
        }
    };
    /**
     * It will track the very first interaction with user
     * After click or touch the method store in class members canvas rect and coordinates in order to use it in other event handlers.
     * It will also start touch or mouse movement listener
     *
     * @private
     * @param {(MouseEvent | TouchEvent)} e
     * @memberof CanvasCarousel
     */
    CanvasCarousel.prototype.onActionStart = function (e) {
        var _a, _b, _c, _d, _e;
        e.preventDefault();
        this.canvasRect = (_a = this.canvas) === null || _a === void 0 ? void 0 : _a.getBoundingClientRect();
        var event = this.touch && e instanceof TouchEvent ? e.touches[0] : e;
        this.coors.clientX = (event.clientX - ((_c = (_b = this.canvasRect) === null || _b === void 0 ? void 0 : _b.left) !== null && _c !== void 0 ? _c : 0)) - ((_d = this.canvasPosition.deltaX) !== null && _d !== void 0 ? _d : 0);
        (_e = this.canvas) === null || _e === void 0 ? void 0 : _e.addEventListener(this.touch ? 'touchmove' : 'mousemove', this.onActionMove);
    };
    /**
     * It will be triggered on mouse or touch events end, it will completely destroy event handler
     *
     * @private
     * @memberof CanvasCarousel
     */
    CanvasCarousel.prototype.onActionEnd = function () {
        var _a;
        (_a = this.canvas) === null || _a === void 0 ? void 0 : _a.removeEventListener(this.touch ? 'touchmove' : 'mousemove', this.onActionMove);
    };
    /**
     * Once the touch has been canceled or mouse leave the element, it triggers the end of the behaviour
     *
     * @private
     * @memberof CanvasCarousel
     */
    CanvasCarousel.prototype.onElementLeave = function () {
        var _a, _b;
        (_a = this.canvas) === null || _a === void 0 ? void 0 : _a.dispatchEvent(new Event('mouseup'));
        (_b = this.canvas) === null || _b === void 0 ? void 0 : _b.dispatchEvent(new Event('touchend'));
    };
    /**
     * The core of the class, it will tracks event positions in order to track delta that has to be applied during images draw.
     * It also take care about current index (useful for external and internal purpose) and redraws images too.
     *
     * @private
     * @param {(MouseEvent | TouchEvent)} e
     * @memberof CanvasCarousel
     */
    CanvasCarousel.prototype.onActionMove = function (e) {
        var _a, _b, _c, _d, _e;
        e.preventDefault();
        var lastXPosition = (-((_b = (_a = this.canvas) === null || _a === void 0 ? void 0 : _a.width) !== null && _b !== void 0 ? _b : 0) * (this.options.imagesPath.length - 1));
        var event = this.touch && e instanceof TouchEvent ? e.touches[0] : e;
        this.coors.x = event.clientX - ((_d = (_c = this.canvasRect) === null || _c === void 0 ? void 0 : _c.left) !== null && _d !== void 0 ? _d : 0);
        this.canvasPosition.deltaX = (this.coors.x - ((_e = this.coors.clientX) !== null && _e !== void 0 ? _e : 0));
        if (this.canvasPosition.deltaX > 0) {
            this.canvasPosition.deltaX = 0;
        }
        else if (this.canvasPosition.deltaX < lastXPosition) {
            this.canvasPosition.deltaX = lastXPosition;
        }
        this.setupCurrentIndex();
        this.drawImages();
    };
    /**
     * It set current index changes if needed
     *
     * @private
     * @memberof CanvasCarousel
     */
    CanvasCarousel.prototype.setupCurrentIndex = function () {
        if (this.canvas && typeof this.canvasPosition.deltaX !== 'undefined') {
            var nextIndex = Math.round((Math.abs(this.canvasPosition.deltaX) + this.canvas.width) / this.canvas.width) - 1;
            if (nextIndex !== this.currentIndex) {
                this._currentIndex = nextIndex;
            }
        }
    };
    /**
     * In order to have always clean listeners, the method will firstly destroy every used event handlers
     * and then it will start the proper ones again
     *
     * @private
     * @memberof CanvasCarousel
     */
    CanvasCarousel.prototype.addListeners = function () {
        if (this.canvas) {
            var start = this.touch ? 'touchstart' : 'mousedown';
            var end = this.touch ? 'touchend' : 'mouseup';
            var cancel = this.touch ? 'touchcancel' : 'mouseleave';
            this.canvas.removeEventListener('touchstart', this.onActionStart);
            this.canvas.removeEventListener('mousedown', this.onActionStart);
            this.canvas.removeEventListener('touchend', this.onActionEnd);
            this.canvas.removeEventListener('mouseup', this.onActionEnd);
            this.canvas.removeEventListener('touchcancel', this.onElementLeave);
            this.canvas.removeEventListener('mouseleave', this.onElementLeave);
            this.canvas.addEventListener(start, this.onActionStart);
            this.canvas.addEventListener(end, this.onActionEnd);
            this.canvas.addEventListener(cancel, this.onElementLeave);
        }
    };
    /**
     * Helper method, useful to achieve parent node inner width for responsive purpose
     *
     * @private
     * @param {HTMLElement} node
     * @return {*}  {ImageSizes}
     * @memberof CanvasCarousel
     */
    CanvasCarousel.prototype.innerDimensions = function (node) {
        var computedStyle = getComputedStyle(node);
        var width = node.clientWidth;
        var height = node.clientHeight;
        height -= Number.parseFloat(computedStyle.paddingTop) + Number.parseFloat(computedStyle.paddingBottom);
        width -= Number.parseFloat(computedStyle.paddingLeft) + Number.parseFloat(computedStyle.paddingRight);
        return { height: height, width: width };
    };
    /**
     * It will set canvas size using options. If aspectRatio option's provided it will use it to retrieve responsive behaviour
     * If canvasHeight and canvasWidth are provided, instead, it will use it without responsive any behaviour
     *
     * @private
     * @memberof CanvasCarousel
     */
    CanvasCarousel.prototype.setupSize = function () {
        if (this.canvas && this.options.aspectRatio) {
            var parentNode = this.canvas.parentNode;
            if (parentNode) {
                this.parentWidth = this.innerDimensions(parentNode).width;
                this.canvas.width = this.parentWidth;
                this.canvas.height = this.parentWidth * this.options.aspectRatio;
            }
        }
        else if (this.canvas && this.options.canvasHeight && this.options.canvasWidth) {
            this.canvas.width = this.options.canvasWidth;
            this.canvas.height = this.options.canvasHeight;
        }
    };
    /**
     * It fetch remote images and draw image once every image has been downloaded
     *
     * @private
     * @return {*}
     * @memberof CanvasCarousel
     */
    CanvasCarousel.prototype.prepareImages = function () {
        var _this = this;
        this.options.imagesPath.forEach(function (src, index) {
            var image = new Image();
            image.src = src;
            image.onload = function () {
                _this._imagesCollection[index] = image;
                _this.drawImages();
            };
        });
    };
    /**
     * This method handle image aspect ratio in order to render them properly in every slide inside the canvas element
     *
     * @private
     * @param {HTMLImageElement} image
     * @return {*}  {ImageSizes}
     * @memberof CanvasCarousel
     */
    CanvasCarousel.prototype.getNormalizedImageSizes = function (image) {
        if (this.canvas) {
            var imageAspectRatio = image.width / image.height;
            if (imageAspectRatio > 1) {
                return {
                    width: this.canvas.width,
                    height: this.canvas.width / imageAspectRatio
                };
            }
            else {
                return {
                    width: this.canvas.height * imageAspectRatio,
                    height: this.canvas.height
                };
            }
        }
        return {
            width: 0,
            height: 0
        };
    };
    /**
     * This method is used to properly set images at the very center of the slide
     *
     * @private
     * @param {number} width
     * @param {number} height
     * @return {*}  {IDeltas}
     * @memberof CanvasCarousel
     */
    CanvasCarousel.prototype.getDeltas = function (width, height) {
        if (!this.canvas) {
            return {
                x: 0,
                y: 0
            };
        }
        return {
            x: (this.canvas.width - width) / 2,
            y: (this.canvas.height - height) / 2
        };
    };
    /**
     * Generic method the move the canvas to the provided image index
     *
     * @param {number} index
     * @memberof CanvasCarousel
     */
    CanvasCarousel.prototype.goToIndex = function (index) {
        if (this.canvas && index >= 0 && index < this.options.imagesPath.length) {
            var delta = 0 - (this.canvas.width * index);
            this.canvasPosition.deltaX = delta;
            this.drawImages();
            this.setupCurrentIndex();
        }
    };
    /**
     * It use goToIndex method to move the canvas carousel to the next slide
     *
     * @memberof CanvasCarousel
     */
    CanvasCarousel.prototype.goToNext = function () {
        this.goToIndex(this.currentIndex + 1);
    };
    /**
     * It use goToIndex method to move the canvas carousel to the previous slide
     *
     * @memberof CanvasCarousel
     */
    CanvasCarousel.prototype.goToPrev = function () {
        this.goToIndex(this.currentIndex - 1);
    };
    /**
     * It use goToIndex method to move the canvas carousel to the first slide
     *
     * @memberof CanvasCarousel
     */
    CanvasCarousel.prototype.goToFirst = function () {
        this.goToIndex(0);
    };
    /**
     * It use goToIndex method to move the canvas carousel to the last slide
     *
     * @memberof CanvasCarousel
     */
    CanvasCarousel.prototype.goToLast = function () {
        this.goToIndex(this.options.imagesPath.length - 1);
    };
    /**
     * This method will draw images in canvas context setting properly deltas, sizes and positioning
     *
     * @private
     * @memberof CanvasCarousel
     */
    CanvasCarousel.prototype.drawImages = function () {
        var _this = this;
        var _a, _b, _c, _d, _e;
        (_a = this.context) === null || _a === void 0 ? void 0 : _a.clearRect(0, 0, (_c = (_b = this.canvas) === null || _b === void 0 ? void 0 : _b.width) !== null && _c !== void 0 ? _c : 0, (_e = (_d = this.canvas) === null || _d === void 0 ? void 0 : _d.height) !== null && _e !== void 0 ? _e : 0);
        this._imagesCollection.forEach(function (image, index) {
            var _a, _b;
            if (_this.canvas) {
                var _c = _this.getNormalizedImageSizes(image), width = _c.width, height = _c.height;
                var _d = _this.getDeltas(width, height), x = _d.x, y = _d.y;
                (_a = _this.context) === null || _a === void 0 ? void 0 : _a.drawImage(image, (_this.canvas.width * index) + x + ((_b = _this.canvasPosition.deltaX) !== null && _b !== void 0 ? _b : 0), y, width, height);
            }
        });
    };
    return CanvasCarousel;
}());
exports.CanvasCarousel = CanvasCarousel;

})();

/******/ 	return __webpack_exports__;
/******/ })()
;
});;
//# sourceMappingURL=canvas-carousel.amd.js.map