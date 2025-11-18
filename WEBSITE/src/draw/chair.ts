import { Coords, Chair } from "@/types/interfaces";
import { ETool } from "@/types/enums";

export function drawChairs(
	ctx: CanvasRenderingContext2D,
	chairs: Map<string, Chair>,
	cellSize: number,
	cursorGridCoords: Coords,
	selectedTool: ETool,
	offset: Coords,
	chairImg: HTMLImageElement,
) {
	for (const [, chair] of chairs) {
		let opacity = 1;
		if (
			chair.coords.x === cursorGridCoords.x &&
			chair.coords.y === cursorGridCoords.y &&
			selectedTool === ETool.Delete
		) {
			opacity = 0.4;
		}

		drawChair(ctx, chair, cellSize, opacity, offset, chairImg);
	}
}

export function drawChair(
	ctx: CanvasRenderingContext2D,
	chair: Chair,
	cellSize: number,
	opacity: number = 1,
	offset: Coords,
	chairImg: HTMLImageElement,
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
