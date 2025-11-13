import { useState, useEffect, useRef } from "react";
import {
	handleMouseWheel,
	handleMouseMove,
	handleMouseDown,
	handleMouseUp,
	handleKeyDown,
} from "./handler";
import { drawChairs, clearScreen, drawGrid, drawPreview } from "./draw";
import type { Chair, Coords, Tool } from "./interfaces";
import { ETool } from "./enums";
import "./index.css";
import armChair from "./img/armchair.svg";
import deleteImg from "./img/delete.svg";

const TOOL_LIST: Map<ETool, Tool> = new Map([
	[
		ETool.Add,
		{
			name: ETool.Add,
			description: "add chair",
			shortcut: "a",
			img: armChair,
		},
	],
	[
		ETool.Delete,
		{
			name: ETool.Delete,
			description: "delete chair",
			shortcut: "d",
			img: deleteImg,
		},
	],
]);

const LINE_WEIGHT = 0.2;
const ROW_NBR = 50;
const COL_NBR = 50;

export function App() {
	const canvasRef = useRef<HTMLCanvasElement | null>(null);
	const ctxRef = useRef<CanvasRenderingContext2D | null>(null);

	const chairs = useRef<Map<string, Chair>>(new Map());

	const cellSize = useRef<number>(0);

	const cursorAbsPosition = useRef<Coords>({ x: 0, y: 0 });
	const cursorGridPosition = useRef<Coords>({ x: 0, y: 0 });

	const rotation = useRef<number>(0);

	const prevPosition = useRef<Coords>({ x: 0, y: 0 });
	const isMiddleClickDown = useRef<boolean>(false);

	const offset = useRef<Coords>({ x: 0, y: 0 });
	const prevOffset = useRef<Coords>({ x: 0, y: 0 });

	const selectedTool = useRef<ETool>(ETool.Add);
	const [selectedToolState, setSelectedToolState] = useState<ETool>(
		ETool.Add,
	);

	const zoomLevel = useRef<number>(1);

	function render() {
		const canvas = canvasRef.current;
		const ctx = ctxRef.current;

		if (!canvas || !ctx) return;

		cellSize.current = Math.max(
			zoomLevel.current * 10,
			Math.min(canvas.width / COL_NBR, canvas.height / ROW_NBR),
		);

		clearScreen(ctx, canvas);

		drawGrid(canvas, ctx, cellSize.current, LINE_WEIGHT, offset.current);

		drawChairs(
			ctx,
			chairs.current,
			cellSize.current,
			cursorGridPosition.current,
			selectedTool.current,
			offset.current,
		);
		drawPreview(
			ctx,
			cursorGridPosition.current,
			cellSize.current,
			rotation.current,
			TOOL_LIST.get(selectedTool.current)!,
			chairs.current,
			offset.current,
		);
	}

	useEffect(() => {
		const canvas = canvasRef.current;
		if (!canvas) return;

		canvas.width = window.innerWidth;
		canvas.height = window.innerHeight;

		const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;
		if (!ctx) return;

		ctxRef.current = ctx;

		render();

		const keyHandler = (e: KeyboardEvent) => {
			handleKeyDown(e, rotation, selectedTool, setSelectedToolState);
			render();
		};
		document.addEventListener("keydown", keyHandler);

		return () => {
			document.removeEventListener("keydown", keyHandler);
		};
	}, []);

	return (
		<>
			<div className="absolute flex flex-col bg-white border left-4 top-4">
				{Array.from(TOOL_LIST.entries()).map(([toolKey, tool]) => (
					<button
						title={`${tool.description} (${tool.shortcut})`}
						key={toolKey}
						onClick={() => {
							setSelectedToolState(toolKey);
							selectedTool.current = toolKey;
						}}
						className={`m-1 p-2 ${
							selectedToolState === toolKey
								? "opacity-100"
								: "opacity-40"
						}`}
					>
						<img src={tool.img} className="w-12 h-12" />
					</button>
				))}
			</div>
			<canvas
				ref={canvasRef}
				onMouseDown={(e) => {
					handleMouseDown(
						e.nativeEvent,
						chairs,
						cursorGridPosition.current!,
						rotation.current!,
						TOOL_LIST.get(selectedToolState)!,
						isMiddleClickDown,
						prevPosition,
						prevOffset,
						offset.current,
					);
					render();
				}}
				onMouseUp={(e) =>
					handleMouseUp(e.nativeEvent, isMiddleClickDown)
				}
				onMouseMove={(e) => {
					handleMouseMove(
						e.nativeEvent,
						cursorAbsPosition,
						cursorGridPosition,
						cellSize.current!,
						isMiddleClickDown.current,
						offset,
						prevOffset.current,
						prevPosition.current,
					);
					render();
				}}
				onWheel={(e) => {
					handleMouseWheel(e.nativeEvent, zoomLevel);
					render();
				}}
			></canvas>
		</>
	);
}

export default App;
