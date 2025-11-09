import armChair from "./img/armchair.svg";

export function drawChairs(
	ctx: CanvasRenderingContext2D, 
	chairArr: Chair[],
	cellSize: number,
) {
	const img = new Image();
	img.src = armChair;

	for (const chair of chairArr) {
		const angle = chair.rotation * Math.PI / 180;

		ctx.save();
		const x = chair.coords.x * cellSize;
		const y = chair.coords.y * cellSize;

		ctx.translate(x + cellSize / 2, y + cellSize / 2);
		ctx.rotate(angle);
		ctx.drawImage(img, -cellSize / 2, -cellSize / 2, cellSize, cellSize);
		ctx.restore();
	}
}

export function drawGrid(
	canvas: HTMLCanvasElement, 
	ctx: CanvasRenderingContext2D, 
	cellSize: number,
	LINE_WEIGHT: number
) {
	ctx.fillStyle = "black";

	for (let i = 0; i <= canvas.width; i += cellSize) {
		ctx.fillRect(i, 0, LINE_WEIGHT, canvas.height);
	}

	for (let j = 0; j <= canvas.height; j += cellSize) {
		ctx.fillRect(0, j, canvas.width, LINE_WEIGHT);
	}
}

export function clearScreen(ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement) {
	ctx.clearRect(
		0, 
		0, 
		canvas.width, 
		canvas.height
	);
}

export function drawChairPreview(
	ctx: CanvasRenderingContext2D, 
	cursorGridPosition: number, 
	cellSize: number,
	rotation: number
) {
	const x = cursorGridPosition.x * cellSize;
	const y = cursorGridPosition.y * cellSize;

	const img = new Image();
	img.src = armChair;

	const angle = rotation * Math.PI / 180;

	ctx.save();
	ctx.translate(x + cellSize / 2, y + cellSize / 2);
	ctx.rotate(angle);
	ctx.drawImage(img, -cellSize / 2, -cellSize / 2, cellSize, cellSize);
	ctx.restore();
}
