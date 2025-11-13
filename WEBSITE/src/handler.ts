import { Chair, Tool, Coords } from "./interfaces";
import { ETool, EClick } from "./enums";
import { Dispatch, SetStateAction, RefObject } from "react";

export function handleMouseDown(
	e: MouseEvent,
	chairs: RefObject<Map<string, Chair>>,
	cursorGridPosition: Coords,
	rotation: number,
	tool: Tool,
	isMiddleClickDown: RefObject<boolean>,
	prevPosition: RefObject<Coords>,
	prevOffset: RefObject<Coords>,
	offset: Coords,
) {
	switch (e.button) {
		case EClick.Left:
			handleLeftClick(tool, chairs, cursorGridPosition, rotation);
			break;
		case EClick.Middle:
			handleMiddleClickDown(
				e,
				isMiddleClickDown,
				prevPosition,
				prevOffset,
				offset,
			);
			break;
		default:
			break;
	}
}

export function handleMouseUp(
	e: MouseEvent,
	isMiddleClickDown: RefObject<boolean>,
) {
	switch (e.button) {
		case EClick.Middle:
			handleMiddleClickUp(isMiddleClickDown);
			break;
		default:
			break;
	}
}

function handleMiddleClickDown(
	e: MouseEvent,
	isMiddleClickDown: RefObject<boolean>,
	prevPosition: RefObject<Coords>,
	prevOffset: RefObject<Coords>,
	offset: Coords,
) {
	isMiddleClickDown.current = true;
	prevPosition.current = { x: e.clientX, y: e.clientY };
	prevOffset.current = offset;
}

function handleMiddleClickUp(isMiddleClickDown: RefObject<boolean>) {
	isMiddleClickDown.current = false;
}

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

			const chairCoords: Coords = {
				x: cursorGridPosition.x,
				y: cursorGridPosition.y,
			};

			const chair: Chair = {
				coords: chairCoords,
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
	isMiddleClickDown: boolean,
	offset: RefObject<Coords>,
	prevOffset: Coords,
	prevPosition: Coords,
) {
	cursorAbsPosition.current = {
		x: e.clientX,
		y: e.clientY,
	};

	cursorGridPosition.current = {
		x: Math.floor((e.clientX - offset.current.x) / cellSize),
		y: Math.floor((e.clientY - offset.current.y) / cellSize),
	};

	if (isMiddleClickDown) {
		offset.current = {
			x: cursorAbsPosition.current.x - prevPosition.x + prevOffset.x,
			y: cursorAbsPosition.current.y - prevPosition.y + prevOffset.y,
		};
	}
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
