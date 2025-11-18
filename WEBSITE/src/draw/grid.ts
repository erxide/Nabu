import { Coords } from "@/types/interfaces";

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
