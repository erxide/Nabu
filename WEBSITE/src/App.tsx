import { useState, useEffect, useRef } from "react";
import { handleMouseWheel, handleMouseMove, handleMouseDown, handleMouseUp, handleKeyDown } from "./handler";
import { drawChairs, clearScreen, drawGrid, drawChairPreview } from "./draw";
import { Chair, Coords } from "./interfaces";
import { Action } from "./enums";

export function App() {
	const LINE_WEIGHT = 0.2;
	const ROW_NBR = 50;
	const COL_NBR = 50;

	const canvasRef = useRef<HTMLCanvasElement | null>(null);
	const ctxRef = useRef<CanvasRenderingContext2D | null>(null);

	const chairArr = useRef<Chair[]>([]);

	const cellSize = useRef<number>(0);

	const cursorAbsPosition = useRef<Coords>({x: 0, y: 0}); 
	const cursorGridPosition = useRef<Coords>({x: 0, y: 0}); 

	const rotation = useRef<number>(0);

	const [zoomLevel, setZoomLevel] = useState<number>(1);

	function gameLoop() {
		const canvas = canvasRef.current;
		const ctx = ctxRef.current;

 		clearScreen(ctx, canvas);

 		drawGrid(canvas, ctx, cellSize.current, LINE_WEIGHT);

		drawChairPreview(ctx, cursorGridPosition.current, cellSize.current, rotation.current);
		drawChairs(ctx, chairArr.current, cellSize.current);

		requestAnimationFrame(gameLoop);
	};

	useEffect(() => {
 		const canvas = canvasRef.current;
 		if (!canvas) return;
 
 		canvas.width = window.innerWidth;
 		canvas.height = window.innerHeight;
 
 		const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;
 		if (!ctx) return;
 
 		canvasRef.current = canvas;
 		ctxRef.current = ctx;

 		cellSize.current = Math.max(
 			zoomLevel * 10, Math.min(canvas.width / COL_NBR, canvas.height / ROW_NBR)
 		);
 
 
 		document.addEventListener("mousedown", (e) => 
 			handleMouseDown(e, chairArr, cursorGridPosition.current, ctx, cellSize.current, rotation.current)
 		);
 		document.addEventListener("mousemove", (e) => 
 			handleMouseMove(e, cursorAbsPosition, cursorGridPosition, canvas, cellSize.current, ctx, rotation.current)
 		);
 		document.addEventListener("wheel", (e) => handleMouseWheel(e, zoomLevel, setZoomLevel));
 		document.addEventListener("keydown", (e) => handleKeyDown(e, rotation));

		requestAnimationFrame(gameLoop);

		return () => {
			document.removeEventListener("mousedown", handleMouseMove);
			document.removeEventListener("mousemove", handleMouseMove);
			document.removeEventListener("wheel", handleMouseWheel);
			document.removeEventListener("keydown", handleKeyDown);
		};
 	}, []);
 
 	useEffect(() => {
 		const ctx = ctxRef.current;
 		const canvas = canvasRef.current;
 
 		cellSize.current = Math.max(
 			zoomLevel * 10, Math.min(canvas.width / COL_NBR, canvas.height / ROW_NBR)
 		);
 
 	}, [zoomLevel]);

	return (
		<canvas ref={canvasRef}></canvas>
	);
}

export default App;
