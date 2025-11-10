import { Chair, Tool, Coords } from "./interfaces";
import { ETool, EClick } from "./enums";
import { Dispatch, SetStateAction, RefObject } from "react";

export function handleMouseDown(
	e: MouseEvent,
	chairs: RefObject<Map<string, Chair>>,
	cursorGridPosition: Coords,
	rotation: number,
	tool: Tool,
) {
	switch (e.button) {
		case EClick.Left:
			handleLeftClick(tool, chairs, cursorGridPosition, rotation);
			break;
		case EClick.Middle:
			handleMiddleClick();
			break;
		default:
			break;
	}
}

function handleMiddleClick() {}

function handleLeftClick(
	tool: Tool,
	chairs: RefObject<Map<string, Chair>>,
	cursorGridPosition: Coords,
	rotation: number,
) {
	const stringCoords = `${cursorGridPosition.x}-${cursorGridPosition.y}`;

	switch (tool.name) {
		case ETool.Add: {
			if (chairs.current.get(stringCoords)) return;

			const chair: Chair = {
				coords: {
					x: cursorGridPosition.x,
					y: cursorGridPosition.y,
				},
				rotation: rotation,
			};

			chairs.current.set(stringCoords, chair);
			break;
		}
		case ETool.Delete:
			chairs.current.delete(stringCoords);
			break;
		default:
			break;
	}
}

export function handleMouseWheel(e: WheelEvent, zoomLevel: RefObject<number>) {
	const scaleAmount = e.deltaY < 0 ? 0.1 : -0.1;

	zoomLevel.current += scaleAmount;
}

export function handleMouseMove(
	e: MouseEvent,
	cursorAbsPosition: RefObject<Coords>,
	cursorGridPosition: RefObject<Coords>,
	cellSize: number,
) {
	cursorAbsPosition.current = {
		x: e.clientX,
		y: e.clientY,
	};

	cursorGridPosition.current = {
		x: Math.floor(e.clientX / cellSize),
		y: Math.floor(e.clientY / cellSize),
	};
}

export function handleKeyDown(
	e: KeyboardEvent,
	rotation: RefObject<number>,
	selectedTool: RefObject<ETool>,
	setSelectedToolState: Dispatch<SetStateAction<ETool>>,
) {
	switch (e.key) {
		case "r":
			if (selectedTool.current !== ETool.Add) return;

			rotation.current =
				rotation.current !== 270 ? rotation.current + 90 : 0;
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
