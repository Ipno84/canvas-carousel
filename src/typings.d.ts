interface CanvasCarouselOptions {
    selector: string;
    imagesPath: string[];
	aspectRatio?: number;
	canvasWidth?: number;
	canvasHeight?: number;
    resizeTimeoutReaction?: number
}

interface ImageSizes {
    width: number
    height: number
}

interface IDeltas {
    x: number
    y: number
}

export { CanvasCarouselOptions, ImageSizes, IDeltas };
