import { Coords, Tool, Chair } from "@/types/interfaces";
import { ETool, EClick } from "@/types/enums";
import { RefObject } from "react";

export function handleMouseDown(
	e: MouseEvent,
	chairs: RefObject<Map<string, Chair>>,
	cursorGridCoords: Coords,
	rotation: number,
	tool: Tool,
	isMiddleClickDown: RefObject<boolean>,
	prevCoords: RefObject<Coords>,
	prevOffset: RefObject<Coords>,
	offset: Coords,
) {
	switch (e.button) {
		case EClick.Left:
			handleLeftClick(tool, chairs, cursorGridCoords, rotation);
			break;
		case EClick.Middle:
			handleMiddleClickDown(
				e,
				isMiddleClickDown,
				prevCoords,
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
	prevCoords: RefObject<Coords>,
	prevOffset: RefObject<Coords>,
	offset: Coords,
) {
	isMiddleClickDown.current = true;
	prevCoords.current = { x: e.clientX, y: e.clientY };
	prevOffset.current = offset;
}

function handleMiddleClickUp(isMiddleClickDown: RefObject<boolean>) {
	isMiddleClickDown.current = false;
}

function handleLeftClick(
	tool: Tool,
	chairs: RefObject<Map<string, Chair>>,
	cursorGridCoords: Coords,
	rotation: number,
) {
	const stringCoords = `${cursorGridCoords.x}-${cursorGridCoords.y}`;

	switch (tool.name) {
		case ETool.Add: {
			if (chairs.current.get(stringCoords)) return;

			const chairCoords: Coords = {
				x: cursorGridCoords.x,
				y: cursorGridCoords.y,
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
	cursorAbsCoords: RefObject<Coords>,
	cursorGridCoords: RefObject<Coords>,
	cellSize: number,
	isMiddleClickDown: boolean,
	offset: RefObject<Coords>,
	prevOffset: Coords,
	prevCoords: Coords,
) {
	cursorAbsCoords.current = {
		x: e.clientX,
		y: e.clientY,
	};

	cursorGridCoords.current = {
		x: Math.floor((e.clientX - offset.current.x) / cellSize),
		y: Math.floor((e.clientY - offset.current.y) / cellSize),
	};

	if (isMiddleClickDown) {
		offset.current = {
			x: cursorAbsCoords.current.x - prevCoords.x + prevOffset.x,
			y: cursorAbsCoords.current.y - prevCoords.y + prevOffset.y,
		};
	}
}
