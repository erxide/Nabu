import { drawChair } from "@/draw/chair";
import { Chair, Tool, Coords } from "@/types/interfaces";
import { ETool } from "@/types/enums";

export function drawPreview(
	ctx: CanvasRenderingContext2D,
	cursorGridCoords: Coords,
	cellSize: number,
	rotation: number,
	tool: Tool,
	chairs: Map<string, Chair>,
	offset: Coords,
	chairImg: HTMLImageElement,
	deleteImg: HTMLImageElement,
) {
	const x = cursorGridCoords.x * cellSize + offset.x;
	const y = cursorGridCoords.y * cellSize + offset.y;

	const stringPosition = `${cursorGridCoords.x}-${cursorGridCoords.y}`;

	switch (tool.name) {
		case ETool.Delete: {
			const chair = chairs.get(stringPosition);
			if (!chair) return;

			ctx.drawImage(deleteImg, x, y, cellSize, cellSize);
			break;
		}

		case ETool.Add: {
			if (chairs.get(stringPosition)) return;

			const previewChair: Chair = {
				coords: { x: cursorGridCoords.x, y: cursorGridCoords.y },
				rotation,
			};

			drawChair(ctx, previewChair, cellSize, 0.4, offset, chairImg);
			break;
		}

		default:
			break;
	}
}
