import { Chair } from "./interfaces";
import { drawChairPreview, drawChair, drawChairs, clearScreen, drawGrid } from "./draw";

export function handleMouseDown(
	e: MouseEvent, 
	chairArr: React.MutableRefObject<Chair[]>, 
	cursorGridPosition: number,
	ctx: CanvasRenderingContext2D,
	cellSize: number,
	rotation: number
) {
	const chair = {
		coords: {
			x: cursorGridPosition.x,
			y: cursorGridPosition.y,
		},
		id: 0,
		rotation: rotation
	};

	chairArr.current.push(chair); 
}

export function handleMouseWheel(
	e: wheelevent,
	zoomLevel: number,
	setZoomLevel: React.Dispatch<SetStateAction<number>>,
) {
	const scaleAmount = e.deltaY < 0 ? 0.1 : -0.1;
 
	setZoomLevel(prev => prev + scaleAmount);
}

export function handleMouseMove(
	e: MouseEvent, 
	cursorAbsPosition: React.MutableRefObject<Coords>,
	cursorGridPosition: React.MutableRefObject<Coords>,
	canvas: HTMLCanvasElement,
	cellSize: number,
	ctx: CanvasRenderingContext2D,
	rotation: number
) {
	cursorAbsPosition.current = {
		x: e.clientX,
		y: e.clientY
	};

	cursorGridPosition.current = {
		x: Math.floor(e.clientX / cellSize),
		y: Math.floor(e.clientY / cellSize) 
	};
}

export function handleKeyDown(e: KeyboardEvent, rotation: React.MutableRefObject<number>) {
	switch (e.key) {
		case "r":
			rotation !== 90 ? rotation.current += 90: rotation.current = 0;
		default:
			break;
	}
}
