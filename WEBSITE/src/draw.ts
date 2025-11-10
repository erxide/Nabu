import { ETool } from "./enums";
import type { Tool, Coords, Chair } from "./interfaces";

import armChair from "./img/armchair.svg";
import deleteImg from "./img/delete.svg";

const chairImg = new Image();
chairImg.src = armChair;

const delImg = new Image();
delImg.src = deleteImg;

export function drawChairs(
	ctx: CanvasRenderingContext2D,
	chairs: Map<string, Chair>,
	cellSize: number,
	cursorGridPosition: Coords,
	selectedTool: ETool,
) {
	for (const [, chair] of chairs) {
		const x = chair.coords.x * cellSize;
		const y = chair.coords.y * cellSize;

		let opacity = 1;

		if (
			chair.coords.x === cursorGridPosition.x &&
			chair.coords.y === cursorGridPosition.y &&
			selectedTool === ETool.Delete
		) {
			opacity = 0.4;
		}

		drawChair(ctx, x, y, cellSize, chair.rotation, opacity);
	}
}

export function drawGrid(
	canvas: HTMLCanvasElement,
	ctx: CanvasRenderingContext2D,
	cellSize: number,
	LINE_WEIGHT: number,
) {
	ctx.fillStyle = "black";
	ctx.lineWidth = LINE_WEIGHT;

	ctx.beginPath();

	for (let x = 0; x <= canvas.width; x += cellSize) {
		ctx.moveTo(x, 0);
		ctx.lineTo(x, canvas.height);
	}

	for (let y = 0; y <= canvas.height; y += cellSize) {
		ctx.moveTo(0, y);
		ctx.lineTo(canvas.width, y);
	}

	ctx.stroke();
}

export function clearScreen(
	ctx: CanvasRenderingContext2D,
	canvas: HTMLCanvasElement,
) {
	ctx.clearRect(0, 0, canvas.width, canvas.height);
}

export function drawPreview(
	ctx: CanvasRenderingContext2D,
	cursorGridPosition: Coords,
	cellSize: number,
	rotation: number,
	tool: Tool,
	chairs: Map<string, Chair>,
) {
	const x = cursorGridPosition.x * cellSize;
	const y = cursorGridPosition.y * cellSize;

	switch (tool.name) {
		case ETool.Delete:
			const chair = chairs.get(
				`${cursorGridPosition.x}-${cursorGridPosition.y}`,
			);
			if (!chair) return;

			drawDelete(ctx, x, y, cellSize);
			break;
		case ETool.Add:
			if (chairs.get(`${cursorGridPosition.x}-${cursorGridPosition.y}`))
				return;

			drawChair(ctx, x, y, cellSize, rotation, 0.4);
			break;
		case ETool.Move:
			break;
		default:
			break;
	}
}

function drawDelete(
	ctx: CanvasRenderingContext2D,
	x: number,
	y: number,
	cellSize: number,
) {
	ctx.drawImage(delImg, x, y, cellSize, cellSize);
}

function drawChair(
	ctx: CanvasRenderingContext2D,
	x: number,
	y: number,
	cellSize: number,
	rotation: number,
	opacity: number = 1,
) {
	const angle = (rotation * Math.PI) / 180;

	ctx.save();
	ctx.globalAlpha = opacity;
	ctx.translate(x + cellSize / 2, y + cellSize / 2);
	ctx.rotate(angle);
	ctx.drawImage(chairImg, -cellSize / 2, -cellSize / 2, cellSize, cellSize);
	ctx.restore();
}
