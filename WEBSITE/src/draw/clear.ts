export function clearScreen(
	ctx: CanvasRenderingContext2D,
	canvas: HTMLCanvasElement,
) {
	ctx.clearRect(0, 0, canvas.width, canvas.height);
}
