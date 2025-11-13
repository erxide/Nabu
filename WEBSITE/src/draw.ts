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
	offset: Coords,
) {
	for (const [, chair] of chairs) {
		let opacity = 1;
		if (
			chair.coords.x === cursorGridPosition.x &&
			chair.coords.y === cursorGridPosition.y &&
			selectedTool === ETool.Delete
		) {
			opacity = 0.4;
		}

		drawChair(ctx, chair, cellSize, opacity, offset);
	}
}

export function drawGrid(
	canvas: HTMLCanvasElement,
	ctx: CanvasRenderingContext2D,
	cellSize: number,
	LINE_WEIGHT: number,
	offset: Coords,
) {
	ctx.fillStyle = "black";
	ctx.lineWidth = LINE_WEIGHT;

	ctx.beginPath();

	for (let x = offset.x % cellSize; x <= canvas.width; x += cellSize) {
		ctx.moveTo(x, 0);
		ctx.lineTo(x, canvas.height);
	}

	for (let y = offset.y % cellSize; y <= canvas.height; y += cellSize) {
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
	offset: Coords,
) {
	const x = cursorGridPosition.x * cellSize + offset.x;
	const y = cursorGridPosition.y * cellSize + offset.y;

	switch (tool.name) {
		case ETool.Delete: {
			const chair = chairs.get(
				`${cursorGridPosition.x}-${cursorGridPosition.y}`,
			);
			if (!chair) return;

			ctx.drawImage(delImg, x, y, cellSize, cellSize);
			break;
		}

		case ETool.Add: {
			if (chairs.get(`${cursorGridPosition.x}-${cursorGridPosition.y}`))
				return;

			const previewChair: Chair = {
				coords: { x: cursorGridPosition.x, y: cursorGridPosition.y },
				rotation,
			};

			drawChair(ctx, previewChair, cellSize, 0.4, offset);
			break;
		}

		case ETool.Move:
			break;
		default:
			break;
	}
}

function drawChair(
	ctx: CanvasRenderingContext2D,
	chair: Chair,
	cellSize: number,
	opacity: number = 1,
	offset: Coords,
) {
	const angle = (chair.rotation * Math.PI) / 180;

	ctx.save();
	ctx.globalAlpha = opacity;
	ctx.translate(
		chair.coords.x * cellSize + cellSize / 2 + offset.x,
		chair.coords.y * cellSize + cellSize / 2 + offset.y,
	);
	ctx.rotate(angle);
	ctx.drawImage(chairImg, -cellSize / 2, -cellSize / 2, cellSize, cellSize);
	ctx.restore();
}
