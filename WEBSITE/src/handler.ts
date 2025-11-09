import { Chair, Tool } from "./interfaces";
import { drawChairPreview, drawChair, drawChairs, clearScreen, drawGrid } from "./draw";
import { ETool } from "./enums";

export function handleMouseDown(
	e: MouseEvent, 
	chairs: React.MutableRefObject<Map<Coords, Chair>>, 
	cursorGridPosition: number,
	ctx: CanvasRenderingContext2D,
	cellSize: number,
	rotation: number,
	tool: Tool
) {
	switch (tool.name) {
		case ETool.Add:
			const chair = {
				coords: {
					x: cursorGridPosition.x,
					y: cursorGridPosition.y,
				},
				rotation: rotation,
				opacity: 1
			};

			chairs.current.set(`${chair.coords.x}-${chair.coords.y}`, chair);
			break;
		case ETool.Delete:
			chairs.current.delete(`${cursorGridPosition.x}-${cursorGridPosition.y}`);
			break;
		default:
			break;
	}
}

export function handleMouseWheel(
	e: wheelevent,
	zoomLevel: React.MutableRefObject<number>,
) {
	const scaleAmount = e.deltaY < 0 ? 0.1 : -0.1;
 
	zoomLevel.current += scaleAmount;
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

export function handleKeyDown(
	e: KeyboardEvent, 
	rotation: React.MutableRefObject<number>, 
	selectedTool: React.MutableRefObject<Tool>,
	setSelectedToolState: React.Dispatch<SetStateAction<Tool>>
) {
	switch (e.key) {
		case "r":
			if (selectedTool.current !== ETool.Add) return;

			rotation !== 360 ? rotation.current += 90: rotation.current = 0;
			break;
		case "a":
			selectedTool.current = ETool.Add;
			setSelectedToolState(ETool.Add);
			break;
		case "m":
			selectedTool.current = ETool.Move;
			setSelectedToolState(ETool.Move);
			break;
		case "d":
			selectedTool.current = ETool.Delete;
			setSelectedToolState(ETool.Delete);
			break;
		default:
			break;
	}
}
