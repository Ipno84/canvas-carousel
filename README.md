# canvas-carousel

Canvas Carousel is a module written with the objective of completing the task for selection at Publitas.com.

## What is this?!

It is nothing more and nothing less than a basic touch image carousel written entirely in typescript and framework agnostic, allowing a carousel of images to be generated within a canvas element.<br />
The carousel responds both to dragging by single finger touch, whether the device responds to touch events, and to dragging by mouse pressure and movement.<br />
Furthermore, depending on the options set during initialisation, it can also be fluid responsive.

## Can I see it in action?

If you just want to have a quick check, you can run the code in the example folder.
To do this you have to be sure that you have installed global dependencies (as per step 1 in the next paragraph), that you have cloned the repository (step 2), and that you have globally installed the *nws* module. In case you haven't installed it yet and/or you don't want to, you can proceed with step 3 and install project dependencies (nws is indeed one of them). Now, from the terminal, you can go to the project folder and run one of the following commands

```
// If you have nws globally installed
nws -d ./example

// If you want to use workspace package
yarn example
```

If you want to see the module working in development mode (in this mode you can change options in ./src/start.ts and test and experiment with different features) you need to follow all the steps below

---

### 1. Install global dependencies

During development, yarn package manager was used. It is also possible to use npm or pnpm, but when installing modules, it will not be possible to refer to the lock file, so compatibility cannot be guaranteed in this case.

If you have not yet installed yarn on your device, you can do so by following the instructions at [this link](https://classic.yarnpkg.com/en/docs/installhttps:/)

You also need node installed on your device. If you have not yet installed it, you can do so at [this link](https://nodejs.org/en/)

### 2. Clone repositories

Once your environment is ready with all the necessary global dependencies, you can clone the repository. To do so, you can either use your favourite GUI (I recommend SourceTree or GitKraken in addition to Github Desktop) or run the following command from your terminal after navigating to the folder in which you intend to clone the project

```
git clone https://github.com/Ipno84/canvas-carousel.git
```

### 3. Install local dependencies

The project has no direct dependencies except those necessary for development (typescript, webpack, jest and typing).<br/>
Navigate to the project folder and run the command to install the yarn dependencies as shown below

```
yarn install
```

### 4. Run project in dev mode

You should now be able to launch the project in development mode using the node server generated by webpack-dev-server running the command as shown below.<br/>

```
yarn start
```

The module should automatically open to the http://localhost:8080 page displaying a canvas inside which 4 images and a set of cta will be loaded immediately below it

## What can I do with it?

You can drag the mouse cursor within the canvas to move its contents to the right or left. Once you have reached the limits of the 4 images, the canvas carousel should not allow any further movement and will not produce any results.<br/>
If no changes have been made to the ./src/start.ts file, the canvas will be responsive and will adapt its dimensions to the internal dimensions of the container in which it is inscribed.<br/>
The responsive behaviour is fluid and the canvas state will also maintain the scroll point as the width of its container changes.<br/>
This behaviour is maintained even when varying between touch and no-touch devices (as allowed by chrome's dev tool), and the listener on the user's interaction will be appropriately varied at runtime.<br/>
The buttons immediately below the canvas have the functions to advance to the next slide (if any), return to the previous slide, go to the first and last slide respectively.

## How to use it?

Initialising a controller for a carousel on a canvas element is extremely simple. Simply instantiate the class with an argument that should implement the CanvasCarouselOptions interface.<br/>

Here's the interfaces members:

### selector: string | undefined

It will be used to get element reference from DOM if it has not been provided by the *node* option

### node: HTMLCanvasElement | undefined

It will be used to as element reference from DOM without the need to access to it once again. It will be directly assigned to CanvasCarousel.prototype.canvas

### imagesPath: string[]

An array of images urls that will be used to draw the canvas. Each image will be set at the center of related slide maintaining its aspect ratio

### aspectRatio: number | undefined

It represents the ratio between width and height to be assigned to the carousel, it will be used to manage the fluid responsiveness

### resizeTimeoutReaction: number | undefined - default 300

When the width of the container in which the canvas is placed is reduced, methods are launched to manage responsiveness (setting dimensions, proportions, etc.). To avoid overloading the browser with an excessive number of callbacks, a debounce is applied to delay and cancel unnecessary executions. The duration of the debounce is, in fact, decided by this option

### canvasWidth, canvasHeight: number | undefined

They represent the width and height to be allocated to the canvas. These dimensions will be retained and may not vary, preventing the element's responsive behaviour. Setting these two options (they must be set at the same time to work correctly, otherwise the behaviour will be ignored) instead of the aspectRatio parameter will improve performance since no listener needs to be implemented via the browser API ResizeObserver

## APIs

The class exposes certain properties and methods that allow interaction with the instance by obtaining information or performing a particular behaviour as explained below.

### options: CanvasCarouselOptions

It will be possible to consult the options set at initialisation, but not to set them again (please refer to future versions). This information is contained in this class property

### canvas: HTMLCanvasElement | null

Property in which the reference in the canvas DOM obtained via node or selector option is stored

### context: CanvasRenderingContext2D | null | undefined

The canvas-related context is used internally to perform image draw operations. Exposing it gives developers the ability to interact with it by making custom animations

### currentIndex: number

Indicates the reference index of the current slide

### resizeObserver: ResizeObserver | null

Indicates the reference to the observer to intercept any changes in the width of the element containing the canvas. It is not set if the aspectRatio option is not present and set.

### imagesCollection: HTMLImageElement[]

A list of Image objects generated from the imagesPath option will be used to print the images in the canvas and manage the maintenance of the aspect ratio of the images within it

### goToIndex(index: number): void

Basic method that allows animation of the canvas without direct interaction with it. It is the basis for all other more specific methods related to the same functionality

### goToNext(): void

Use goToIndex to go to the next slide

### goToPrev(): void

Use goToIndex to go to the previous slide

### goToFirst(): void

Use goToIndex to go to the first slide of the list

### goToLast(): void

Use goToIndex to go to the last slide of the list

## Tests

The test environment is, at present, dedicated exclusively to unit tests. For behavior related to direct interaction with user drag-and-drop and snapshot handling, it is considered appropriate to defer to the e2e test implementation.
The current test suite does not fully cover the needs of the module; this is only an initial implementation.
To launch the tests, one of the following terminal commands should be run.

```
// Execution carried out only once
yarn test

// During execution, affected files are observed, and when a change occurs, the suite is checked again
yarn test:watch
```

## Build and deploy

No real build and deploy routine has been implemented, but a set of automated actions have been provided that will allow code to be compiled in various formats and generate an automated changelog. To do this, it will be sufficient to launch one of the scripts provided in package.json related to version incrementing, and hooks will be triggered to launch tests (before the version change) and to generate changelogs and launch build and transpilation

## TO DO

* [ ] snap
* [ ] momentum
* [ ] elastic
